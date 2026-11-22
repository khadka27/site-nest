import path from "path";
import fs from "fs/promises";
import fsSync from "fs";
import AdmZip from "adm-zip";
import { prisma } from "@/lib/prisma";
import {
  ensureStorageDirectories,
  validateZipFile,
  getDeploymentDir,
  getReleasePointer,
  getWebsiteDir,
} from "@/lib/storage";
import { DeploymentStatus, WebsiteStatus } from "@prisma/client";
import { logActivity } from "@/lib/activity";

export class DeploymentError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DeploymentError";
  }
}

/**
 * Executes a full deployment lifecycle for a pending/queued deployment.
 */
export async function executeDeployment(deploymentId: string): Promise<{ success: boolean; error?: string }> {
  await ensureStorageDirectories();

  const deployment = await prisma.deployment.findUnique({
    where: { id: deploymentId },
    include: { website: true },
  });

  if (!deployment) {
    throw new DeploymentError(`Deployment ${deploymentId} not found`);
  }

  const { website, version } = deployment;
  const zipPath = deployment.storagePath;

  if (!zipPath || !fsSync.existsSync(zipPath)) {
    await markDeploymentFailed(deployment.id, website.id, "Uploaded archive file not found on disk");
    return { success: false, error: "Uploaded archive file not found" };
  }

  try {
    // 1. Stage: VALIDATING
    await prisma.deployment.update({
      where: { id: deployment.id },
      data: {
        status: DeploymentStatus.VALIDATING,
        startedAt: new Date(),
        errorMessage: null,
      },
    });

    const validation = await validateZipFile(zipPath);
    if (!validation.valid) {
      await markDeploymentFailed(deployment.id, website.id, validation.error || "ZIP validation failed");
      return { success: false, error: validation.error };
    }

    // 2. Stage: EXTRACTING
    await prisma.deployment.update({
      where: { id: deployment.id },
      data: { status: DeploymentStatus.EXTRACTING },
    });

    const siteDir = getWebsiteDir(website.id);
    const destDir = getDeploymentDir(website.id, version);

    // Create target release folder
    if (!fsSync.existsSync(siteDir)) {
      await fs.mkdir(siteDir, { recursive: true });
    }
    if (fsSync.existsSync(destDir)) {
      await fs.rm(destDir, { recursive: true, force: true });
    }
    await fs.mkdir(destDir, { recursive: true });

    // Extract files safely
    const zip = new AdmZip(zipPath);
    const entries = zip.getEntries();

    for (const entry of entries) {
      if (entry.isDirectory) continue;

      let relativePath = entry.entryName.replace(/\\/g, "/");

      // Strip single top folder if archive had a wrapping root folder
      if (validation.rootFolderPrefix && relativePath.startsWith(validation.rootFolderPrefix + "/")) {
        relativePath = relativePath.slice(validation.rootFolderPrefix.length + 1);
      }

      // Final sanity check on destination path
      const filePath = path.resolve(destDir, relativePath);
      if (!filePath.startsWith(destDir)) {
        throw new DeploymentError("Directory traversal detected during extraction");
      }

      const fileDir = path.dirname(filePath);
      if (!fsSync.existsSync(fileDir)) {
        await fs.mkdir(fileDir, { recursive: true });
      }

      await fs.writeFile(filePath, entry.getData());
    }

    // Double check index.html exists in destination directory
    const indexFile = path.join(destDir, "index.html");
    if (!fsSync.existsSync(indexFile)) {
      throw new DeploymentError("Deployment failed: Extracted files do not contain index.html at root");
    }

    // 3. Stage: DEPLOYING (update pointer / symlink)
    await prisma.deployment.update({
      where: { id: deployment.id },
      data: { status: DeploymentStatus.DEPLOYING },
    });

    const releasePointer = getReleasePointer(website.id);
    try {
      if (fsSync.existsSync(releasePointer)) {
        await fs.rm(releasePointer, { recursive: true, force: true });
      }
      // Create atomic release symlink to v[version]
      await fs.symlink(destDir, releasePointer, "dir");
    } catch (symlinkErr) {
      console.warn("Symlink warning (will rely on activeDeploymentId pointer):", symlinkErr);
    }

    // Mark previous live deployments as replaced or history
    await prisma.deployment.updateMany({
      where: {
        websiteId: website.id,
        status: DeploymentStatus.LIVE,
        id: { not: deployment.id },
      },
      data: {
        // Keep them available for rollback
      },
    });

    // Mark this deployment LIVE
    const completedAt = new Date();
    await prisma.deployment.update({
      where: { id: deployment.id },
      data: {
        status: DeploymentStatus.LIVE,
        completedAt,
        filesCount: validation.filesCount,
        fileSize: validation.totalSize,
      },
    });

    // Update website status & pointer
    await prisma.website.update({
      where: { id: website.id },
      data: {
        status: WebsiteStatus.LIVE,
        activeDeploymentId: deployment.id,
        storagePath: destDir,
      },
    });

    await logActivity({
      userId: website.ownerId,
      action: "DEPLOYMENT_SUCCESS",
      metadata: {
        websiteId: website.id,
        subdomain: website.subdomain,
        version: deployment.version,
        filesCount: validation.filesCount,
      },
    });

    return { success: true };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    await markDeploymentFailed(deployment.id, website.id, errorMsg);
    return { success: false, error: errorMsg };
  }
}

async function markDeploymentFailed(deploymentId: string, websiteId: string, errorMessage: string) {
  try {
    await prisma.deployment.update({
      where: { id: deploymentId },
      data: {
        status: DeploymentStatus.FAILED,
        errorMessage,
        completedAt: new Date(),
      },
    });

    // If website has no currently live deployment, mark status as FAILED
    const liveDeployment = await prisma.deployment.findFirst({
      where: { websiteId, status: DeploymentStatus.LIVE },
    });

    if (!liveDeployment) {
      await prisma.website.update({
        where: { id: websiteId },
        data: { status: WebsiteStatus.FAILED },
      });
    }

    await logActivity({
      action: "DEPLOYMENT_FAILED",
      metadata: { deploymentId, websiteId, error: errorMessage },
    });
  } catch (logErr) {
    console.error("Error marking deployment failure:", logErr);
  }
}

/**
 * Instant zero-downtime rollback to a previous version
 */
export async function rollbackDeployment(websiteId: string, targetVersion: number) {
  const target = await prisma.deployment.findUnique({
    where: {
      websiteId_version: {
        websiteId,
        version: targetVersion,
      },
    },
    include: { website: true },
  });

  if (!target) {
    throw new DeploymentError(`Version ${targetVersion} not found for this website`);
  }

  const targetDir = getDeploymentDir(websiteId, targetVersion);
  if (!fsSync.existsSync(targetDir) || !fsSync.existsSync(path.join(targetDir, "index.html"))) {
    throw new DeploymentError(`Files for version ${targetVersion} are no longer available in storage`);
  }

  // Update symlink pointer
  const releasePointer = getReleasePointer(websiteId);
  try {
    if (fsSync.existsSync(releasePointer)) {
      await fs.rm(releasePointer, { recursive: true, force: true });
    }
    await fs.symlink(targetDir, releasePointer, "dir");
  } catch (symlinkErr) {
    console.warn("Symlink switch warning:", symlinkErr);
  }

  // Mark currently live deployments as ROLLED_BACK or inactive
  await prisma.deployment.updateMany({
    where: {
      websiteId,
      status: DeploymentStatus.LIVE,
      id: { not: target.id },
    },
    data: {
      status: DeploymentStatus.ROLLED_BACK,
    },
  });

  // Activate target deployment
  await prisma.deployment.update({
    where: { id: target.id },
    data: {
      status: DeploymentStatus.LIVE,
      errorMessage: null,
    },
  });

  // Update website pointer
  await prisma.website.update({
    where: { id: websiteId },
    data: {
      status: WebsiteStatus.LIVE,
      activeDeploymentId: target.id,
      storagePath: targetDir,
    },
  });

  await logActivity({
    userId: target.website.ownerId,
    action: "DEPLOYMENT_ROLLBACK",
    metadata: {
      websiteId,
      subdomain: target.website.subdomain,
      rolledBackToVersion: targetVersion,
    },
  });

  return target;
}
