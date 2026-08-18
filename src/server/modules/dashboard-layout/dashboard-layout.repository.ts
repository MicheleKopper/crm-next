import "server-only";

import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/server/shared/prisma";
import type { DashboardLayoutItem } from "./dashboard-layout.dto";

export async function getByUserId(userId: string) {
  return prisma.dashboardLayout.findUnique({ where: { userId } });
}

export async function upsert(userId: string, items: DashboardLayoutItem[]) {
  const layout = items as unknown as Prisma.InputJsonValue;
  return prisma.dashboardLayout.upsert({
    where: { userId },
    create: { userId, layout },
    update: { layout },
  });
}

export async function deleteByUserId(userId: string) {
  await prisma.dashboardLayout.deleteMany({ where: { userId } });
}
