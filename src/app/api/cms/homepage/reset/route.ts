import { NextResponse } from "next/server";
import { resetHomepageToDefaults, getHomepageSections } from "@/modules/cms/cmsService";
import { requireAdmin } from "@/lib/permissions";
import { logActivity } from "@/lib/activity";

export async function POST() {
  const { session, errorResponse } = await requireAdmin();
  if (errorResponse) return errorResponse;

  await resetHomepageToDefaults();

  await logActivity({
    userId: session?.userId,
    action: "CMS_RESET_DEFAULTS",
  });

  const sections = await getHomepageSections();
  return NextResponse.json({ success: true, sections });
}
