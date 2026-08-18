import "server-only";

import { requireSession } from "@/server/auth/permissions";
import * as dashboardRepository from "./dashboard.repository";
import { EMPTY_DASHBOARD_FILTER_STATE, type DashboardFilterState } from "./dashboard-filter.dto";

export async function getCustomerNew() {
  await requireSession();
  return dashboardRepository.getCustomerNew();
}

export async function getCustomerTotal(filter: DashboardFilterState = EMPTY_DASHBOARD_FILTER_STATE) {
  await requireSession();
  return dashboardRepository.getCustomerTotal(filter);
}

export async function getShipmentsSummary(
  filter: DashboardFilterState = EMPTY_DASHBOARD_FILTER_STATE
) {
  await requireSession();
  return dashboardRepository.getShipmentsSummary(filter);
}

export async function getContainerSummary(
  filter: DashboardFilterState = EMPTY_DASHBOARD_FILTER_STATE
) {
  await requireSession();
  return dashboardRepository.getContainerSummary(filter);
}

export async function getAnnualShipments(
  filter: DashboardFilterState = EMPTY_DASHBOARD_FILTER_STATE
) {
  await requireSession();
  return dashboardRepository.getAnnualShipments(filter);
}

export async function getShipmentTypeBreakdown(
  filter: DashboardFilterState = EMPTY_DASHBOARD_FILTER_STATE
) {
  await requireSession();
  return dashboardRepository.getShipmentTypeBreakdown(filter);
}

export async function getStatusShipments(
  filter: DashboardFilterState = EMPTY_DASHBOARD_FILTER_STATE
) {
  await requireSession();
  return dashboardRepository.getStatusShipments(filter);
}

export async function getFlexitankAvailability() {
  await requireSession();
  return dashboardRepository.getFlexitankAvailability();
}
