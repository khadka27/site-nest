import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/permissions";
import { slugify } from "@/lib/utils";

export async function GET() {
  const pages = await prisma.page.findMany({
    orderBy: { updatedAt: "desc" },
  });
  return NextResponse.json({ pages });
}

export async function POST(req: NextRequest) {
  const { errorResponse } = await requireAdmin();
  if (errorResponse) return errorResponse;

  const body = await req.json();
  const { title, slug, content, published } = body;

  if (!title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  const cleanSlug = slug ? slugify(slug) : slugify(title);

  const existing = await prisma.page.findUnique({ where: { slug: cleanSlug } });
  if (existing) {
    return NextResponse.json({ error: "Page slug already exists" }, { status: 409 });
  }

  const page = await prisma.page.create({
    data: {
      title,
      slug: cleanSlug,
      content: content || {},
      published: Boolean(published),
    },
  });

  return NextResponse.json({ page }, { status: 201 });
}
