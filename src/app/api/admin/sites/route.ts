import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/permissions";

export async function GET(req: NextRequest) {
  const { errorResponse } = await requireAdmin();
  if (errorResponse) return errorResponse;

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20")));
  const skip = (page - 1) * limit;

  const where = {
    ...(status && { status: status as any }),
    ...(search && {
      OR: [
        { name: { contains: search, mode: "insensitive" as const } },
        { subdomain: { contains: search, mode: "insensitive" as const } },
        { owner: { email: { contains: search, mode: "insensitive" as const } } },
      ],
    }),
  };

  const [sites, total] = await Promise.all([
    prisma.website.findMany({
      where,
      include: {
        owner: { select: { id: true, name: true, email: true } },
        category: true,
        deployments: {
          orderBy: { version: "desc" },
          take: 1,
        },
      },
      orderBy: { createdAt: "desc" },
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
}
