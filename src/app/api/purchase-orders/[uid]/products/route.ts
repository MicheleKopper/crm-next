import type { NextRequest } from "next/server";

import * as purchaseOrderController from "@/server/modules/purchase-orders/purchase-order.controller";

export async function POST(
  request: NextRequest,
  ctx: RouteContext<"/api/purchase-orders/[uid]/products">
) {
  const { uid } = await ctx.params;
  return purchaseOrderController.createProduct(request, uid);
}
