import type { NextRequest } from "next/server";

import * as leadController from "@/server/modules/leads/lead.controller";

/**
 * Richer variant of GET /api/leads with nested company/contact/owner records.
 * Not called by any screen yet in this iteration — see lead.repository.ts.
 */
export async function GET(request: NextRequest) {
  return leadController.listLeadsWithDetails(request);
}
