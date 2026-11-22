import { prisma } from "./prisma";
import { Prisma } from "@prisma/client";

export async function logActivity(params: {
  userId?: string | null;
  action: string;
  metadata?: Prisma.InputJsonValue;
  ipAddress?: string | null;
}) {
  try {
    return await prisma.activityLog.create({
      data: {
        userId: params.userId || null,
        action: params.action,
        metadata: params.metadata ?? Prisma.JsonNull,
        ipAddress: params.ipAddress || null,
      },
    });
  } catch (err) {
    console.error("Failed to write activity log:", err);
  }
}
