import "server-only";

import { Prisma } from "@/generated/prisma/client";
import { requirePermission, requireSession } from "@/server/auth/permissions";
import { ConflictError, NotFoundError } from "@/server/shared/errors";
import type {
  CreateAccessoryInput,
  CreateProductInput,
  CreatePurchaseOrderInput,
  ExportPurchaseOrdersQuery,
  ListPurchaseOrdersQuery,
  UpdatePurchaseOrderInput,
} from "./purchase-order.dto";
import { toPurchaseOrderDetail } from "./purchase-order.mapper";
import * as purchaseOrderRepository from "./purchase-order.repository";

/**
 * With the `@prisma/adapter-pg` driver adapter, a P2002 error's offending column(s) show up
 * at `meta.driverAdapterError.cause.constraint.fields` instead of the classic `meta.target` —
 * check both so this keeps working if the driver-adapter error shape changes again.
 */
function getUniqueConstraintFields(error: unknown): string[] {
  if (!(error instanceof Prisma.PrismaClientKnownRequestError) || error.code !== "P2002") {
    return [];
  }
  const meta = error.meta as
    | { target?: unknown; driverAdapterError?: { cause?: { constraint?: { fields?: unknown } } } }
    | undefined;
  if (Array.isArray(meta?.target)) return meta.target as string[];
  const nestedFields = meta?.driverAdapterError?.cause?.constraint?.fields;
  if (Array.isArray(nestedFields)) return nestedFields as string[];
  return [];
}

function isCodeUniqueViolation(error: unknown) {
  return getUniqueConstraintFields(error).includes("code");
}

function isPoNumberUniqueViolation(error: unknown) {
  return getUniqueConstraintFields(error).includes("po_number");
}

export async function getPurchaseOrderList(query: ListPurchaseOrdersQuery) {
  await requireSession();
  return purchaseOrderRepository.listPurchaseOrders(query);
}

export async function getPurchaseOrderByUid(uid: string) {
  await requireSession();
  const po = await purchaseOrderRepository.findPurchaseOrderByUid(uid);
  if (!po) {
    throw new NotFoundError("Purchase order não localizado.");
  }
  return toPurchaseOrderDetail(po);
}

export async function createPurchaseOrder(input: CreatePurchaseOrderInput) {
  const session = await requireSession();
  requirePermission(session, "purchase_orders_create");

  const poNumber = await purchaseOrderRepository.generateNextPoNumber();
  const po = await purchaseOrderRepository.createPurchaseOrder(poNumber, input);
  return { uid: po.id, poNumber: po.poNumber };
}

export async function updatePurchaseOrder(
  uid: string,
  input: UpdatePurchaseOrderInput
) {
  const session = await requireSession();
  requirePermission(session, "purchase_orders_edit");

  const existing = await purchaseOrderRepository.findPurchaseOrderByUid(uid);
  if (!existing) {
    throw new NotFoundError("Purchase order não localizado.");
  }

  try {
    await purchaseOrderRepository.updatePurchaseOrder(uid, input);
  } catch (error) {
    if (isPoNumberUniqueViolation(error)) {
      throw new ConflictError("Número da PO já existente.");
    }
    throw error;
  }
  return { uid };
}

export async function deletePurchaseOrder(uid: string) {
  const session = await requireSession();
  requirePermission(session, "purchase_orders_delete");

  const existing = await purchaseOrderRepository.findPurchaseOrderByUid(uid);
  if (!existing) {
    throw new NotFoundError("Purchase order não localizado.");
  }

  const { flexitankCount, productCount, accessoryCount } =
    await purchaseOrderRepository.countRelatedRecords(uid);
  if (flexitankCount > 0 || productCount > 0 || accessoryCount > 0) {
    const parts = [
      flexitankCount > 0 ? `${flexitankCount} flexitank(s)` : null,
      productCount > 0 ? `${productCount} produto(s)` : null,
      accessoryCount > 0 ? `${accessoryCount} acessório(s)` : null,
    ].filter(Boolean);
    throw new ConflictError(
      `Não é possível excluir: existem ${parts.join(", ")} vinculados a esta PO.`
    );
  }

  await purchaseOrderRepository.deletePurchaseOrder(uid);
}

export async function createProduct(poId: string, input: CreateProductInput) {
  const session = await requireSession();
  requirePermission(session, "purchase_orders_edit");

  const po = await purchaseOrderRepository.findPurchaseOrderByUid(poId);
  if (!po) {
    throw new NotFoundError("Purchase order não localizado.");
  }

  const product = await purchaseOrderRepository.createProduct(
    poId,
    session.sub,
    input
  );
  return { uid: product.id };
}

export async function updateProduct(
  poId: string,
  productUid: string,
  input: CreateProductInput
) {
  const session = await requireSession();
  requirePermission(session, "purchase_orders_edit");

  const existing = await purchaseOrderRepository.findProductByUid(productUid);
  if (!existing || existing.poId !== poId) {
    throw new NotFoundError("Produto não encontrado.");
  }

  const otherTotal = await purchaseOrderRepository.sumFlexitankQuantityExcluding(
    poId,
    productUid
  );
  const flexitankCount = await purchaseOrderRepository.countFlexitanksForPo(poId);
  const newTotal = otherTotal + (input.isFlexitank ? input.quantity : 0);
  if (newTotal < flexitankCount) {
    throw new ConflictError(
      "O número de produtos alterados não pode ser inferior ao de flexitanks adicionados."
    );
  }

  await purchaseOrderRepository.updateProduct(productUid, input);
  return { uid: productUid };
}

export async function createAccessory(poId: string, input: CreateAccessoryInput) {
  const session = await requireSession();
  requirePermission(session, "accessories_create");

  const po = await purchaseOrderRepository.findPurchaseOrderByUid(poId);
  if (!po) {
    throw new NotFoundError("Purchase order não localizado.");
  }

  if (input.type === "anti_bulging_bars") {
    const count = await purchaseOrderRepository.createAntiBulgingBars(
      poId,
      input.quantityKit
    );
    return { count };
  }

  try {
    const count = await purchaseOrderRepository.createHeatingPadAccessories(
      poId,
      input.items
    );
    return { count };
  } catch (error) {
    if (isCodeUniqueViolation(error)) {
      throw new ConflictError("Número de série já existente.");
    }
    throw error;
  }
}

export async function deleteAccessories(uids: string[]) {
  const session = await requireSession();
  requirePermission(session, "accessories_delete");

  await purchaseOrderRepository.deleteAccessories(uids);
  return { count: uids.length };
}

export async function exportPurchaseOrdersCsv(query: ExportPurchaseOrdersQuery) {
  await requireSession();
  const rows = await purchaseOrderRepository.findPurchaseOrdersForExport(query);
  if (rows.length === 0) {
    throw new NotFoundError("Nenhuma purchase order para exportação foi localizada.");
  }
  return rows;
}
