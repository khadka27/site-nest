import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/permissions";

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { errorResponse } = await requireAdmin();
  if (errorResponse) return errorResponse;

  const { id } = await context.params;
  await prisma.category.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
