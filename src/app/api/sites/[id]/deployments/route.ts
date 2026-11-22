import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { isAdmin } from "@/lib/permissions";

// GET /api/sites/[id]/deployments: List all deployments for a site
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const website = await prisma.website.findUnique({
      where: { id },
      select: { id: true, ownerId: true, activeDeploymentId: true },
    });

    if (!website) {
      return NextResponse.json({ error: "Website not found" }, { status: 404 });
    }

    if (website.ownerId !== session.userId && !isAdmin(session.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const deployments = await prisma.deployment.findMany({
      where: { websiteId: id },
      orderBy: { version: "desc" },
    });

    return NextResponse.json({
      deployments,
      activeDeploymentId: website.activeDeploymentId,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
