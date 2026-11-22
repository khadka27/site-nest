import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/permissions";
import { slugify } from "@/lib/utils";
import { z } from "zod";

const categorySchema = z.object({
  name: z.string().min(2),
  slug: z.string().optional(),
  description: z.string().optional(),
});

export async function GET() {
  const categories = await prisma.category.findMany({
    include: {
      _count: { select: { websites: true } },
    },
    orderBy: { name: "asc" },
  });
  return NextResponse.json({ categories });
}

export async function POST(req: NextRequest) {
  const { errorResponse } = await requireAdmin();
  if (errorResponse) return errorResponse;

  const body = await req.json();
  const result = categorySchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: result.error.issues[0]?.message || "Invalid input" }, { status: 400 });
  }

  const { name, description } = result.data;
  const slug = result.data.slug ? slugify(result.data.slug) : slugify(name);

  const existing = await prisma.category.findUnique({ where: { slug } });
  if (existing) {
    return NextResponse.json({ error: "Category slug already exists" }, { status: 409 });
  }

  const category = await prisma.category.create({
    data: { name, slug, description },
  });

  return NextResponse.json({ category }, { status: 201 });
}
