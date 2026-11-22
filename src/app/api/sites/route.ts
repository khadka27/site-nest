import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { slugify, isValidSubdomain } from "@/lib/utils";
import { logActivity } from "@/lib/activity";
import { WebsiteStatus } from "@prisma/client";
import { z } from "zod";

const createSiteSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  subdomain: z.string().min(3).max(32),
  categoryId: z.string().optional(),
  description: z.string().max(500).optional(),
});

// GET /api/sites: List public LIVE websites or filter by query/category
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "12")));
    const skip = (page - 1) * limit;

    const where = {
      status: WebsiteStatus.LIVE,
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { description: { contains: search, mode: "insensitive" as const } },
          { subdomain: { contains: search, mode: "insensitive" as const } },
        ],
      }),
      ...(category && {
        category: { slug: category },
      }),
    };

    const [sites, total] = await Promise.all([
      prisma.website.findMany({
        where,
        include: {
          category: true,
          owner: { select: { id: true, name: true } },
          deployments: {
            where: { status: "LIVE" },
            orderBy: { version: "desc" },
            take: 1,
            select: { version: true, completedAt: true, fileSize: true },
          },
        },
        orderBy: { updatedAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.website.count({ where }),
    ]);

    return NextResponse.json({
      sites,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST /api/sites: Create a new website
export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const result = createSiteSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0]?.message || "Invalid input" }, { status: 400 });
    }

    const { name, categoryId, description } = result.data;
    const normalizedSubdomain = result.data.subdomain.toLowerCase().trim();

    if (!isValidSubdomain(normalizedSubdomain)) {
      return NextResponse.json(
        { error: "Invalid or reserved subdomain. Use 3-32 alphanumeric characters and hyphens only." },
        { status: 400 }
      );
    }

    // Check unique subdomain
    const existing = await prisma.website.findUnique({
      where: { subdomain: normalizedSubdomain },
    });
    if (existing) {
      return NextResponse.json({ error: "This subdomain is already taken. Please choose another." }, { status: 409 });
    }

    // Generate unique slug
    let baseSlug = slugify(name);
    let slug = baseSlug;
    let counter = 1;
    while (await prisma.website.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const website = await prisma.website.create({
      data: {
        name,
        slug,
        subdomain: normalizedSubdomain,
        description,
        categoryId: categoryId || null,
        ownerId: session.userId,
        status: WebsiteStatus.DRAFT,
      },
      include: {
        category: true,
      },
    });

    await logActivity({
      userId: session.userId,
      action: "WEBSITE_CREATE",
      metadata: { websiteId: website.id, subdomain: website.subdomain },
    });

    return NextResponse.json({ website }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
