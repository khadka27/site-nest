import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { isAdmin } from "@/lib/permissions";
import { isValidSubdomain } from "@/lib/utils";
import { getWebsiteDir } from "@/lib/storage";
import fs from "fs/promises";
import fsSync from "fs";
import { logActivity } from "@/lib/activity";
import { z } from "zod";

const updateSiteSchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().max(500).optional(),
  categoryId: z.string().nullable().optional(),
  subdomain: z.string().min(3).max(32).optional(),
});

// GET /api/sites/[id]
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const website = await prisma.website.findFirst({
    where: {
      OR: [{ id }, { slug: id }, { subdomain: id }],
    },
    include: {
      category: true,
      owner: { select: { id: true, name: true, email: true } },
      domains: true,
      deployments: {
        orderBy: { version: "desc" },
        take: 10,
      },
    },
  });

  if (!website) {
    return NextResponse.json({ error: "Website not found" }, { status: 404 });
  }

  return NextResponse.json({ website });
}

// PATCH /api/sites/[id]
export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const website = await prisma.website.findUnique({ where: { id } });
  if (!website) {
    return NextResponse.json({ error: "Website not found" }, { status: 404 });
  }

  if (website.ownerId !== session.userId && !isAdmin(session.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const result = updateSiteSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0]?.message || "Invalid input" }, { status: 400 });
    }

    const { name, description, categoryId, subdomain } = result.data;

    if (subdomain && subdomain !== website.subdomain) {
      const normalizedSubdomain = subdomain.toLowerCase().trim();
      if (!isValidSubdomain(normalizedSubdomain)) {
        return NextResponse.json({ error: "Invalid or reserved subdomain" }, { status: 400 });
      }

      const existing = await prisma.website.findUnique({
        where: { subdomain: normalizedSubdomain },
      });
      if (existing && existing.id !== id) {
        return NextResponse.json({ error: "Subdomain is already taken" }, { status: 409 });
      }
    }

    const updated = await prisma.website.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(categoryId !== undefined && { categoryId }),
        ...(subdomain && { subdomain: subdomain.toLowerCase().trim() }),
      },
      include: { category: true },
    });

    await logActivity({
      userId: session.userId,
      action: "WEBSITE_UPDATE",
      metadata: { websiteId: id, changes: body },
    });

    return NextResponse.json({ website: updated });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE /api/sites/[id]
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const website = await prisma.website.findUnique({ where: { id } });
  if (!website) {
    return NextResponse.json({ error: "Website not found" }, { status: 404 });
  }

  if (website.ownerId !== session.userId && !isAdmin(session.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Delete files from storage
  const siteDir = getWebsiteDir(id);
  if (fsSync.existsSync(siteDir)) {
    try {
      await fs.rm(siteDir, { recursive: true, force: true });
    } catch (rmErr) {
      console.warn("Could not delete directory:", rmErr);
    }
  }

  await prisma.website.delete({ where: { id } });

  await logActivity({
    userId: session.userId,
    action: "WEBSITE_DELETE",
    metadata: { websiteId: id, subdomain: website.subdomain },
  });

  return NextResponse.json({ success: true });
}
