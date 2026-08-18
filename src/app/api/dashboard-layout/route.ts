import type { NextRequest } from "next/server";

import * as dashboardLayoutController from "@/server/modules/dashboard-layout/dashboard-layout.controller";

export async function PUT(request: NextRequest) {
  return dashboardLayoutController.saveLayout(request);
}

export async function DELETE() {
  return dashboardLayoutController.resetLayout();
}
