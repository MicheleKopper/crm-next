import type { NextRequest } from "next/server";

import * as flexitankController from "@/server/modules/flexitanks/flexitank.controller";

export async function GET(
  _request: NextRequest,
  ctx: RouteContext<"/api/flexitanks/[uid]">
) {
  const { uid } = await ctx.params;
  return flexitankController.getFlexitank(uid);
}

export async function PATCH(
  request: NextRequest,
  ctx: RouteContext<"/api/flexitanks/[uid]">
) {
  const { uid } = await ctx.params;
  return flexitankController.updateFlexitank(request, uid);
}
