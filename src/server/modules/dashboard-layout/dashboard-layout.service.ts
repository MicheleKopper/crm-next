import "server-only";

import { requireSession } from "@/server/auth/permissions";
import * as dashboardLayoutRepository from "./dashboard-layout.repository";
import {
  DEFAULT_DASHBOARD_LAYOUT,
  dashboardLayoutInputSchema,
  mergeDashboardLayout,
  type DashboardLayoutItem,
} from "./dashboard-layout.dto";

export async function getResolvedLayout(): Promise<DashboardLayoutItem[]> {
  const session = await requireSession();
  const saved = await dashboardLayoutRepository.getByUserId(session.sub);
  if (!saved) return DEFAULT_DASHBOARD_LAYOUT;
  return mergeDashboardLayout(saved.layout);
}

export async function saveLayout(input: unknown): Promise<DashboardLayoutItem[]> {
  const session = await requireSession();
  const { items } = dashboardLayoutInputSchema.parse(input);
  const merged = mergeDashboardLayout(items);
  await dashboardLayoutRepository.upsert(session.sub, merged);
  return merged;
}

export async function resetLayout(): Promise<DashboardLayoutItem[]> {
  const session = await requireSession();
  await dashboardLayoutRepository.deleteByUserId(session.sub);
  return DEFAULT_DASHBOARD_LAYOUT;
}
