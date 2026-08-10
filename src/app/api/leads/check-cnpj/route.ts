import type { NextRequest } from "next/server";

import * as leadController from "@/server/modules/leads/lead.controller";

export async function GET(request: NextRequest) {
  return leadController.checkCnpj(request);
}
