import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/permissions";

export async function GET(req: NextRequest) {
  const { errorResponse } = await requireAdmin();
  if (errorResponse) return errorResponse;

  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "30")));
  const skip = (page - 1) * limit;

  const [logs, total] = await Promise.all([
    prisma.activityLog.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.activityLog.count(),
  ]);

  return NextResponse.json({
    logs,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  });
}
