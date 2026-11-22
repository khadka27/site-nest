import { NextRequest, NextResponse } from "next/server";
import { getHomepageSections, updateHomepageSection } from "@/modules/cms/cmsService";
import { requireAdmin } from "@/lib/permissions";
import { logActivity } from "@/lib/activity";

// GET /api/cms/homepage: returns all sections
export async function GET() {
  try {
    const sections = await getHomepageSections();
    return NextResponse.json({ sections });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// PUT /api/cms/homepage: update a section
export async function PUT(req: NextRequest) {
  const { session, errorResponse } = await requireAdmin();
  if (errorResponse) return errorResponse;

  try {
    const body = await req.json();
    const { sectionKey, title, enabled, order, content } = body;

    if (!sectionKey) {
      return NextResponse.json({ error: "sectionKey is required" }, { status: 400 });
    }

    const updated = await updateHomepageSection(sectionKey, {
      title,
      enabled,
      order,
      content,
    });

    await logActivity({
      userId: session?.userId,
      action: "CMS_UPDATE_SECTION",
      metadata: { sectionKey },
    });

    return NextResponse.json({ section: updated });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
