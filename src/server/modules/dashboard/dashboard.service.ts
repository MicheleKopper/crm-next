import "server-only";

import { requireSession } from "@/server/auth/permissions";
import * as dashboardRepository from "./dashboard.repository";

export async function getCustomerNew() {
  await requireSession();
  return dashboardRepository.getCustomerNew();
}

export async function getCustomerTotal() {
  await requireSession();
  return dashboardRepository.getCustomerTotal();
}

export async function getShipmentsSummary() {
  await requireSession();
  return dashboardRepository.getShipmentsSummary();
}

export async function getContainerSummary() {
  await requireSession();
  return dashboardRepository.getContainerSummary();
}

export async function getAnnualShipments() {
  await requireSession();
  return dashboardRepository.getAnnualShipments();
}

export async function getShipmentTypeBreakdown() {
  await requireSession();
  return dashboardRepository.getShipmentTypeBreakdown();
}

export async function getStatusShipments() {
  await requireSession();
  return dashboardRepository.getStatusShipments();
}

export async function getFlexitankAvailability() {
  await requireSession();
  return dashboardRepository.getFlexitankAvailability();
}
