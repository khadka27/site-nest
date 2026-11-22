import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/permissions";

const DEFAULT_SETTINGS = [
  { key: "platform_name", value: "SiteNest" },
  { key: "base_domain", value: "sitenest.com" },
  { key: "website_base_domain", value: "sitenestusercontent.com" },
  { key: "max_upload_size_mb", value: 50 },
  { key: "max_uncompressed_mb", value: 250 },
  { key: "max_files_count", value: 3000 },
  { key: "allow_user_registration", value: true },
];

export async function GET() {
  const { errorResponse } = await requireAdmin();
  if (errorResponse) return errorResponse;

  const dbSettings = await prisma.setting.findMany();
  const settingsMap: Record<string, unknown> = {};

  for (const item of DEFAULT_SETTINGS) {
    settingsMap[item.key] = item.value;
  }
  for (const item of dbSettings) {
    settingsMap[item.key] = item.value;
  }

  return NextResponse.json({ settings: settingsMap });
}

export async function PUT(req: NextRequest) {
  const { errorResponse } = await requireAdmin();
  if (errorResponse) return errorResponse;

  const body = await req.json();

  for (const [key, value] of Object.entries(body)) {
    await prisma.setting.upsert({
      where: { key },
      update: { value: value as any },
      create: { key, value: value as any },
    });
  }

  return NextResponse.json({ success: true, message: "Settings saved successfully" });
}
