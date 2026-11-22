import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/permissions";
import { WebsiteStatus, DeploymentStatus } from "@prisma/client";

export async function GET() {
  const { errorResponse } = await requireAdmin();
  if (errorResponse) return errorResponse;

  const [
    totalWebsites,
    liveWebsites,
    suspendedWebsites,
    totalUsers,
    totalDeployments,
    deploymentsToday,
    recentLogs,
    recentDeployments,
  ] = await Promise.all([
    prisma.website.count(),
    prisma.website.count({ where: { status: WebsiteStatus.LIVE } }),
    prisma.website.count({ where: { status: WebsiteStatus.SUSPENDED } }),
    prisma.user.count(),
    prisma.deployment.count(),
    prisma.deployment.count({
      where: {
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    }),
    prisma.activityLog.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { id: true, name: true, email: true } } },
    }),
    prisma.deployment.findMany({
      take: 8,
      orderBy: { createdAt: "desc" },
      include: {
        website: { select: { id: true, name: true, subdomain: true } },
      },
    }),
  ]);

  // Aggregate total storage used
  const storageAgg = await prisma.deployment.aggregate({
    _sum: { fileSize: true },
    where: { status: DeploymentStatus.LIVE },
  });

  return NextResponse.json({
    metrics: {
      totalWebsites,
      liveWebsites,
      suspendedWebsites,
      totalUsers,
      totalDeployments,
      deploymentsToday,
      totalStorageBytes: storageAgg._sum.fileSize || 0,
    },
    recentLogs,
    recentDeployments,
  });
}
