import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/permissions";
import { WebsiteStatus } from "@prisma/client";
import { logActivity } from "@/lib/activity";
import { z } from "zod";

const statusSchema = z.object({
  status: z.nativeEnum(WebsiteStatus),
});

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { session, errorResponse } = await requireAdmin();
  if (errorResponse) return errorResponse;

  const { id } = await context.params;
  const body = await req.json();
  const result = statusSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json({ error: result.error.issues[0]?.message || "Invalid input" }, { status: 400 });
  }

  const site = await prisma.website.update({
    where: { id },
    data: { status: result.data.status },
  });

  await logActivity({
    userId: session?.userId,
    action: `WEBSITE_${result.data.status}`,
    metadata: { websiteId: id, newStatus: result.data.status },
  });

  return NextResponse.json({ website: site });
}
