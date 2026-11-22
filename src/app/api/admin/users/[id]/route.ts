import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, isSuperAdmin } from "@/lib/permissions";
import { UserRole } from "@prisma/client";
import { logActivity } from "@/lib/activity";
import { z } from "zod";

const updateUserSchema = z.object({
  role: z.nativeEnum(UserRole).optional(),
  name: z.string().min(2).optional(),
});

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { session, errorResponse } = await requireAdmin();
  if (errorResponse) return errorResponse;

  const { id } = await context.params;
  const body = await req.json();
  const result = updateUserSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json({ error: result.error.errors[0].message }, { status: 400 });
  }

  // Only super admin can grant or revoke SUPER_ADMIN role
  if (result.data.role === "SUPER_ADMIN" && !isSuperAdmin(session?.role)) {
    return NextResponse.json({ error: "Only Super Admins can promote to Super Admin" }, { status: 403 });
  }

  const updated = await prisma.user.update({
    where: { id },
    data: result.data,
    select: { id: true, name: true, email: true, role: true },
  });

  await logActivity({
    userId: session?.userId,
    action: "USER_UPDATE",
    metadata: { targetUserId: id, changes: result.data },
  });

  return NextResponse.json({ user: updated });
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { session, errorResponse } = await requireAdmin();
  if (errorResponse) return errorResponse;

  const { id } = await context.params;
  if (session?.userId === id) {
    return NextResponse.json({ error: "Cannot delete your own account" }, { status: 400 });
  }

  await prisma.user.delete({ where: { id } });

  await logActivity({
    userId: session?.userId,
    action: "USER_DELETE",
    metadata: { targetUserId: id },
  });

  return NextResponse.json({ success: true });
}
