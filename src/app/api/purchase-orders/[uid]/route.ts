import type { NextRequest } from "next/server";

import * as purchaseOrderController from "@/server/modules/purchase-orders/purchase-order.controller";

export async function GET(
  _request: NextRequest,
  ctx: RouteContext<"/api/purchase-orders/[uid]">
) {
  const { uid } = await ctx.params;
  return purchaseOrderController.getPurchaseOrder(uid);
}

export async function PATCH(
  request: NextRequest,
  ctx: RouteContext<"/api/purchase-orders/[uid]">
) {
  const { uid } = await ctx.params;
  return purchaseOrderController.updatePurchaseOrder(request, uid);
}

export async function DELETE(
  _request: NextRequest,
  ctx: RouteContext<"/api/purchase-orders/[uid]">
) {
  const { uid } = await ctx.params;
  return purchaseOrderController.deletePurchaseOrder(uid);
}
