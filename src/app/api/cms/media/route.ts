import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/permissions";
import path from "path";
import fs from "fs/promises";
import fsSync from "fs";


export async function GET() {
  const media = await prisma.media.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  return NextResponse.json({ media });
}

export async function POST(req: NextRequest) {
  const { errorResponse } = await requireAdmin();
  if (errorResponse) return errorResponse;

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const publicMediaDir = path.join(process.cwd(), "public", "uploads");
    if (!fsSync.existsSync(publicMediaDir)) {
      await fs.mkdir(publicMediaDir, { recursive: true });
    }

    const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const filePath = path.join(publicMediaDir, safeName);

    const bytes = await file.arrayBuffer();
    await fs.writeFile(filePath, Buffer.from(bytes));

    const media = await prisma.media.create({
      data: {
        filename: file.name,
        url: `/uploads/${safeName}`,
        mimeType: file.type || "application/octet-stream",
        size: file.size,
      },
    });

    return NextResponse.json({ media }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
