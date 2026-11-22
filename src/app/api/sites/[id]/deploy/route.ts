import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { isAdmin } from "@/lib/permissions";
import { queueDeployment } from "@/modules/deployments/queue";

// POST /api/sites/[id]/deploy: Re-trigger or manually dispatch deployment
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
      return NextResponse.json({ error: "Website not found" }, { status: 404 });
    }

    if (website.ownerId !== session.userId && !isAdmin(session.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const latest = website.deployments[0];
    if (!latest) {
      return NextResponse.json({ error: "No deployments available to run" }, { status: 400 });
    }

    await queueDeployment(latest.id);

    return NextResponse.json({
      success: true,
      deploymentId: latest.id,
      message: "Deployment dispatched successfully",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
