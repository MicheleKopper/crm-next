import "server-only";

import { NextResponse } from "next/server";

import { toErrorResponse } from "@/server/shared/errors";
import * as dashboardService from "./dashboard.service";

export async function getCustomerNew() {
  try {
    const result = await dashboardService.getCustomerNew();
    return NextResponse.json(result);
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function getCustomerTotal() {
  try {
    const result = await dashboardService.getCustomerTotal();
    return NextResponse.json(result);
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function getShipments() {
  try {
    const result = await dashboardService.getShipmentsSummary();
    return NextResponse.json(result);
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function getContainer() {
  try {
    const result = await dashboardService.getContainerSummary();
    return NextResponse.json(result);
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function getAnnualShipments() {
  try {
    const result = await dashboardService.getAnnualShipments();
    return NextResponse.json({ rows: result });
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function getShipmentType() {
  try {
    const result = await dashboardService.getShipmentTypeBreakdown();
    return NextResponse.json({ rows: result });
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function getStatusShipments() {
  try {
    const result = await dashboardService.getStatusShipments();
    return NextResponse.json({ rows: result });
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function getFlexitank() {
  try {
    const result = await dashboardService.getFlexitankAvailability();
    return NextResponse.json(result);
  } catch (error) {
    return toErrorResponse(error);
  }
}
