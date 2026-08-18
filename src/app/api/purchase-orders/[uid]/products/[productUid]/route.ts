import type { NextRequest } from "next/server";

import * as purchaseOrderController from "@/server/modules/purchase-orders/purchase-order.controller";

export async function PATCH(
  request: NextRequest,
  ctx: RouteContext<"/api/purchase-orders/[uid]/products/[productUid]">
) {
  const { uid, productUid } = await ctx.params;
  return purchaseOrderController.updateProduct(request, uid, productUid);
}
