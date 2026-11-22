import { UserRole } from "@prisma/client";
import { getSession } from "./auth";
import { NextResponse } from "next/server";

export function isAdmin(role: UserRole | string | undefined | null): boolean {
  return role === "ADMIN" || role === "SUPER_ADMIN";
}

export function isSuperAdmin(role: UserRole | string | undefined | null): boolean {
  return role === "SUPER_ADMIN";
}

export async function requireAuth() {
  const session = await getSession();
  if (!session) {
    return { session: null, errorResponse: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  return { session, errorResponse: null };
}

export async function requireAdmin() {
  const { session, errorResponse } = await requireAuth();
  if (errorResponse) return { session: null, errorResponse };

  if (!isAdmin(session?.role)) {
    return { session: null, errorResponse: NextResponse.json({ error: "Forbidden: Admin privileges required" }, { status: 403 }) };
  }

  return { session, errorResponse: null };
}
