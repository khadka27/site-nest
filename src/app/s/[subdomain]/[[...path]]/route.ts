import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import path from "path";
import fs from "fs/promises";
import fsSync from "fs";
import mime from "mime-types";
import { getReleasePointer, getWebsiteDir } from "@/lib/storage";
import { WebsiteStatus } from "@prisma/client";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ subdomain: string; path?: string[] }> }
) {
  const { subdomain, path: pathSegments } = await context.params;

  // 1. Look up website by subdomain or custom domain
  const website = await prisma.website.findFirst({
    where: {
      OR: [
        { subdomain: subdomain.toLowerCase() },
        { slug: subdomain.toLowerCase() },
        { domains: { some: { hostname: subdomain.toLowerCase() } } },
      ],
    },
    include: {
      deployments: {
        where: { status: "LIVE" },
        orderBy: { version: "desc" },
        take: 1,
      },
    },
  });

  if (!website) {
    return new NextResponse(
      `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Website Not Found — SiteNest</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #09090b; color: #f4f4f5; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; text-align: center; }
    .card { background: #18181b; border: 1px solid #27272a; padding: 2.5rem; border-radius: 1rem; max-width: 480px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.5); }
    h1 { font-size: 1.5rem; margin-bottom: 0.5rem; color: #fff; }
    p { color: #a1a1aa; line-height: 1.6; margin-bottom: 1.5rem; }
    a { display: inline-block; background: #4f46e5; color: #fff; padding: 0.6rem 1.25rem; border-radius: 0.5rem; text-decoration: none; font-weight: 500; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Subdomain Not Registered</h1>
    <p>The subdomain <strong>${subdomain}</strong> is not associated with any active website on SiteNest.</p>
    <a href="/">Go to SiteNest Home</a>
  </div>
</body>
</html>`,
      { status: 404, headers: { "Content-Type": "text/html; charset=utf-8" } }
    );
  }

  // 2. Check site status
  if (website.status === WebsiteStatus.SUSPENDED) {
    return new NextResponse(
      `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Website Suspended — SiteNest</title>
  <style>
    body { font-family: sans-serif; background: #0f172a; color: #f8fafc; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; text-align: center; }
    .card { background: #1e293b; border: 1px solid #ef4444; padding: 2.5rem; border-radius: 1rem; max-width: 480px; }
    h1 { color: #ef4444; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Website Suspended</h1>
    <p>This website (${website.name}) has been temporarily suspended by the platform administrator.</p>
  </div>
</body>
</html>`,
      { status: 403, headers: { "Content-Type": "text/html; charset=utf-8" } }
    );
  }

  if (website.status === WebsiteStatus.DEPLOYING || website.status === WebsiteStatus.DRAFT) {
    return new NextResponse(
      `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Deploying — ${website.name}</title>
  <meta http-equiv="refresh" content="5">
  <style>
    body { font-family: sans-serif; background: #09090b; color: #fafafa; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; text-align: center; }
    .card { background: #18181b; border: 1px solid #27272a; padding: 2.5rem; border-radius: 1rem; }
    .spinner { border: 3px solid rgba(255,255,255,0.1); border-top: 3px solid #6366f1; border-radius: 50%; width: 36px; height: 36px; animation: spin 1s linear infinite; margin: 0 auto 1.5rem; }
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
  </style>
</head>
<body>
  <div class="card">
    <div class="spinner"></div>
    <h2>Deployment in Progress</h2>
    <p>${website.name} is currently publishing files. This page will refresh automatically.</p>
  </div>
</body>
</html>`,
      { status: 200, headers: { "Content-Type": "text/html; charset=utf-8" } }
    );
  }

  // 3. Resolve active release storage directory
  let targetDir = website.storagePath;
  if (!targetDir || !fsSync.existsSync(targetDir)) {
    // Check release pointer symlink or latest live deployment
    const pointer = getReleasePointer(website.id);
    if (fsSync.existsSync(pointer)) {
      targetDir = pointer;
    } else if (website.deployments.length > 0 && website.deployments[0].storagePath) {
      targetDir = website.deployments[0].storagePath;
    } else {
      targetDir = path.join(getWebsiteDir(website.id), "current");
    }
  }

  if (!fsSync.existsSync(targetDir)) {
    return new NextResponse("Static files directory not found on server", { status: 404 });
  }

  // 4. Resolve requested file path safely
  const relativeSubpath = pathSegments && pathSegments.length > 0 ? pathSegments.join("/") : "";
  let requestedFile = path.resolve(targetDir, relativeSubpath);

  // Defense against path traversal outside the website directory
  if (!requestedFile.startsWith(path.resolve(targetDir))) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  // If path is directory or empty, serve index.html
  if (fsSync.existsSync(requestedFile) && fsSync.statSync(requestedFile).isDirectory()) {
    requestedFile = path.join(requestedFile, "index.html");
  } else if (!fsSync.existsSync(requestedFile)) {
    // Check clean URLs (e.g. /about -> /about.html)
    if (fsSync.existsSync(requestedFile + ".html")) {
      requestedFile = requestedFile + ".html";
    } else {
      // Fallback to 404.html if exists in site root
      const custom404 = path.join(targetDir, "404.html");
      if (fsSync.existsSync(custom404)) {
        requestedFile = custom404;
      } else {
        return new NextResponse("File Not Found", { status: 404 });
      }
    }
  }

  try {
    const fileBuffer = await fs.readFile(requestedFile);
    const contentType = mime.lookup(requestedFile) || "application/octet-stream";

    // Set secure response headers
    const headers = new Headers();
    headers.set("Content-Type", contentType);
    headers.set("X-Content-Type-Options", "nosniff");
    headers.set("Cache-Control", "public, max-age=3600, must-revalidate");
    // Frame options allowed so platform can showcase preview in iframe
    headers.set("X-Frame-Options", "SAMEORIGIN");
    headers.set("X-Served-By", "SiteNest-Edge");

    return new NextResponse(fileBuffer, { status: 200, headers });
  } catch (readErr) {
    console.error("Error serving static file:", readErr);
    return new NextResponse("Error reading file", { status: 500 });
  }
}
