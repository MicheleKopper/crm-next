import type { NextRequest } from "next/server";

import * as leadController from "@/server/modules/leads/lead.controller";

export async function GET(
  _request: NextRequest,
  ctx: RouteContext<"/api/leads/[uid]">
) {
  const { uid } = await ctx.params;
  return leadController.getLead(uid);
}

export async function PATCH(
  request: NextRequest,
  ctx: RouteContext<"/api/leads/[uid]">
) {
  const { uid } = await ctx.params;
  return leadController.updateLead(request, uid);
}

export async function DELETE(
  _request: NextRequest,
  ctx: RouteContext<"/api/leads/[uid]">
) {
  const { uid } = await ctx.params;
  return leadController.deleteLead(uid);
}
