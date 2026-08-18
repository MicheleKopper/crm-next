import type { NextRequest } from "next/server";

import * as flexitankController from "@/server/modules/flexitanks/flexitank.controller";

export async function POST(request: NextRequest) {
  return flexitankController.createFlexitanksBatch(request);
}
