import * as flexitankController from "@/server/modules/flexitanks/flexitank.controller";

export async function GET() {
  return flexitankController.listLocations();
}
