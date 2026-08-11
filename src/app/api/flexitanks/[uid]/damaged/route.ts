import type { NextRequest } from "next/server";

import * as flexitankController from "@/server/modules/flexitanks/flexitank.controller";

export async function PATCH(
  request: NextRequest,
  ctx: RouteContext<"/api/flexitanks/[uid]/damaged">
) {
  const { uid } = await ctx.params;
  return flexitankController.markFlexitankDamaged(request, uid);
}
