import type { NextRequest } from "next/server";

import * as flexitankController from "@/server/modules/flexitanks/flexitank.controller";

export async function GET(request: NextRequest) {
  return flexitankController.exportFlexitanks(request);
}
