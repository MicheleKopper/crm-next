import type { NextRequest } from "next/server";

import * as leadController from "@/server/modules/leads/lead.controller";

export async function PATCH(
  request: NextRequest,
  ctx: RouteContext<"/api/leads/[uid]/contact">
) {
  const { uid } = await ctx.params;
  return leadController.updateLeadContact(request, uid);
}
