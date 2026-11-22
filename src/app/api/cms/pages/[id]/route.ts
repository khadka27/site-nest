import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/permissions";
import { slugify } from "@/lib/utils";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { errorResponse } = await requireAdmin();
  if (errorResponse) return errorResponse;

  const { id } = await context.params;
  const body = await req.json();
  const { title, slug, content, published } = body;

  const updated = await prisma.page.update({
    where: { id },
    data: {
      ...(title && { title }),
      ...(slug && { slug: slugify(slug) }),
      ...(content !== undefined && { content }),
      ...(published !== undefined && { published }),
    },
  });

  return NextResponse.json({ page: updated });
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { errorResponse } = await requireAdmin();
  if (errorResponse) return errorResponse;

  const { id } = await context.params;
  await prisma.page.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
