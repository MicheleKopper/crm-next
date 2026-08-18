import type { NextRequest } from "next/server";

import * as purchaseOrderController from "@/server/modules/purchase-orders/purchase-order.controller";

export async function GET(request: NextRequest) {
  return purchaseOrderController.listPurchaseOrders(request);
}

export async function POST(request: NextRequest) {
  return purchaseOrderController.createPurchaseOrder(request);
}
