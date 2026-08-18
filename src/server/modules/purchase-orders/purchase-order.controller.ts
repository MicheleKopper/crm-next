import "server-only";

import { NextRequest, NextResponse } from "next/server";

import { toCsv } from "@/lib/csv";
import { toErrorResponse } from "@/server/shared/errors";
import {
  createAccessorySchema,
  createProductSchema,
  createPurchaseOrderSchema,
  deleteAccessoriesQuerySchema,
  exportPurchaseOrdersQuerySchema,
  listPurchaseOrdersQuerySchema,
  updateProductSchema,
  updatePurchaseOrderSchema,
} from "./purchase-order.dto";
import * as purchaseOrderService from "./purchase-order.service";

const EXPORT_COLUMNS = [
  { key: "poNumber", label: "Nº da PO" },
  { key: "status", label: "Status" },
  { key: "poDate", label: "Data da PO" },
  { key: "tempAdmissionNumber", label: "Admissão Temporária" },
  { key: "arrivalDate", label: "Chegada" },
  { key: "clearenceDate", label: "Liberação" },
  { key: "flexitankCount", label: "Nº de Flexitanks" },
];

function queryToObject(request: NextRequest) {
  return Object.fromEntries(request.nextUrl.searchParams.entries());
}

export async function listPurchaseOrders(request: NextRequest) {
  try {
    const query = listPurchaseOrdersQuerySchema.parse(queryToObject(request));
    const result = await purchaseOrderService.getPurchaseOrderList(query);
    return NextResponse.json(result);
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function createPurchaseOrder(request: NextRequest) {
  try {
    const input = createPurchaseOrderSchema.parse(await request.json());
    const result = await purchaseOrderService.createPurchaseOrder(input);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function getPurchaseOrder(uid: string) {
  try {
    const result = await purchaseOrderService.getPurchaseOrderByUid(uid);
    return NextResponse.json(result);
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function updatePurchaseOrder(request: NextRequest, uid: string) {
  try {
    const input = updatePurchaseOrderSchema.parse(await request.json());
    const result = await purchaseOrderService.updatePurchaseOrder(uid, input);
    return NextResponse.json(result);
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function deletePurchaseOrder(uid: string) {
  try {
    await purchaseOrderService.deletePurchaseOrder(uid);
    return NextResponse.json({ message: "Purchase order deletado com sucesso." });
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function createProduct(request: NextRequest, poId: string) {
  try {
    const input = createProductSchema.parse(await request.json());
    const result = await purchaseOrderService.createProduct(poId, input);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function updateProduct(
  request: NextRequest,
  poId: string,
  productUid: string
) {
  try {
    const input = updateProductSchema.parse(await request.json());
    const result = await purchaseOrderService.updateProduct(poId, productUid, input);
    return NextResponse.json(result);
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function createAccessory(request: NextRequest, poId: string) {
  try {
    const input = createAccessorySchema.parse(await request.json());
    const result = await purchaseOrderService.createAccessory(poId, input);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function deleteAccessories(request: NextRequest) {
  try {
    const query = deleteAccessoriesQuerySchema.parse(queryToObject(request));
    const result = await purchaseOrderService.deleteAccessories(query.uids);
    return NextResponse.json(result);
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function exportPurchaseOrders(request: NextRequest) {
  try {
    const query = exportPurchaseOrdersQuerySchema.parse(queryToObject(request));
    const rows = await purchaseOrderService.exportPurchaseOrdersCsv(query);
    const csv = toCsv(rows, EXPORT_COLUMNS);
    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="purchase-orders-${Date.now()}.csv"`,
      },
    });
  } catch (error) {
    return toErrorResponse(error);
  }
}
