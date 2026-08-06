import type { NextRequest } from "next/server";

import * as customerController from "@/server/modules/customers/customer.controller";

export async function PATCH(
  request: NextRequest,
  ctx: RouteContext<"/api/customers/[uid]/profile">
) {
  const { uid } = await ctx.params;
  return customerController.updateCustomerProfile(request, uid);
}
