import "server-only";

import { NextResponse, type NextRequest } from "next/server";

import { toErrorResponse } from "@/server/shared/errors";
import * as dashboardLayoutService from "./dashboard-layout.service";

export async function saveLayout(request: NextRequest) {
  try {
    const result = await dashboardLayoutService.saveLayout(await request.json());
    return NextResponse.json(result);
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function resetLayout() {
  try {
    const result = await dashboardLayoutService.resetLayout();
    return NextResponse.json(result);
  } catch (error) {
    return toErrorResponse(error);
  }
}
