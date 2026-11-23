import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { isAdmin } from "@/lib/permissions";
import { PENDING_DIR, ensureStorageDirectories, MAX_ZIP_SIZE } from "@/lib/storage";
import { queueDeployment } from "@/modules/deployments/queue";
import { DeploymentStatus, WebsiteStatus } from "@prisma/client";
import path from "path";
import fs from "fs/promises";
import sharp from "sharp";
import { logActivity } from "@/lib/activity";

// POST /api/sites/[id]/upload: Uploads ZIP and product image, auto-compresses to WebP
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only administrators can upload ZIP archives and deploy products
    if (!isAdmin(session.role)) {
      return NextResponse.json(
        { error: "Forbidden: Viewer accounts cannot upload product ZIP archives. Only administrators have deployment privileges." },
        { status: 403 }
      );
    }

    const website = await prisma.website.findUnique({
      where: { id },
      include: {
        deployments: {
          orderBy: { version: "desc" },
          take: 1,
        },
      },
    });

    if (!website) {
      return NextResponse.json({ error: "Product website record not found" }, { status: 404 });
    }

    await ensureStorageDirectories();

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const productImage = formData.get("productImage") as File | null;
    const changeLog = (formData.get("changeLog") as string) || "ZIP upload";

    if (!file) {
      return NextResponse.json({ error: "No ZIP file provided" }, { status: 400 });
    }

    if (!file.name.toLowerCase().endsWith(".zip")) {
      return NextResponse.json({ error: "Only .zip archive files are accepted" }, { status: 400 });
    }

    if (file.size > MAX_ZIP_SIZE) {
      return NextResponse.json(
        { error: `File size exceeds the limit of ${MAX_ZIP_SIZE / (1024 * 1024)}MB` },
        { status: 400 }
      );
    }

    // Process & auto-compress product image to WebP if provided
    let productImageUrl: string | null = null;
    if (productImage && productImage.size > 0) {
      try {
        const imageBuffer = Buffer.from(await productImage.arrayBuffer());
        const compressedWebp = await sharp(imageBuffer)
          .resize({ width: 1200, height: 1200, fit: "inside", withoutEnlargement: true })
          .webp({ quality: 80, effort: 5 })
          .toBuffer();

        const uploadsDir = path.join(process.cwd(), "public", "uploads", "products");
        await fs.mkdir(uploadsDir, { recursive: true });

        const fileName = `${website.id}-${Date.now()}.webp`;
        const filePath = path.join(uploadsDir, fileName);
        await fs.writeFile(filePath, compressedWebp);

        productImageUrl = `/uploads/products/${fileName}`;
      } catch (imgErr) {
        console.warn("Product image WebP auto-compression warning:", imgErr);
      }
    }

    // Determine new version
    const lastVersion = website.deployments.length > 0 ? website.deployments[0].version : 0;
    const newVersion = lastVersion + 1;

    // Save ZIP to pending directory
    const tempFileName = `${website.id}-v${newVersion}-${Date.now()}.zip`;
    const tempFilePath = path.join(PENDING_DIR, tempFileName);

    const bytes = await file.arrayBuffer();
    await fs.writeFile(tempFilePath, Buffer.from(bytes));

    // Create Deployment record
    const deployment = await prisma.deployment.create({
      data: {
        websiteId: website.id,
        version: newVersion,
        status: DeploymentStatus.QUEUED,
        storagePath: tempFilePath,
        fileSize: file.size,
        changeLog,
      },
    });

    // Mark website as DEPLOYING & save WebP image URL if uploaded
    await prisma.website.update({
      where: { id: website.id },
      data: {
        status: WebsiteStatus.DEPLOYING,
        ...(productImageUrl ? { imageUrl: productImageUrl } : {}),
      },
    });

    await logActivity({
      userId: session.userId,
      action: "DEPLOYMENT_QUEUED",
      metadata: {
        websiteId: website.id,
        version: newVersion,
        fileSize: file.size,
        hasProductImage: Boolean(productImageUrl),
      },
    });

    // Enqueue job in BullMQ or fallback async execution
    await queueDeployment(deployment.id);

    return NextResponse.json({
      success: true,
      deployment,
      productImageUrl,
      message: `Version ${newVersion} queued for deployment. Images converted to WebP.`,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}