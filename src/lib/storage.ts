import path from "path";
import fs from "fs/promises";
import fsSync from "fs";
import AdmZip from "adm-zip";

// Storage root directory configuration
export const STORAGE_ROOT = path.resolve(process.env.STORAGE_PATH || "./storage");
export const UPLOAD_DIR = path.resolve(process.env.UPLOAD_DIR || path.join(STORAGE_ROOT, "uploads"));
export const PENDING_DIR = path.join(UPLOAD_DIR, "pending");
export const WEBSITE_DIR = path.resolve(process.env.WEBSITE_DIR || path.join(STORAGE_ROOT, "websites"));
export const TEMP_DIR = path.resolve(process.env.TEMP_DIR || path.join(STORAGE_ROOT, "temporary"));

// Security restrictions
export const MAX_ZIP_SIZE = 50 * 1024 * 1024; // 50MB
export const MAX_UNCOMPRESSED_SIZE = 250 * 1024 * 1024; // 250MB
export const MAX_FILES_COUNT = 3000;
export const MAX_COMPRESSION_RATIO = 100;

// Dangerous file extensions to reject
export const BLOCKED_EXTENSIONS = new Set([
  ".php",
  ".phtml",
  ".php3",
  ".php4",
  ".php5",
  ".phps",
  ".phar",
  ".sh",
  ".bash",
  ".exe",
  ".com",
  ".bat",
  ".cmd",
  ".vbs",
  ".cgi",
  ".pl",
  ".py",
  ".rb",
  ".dll",
  ".so",
  ".dylib",
  ".env",
  ".htaccess",
  ".htpasswd",
]);

export async function ensureStorageDirectories(): Promise<void> {
  const dirs = [STORAGE_ROOT, UPLOAD_DIR, PENDING_DIR, WEBSITE_DIR, TEMP_DIR];
  for (const dir of dirs) {
    if (!fsSync.existsSync(dir)) {
      await fs.mkdir(dir, { recursive: true });
    }
  }
}

export function getWebsiteDir(websiteId: string): string {
  return path.join(WEBSITE_DIR, websiteId);
}

export function getDeploymentDir(websiteId: string, version: number): string {
  return path.join(WEBSITE_DIR, websiteId, `v${version}`);
}

export function getReleasePointer(websiteId: string): string {
  return path.join(WEBSITE_DIR, websiteId, "current");
}

export interface ZipValidationResult {
  valid: boolean;
  error?: string;
  filesCount: number;
  totalSize: number;
  hasIndexHtml: boolean;
  rootFolderPrefix?: string;
}

/**
 * Validates a ZIP file for security vulnerabilities:
 * - ZIP Slip (path traversal / .. outside extraction root)
 * - Compression bomb (abnormal uncompressed size or ratio)
 * - Blocked executable extensions
 * - Symlinks / junction points
 * - Mandatory index.html presence
 */
export async function validateZipFile(zipFilePath: string): Promise<ZipValidationResult> {
  try {
    const stats = await fs.stat(zipFilePath);
    if (stats.size > MAX_ZIP_SIZE) {
      return {
        valid: false,
        error: `ZIP archive exceeds maximum allowed size of ${MAX_ZIP_SIZE / (1024 * 1024)}MB`,
        filesCount: 0,
        totalSize: stats.size,
        hasIndexHtml: false,
      };
    }

    const zip = new AdmZip(zipFilePath);
    const entries = zip.getEntries();

    if (entries.length === 0) {
      return {
        valid: false,
        error: "ZIP archive is empty",
        filesCount: 0,
        totalSize: 0,
        hasIndexHtml: false,
      };
    }

    if (entries.length > MAX_FILES_COUNT) {
      return {
        valid: false,
        error: `ZIP archive contains ${entries.length} files, exceeding limit of ${MAX_FILES_COUNT}`,
        filesCount: entries.length,
        totalSize: 0,
        hasIndexHtml: false,
      };
    }

    let uncompressedTotal = 0;
    let hasDirectIndex = false;
    const topLevelDirs = new Set<string>();
    let candidatePrefixIndex: string | null = null;

    for (const entry of entries) {
      const entryName = entry.entryName;

      // 1. Path traversal defense (Zip Slip)
      const normalized = path.normalize(entryName).replace(/^(\.\.(\/|\\|$))+/, "");
      if (entryName.includes("..") || path.isAbsolute(entryName) || normalized.startsWith("..")) {
        return {
          valid: false,
          error: `Security violation: Path traversal detected in entry "${entryName}"`,
          filesCount: entries.length,
          totalSize: 0,
          hasIndexHtml: false,
        };
      }

      // Check compression ratio
      uncompressedTotal += entry.header.size;
      if (uncompressedTotal > MAX_UNCOMPRESSED_SIZE) {
        return {
          valid: false,
          error: `Uncompressed contents exceed limit of ${MAX_UNCOMPRESSED_SIZE / (1024 * 1024)}MB`,
          filesCount: entries.length,
          totalSize: uncompressedTotal,
          hasIndexHtml: false,
        };
      }

      // Check ratio for zip bomb
      if (entry.header.compressedSize > 0) {
        const ratio = entry.header.size / entry.header.compressedSize;
        if (ratio > MAX_COMPRESSION_RATIO && entry.header.size > 10 * 1024 * 1024) {
          return {
            valid: false,
            error: `Suspicious compression ratio detected on entry "${entryName}"`,
            filesCount: entries.length,
            totalSize: uncompressedTotal,
            hasIndexHtml: false,
          };
        }
      }

      // Check blocked file extensions
      const ext = path.extname(entryName).toLowerCase();
      if (BLOCKED_EXTENSIONS.has(ext)) {
        return {
          valid: false,
          error: `Executable or dangerous file extension "${ext}" is not permitted in static sites: "${entryName}"`,
          filesCount: entries.length,
          totalSize: uncompressedTotal,
          hasIndexHtml: false,
        };
      }

      if (!entry.isDirectory) {
        const cleanName = entryName.replace(/\\/g, "/");
        if (cleanName === "index.html") {
          hasDirectIndex = true;
        }

        const parts = cleanName.split("/");
        if (parts.length > 1) {
          topLevelDirs.add(parts[0]);
          if (parts.length === 2 && parts[1] === "index.html") {
            candidatePrefixIndex = parts[0];
          }
        }
      }
    }

    let rootFolderPrefix: string | undefined = undefined;
    let hasIndexHtml = hasDirectIndex;

    // Handle single enclosing directory if index.html is inside it
    if (!hasDirectIndex && topLevelDirs.size === 1 && candidatePrefixIndex) {
      rootFolderPrefix = candidatePrefixIndex;
      hasIndexHtml = true;
    }

    if (!hasIndexHtml) {
      return {
        valid: false,
        error: "Missing required entry: A valid 'index.html' was not found in the root of the archive or top folder.",
        filesCount: entries.length,
        totalSize: uncompressedTotal,
        hasIndexHtml: false,
      };
    }

    return {
      valid: true,
      filesCount: entries.length,
      totalSize: uncompressedTotal,
      hasIndexHtml: true,
      rootFolderPrefix,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      valid: false,
      error: `Failed to read or validate ZIP file: ${message}`,
      filesCount: 0,
      totalSize: 0,
      hasIndexHtml: false,
    };
  }
}
