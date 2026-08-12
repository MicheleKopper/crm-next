import * as dashboardController from "@/server/modules/dashboard/dashboard.controller";

export async function GET() {
  return dashboardController.getContainer();
}
