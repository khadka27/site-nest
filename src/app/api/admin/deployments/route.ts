import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/permissions";
import { DeploymentStatus } from "@prisma/client";

export async function GET(req: NextRequest) {
  const { errorResponse } = await requireAdmin();
  if (errorResponse) return errorResponse;

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") || "";
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "25")));
  const skip = (page - 1) * limit;

  const where = {
    ...(status && { status: status as DeploymentStatus }),
  };

  const [deployments, total] = await Promise.all([
    prisma.deployment.findMany({
      where,
      include: {
        website: {
          select: {
            id: true,
            name: true,
            subdomain: true,
            owner: { select: { id: true, name: true, email: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.deployment.count({ where }),
  ]);

  return NextResponse.json({
    deployments,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  });
}
