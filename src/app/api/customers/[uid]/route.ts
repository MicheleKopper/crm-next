import type { NextRequest } from "next/server";

import * as customerController from "@/server/modules/customers/customer.controller";

export async function GET(
  _request: NextRequest,
  ctx: RouteContext<"/api/customers/[uid]">
) {
  const { uid } = await ctx.params;
  return customerController.getCustomer(uid);
}

export async function PATCH(
  request: NextRequest,
  ctx: RouteContext<"/api/customers/[uid]">
) {
  const { uid } = await ctx.params;
  return customerController.updateCustomerCompany(request, uid);
}

export async function DELETE(
  _request: NextRequest,
  ctx: RouteContext<"/api/customers/[uid]">
) {
  const { uid } = await ctx.params;
  return customerController.deleteCustomer(uid);
}
