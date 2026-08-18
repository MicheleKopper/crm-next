import "server-only";

import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/server/shared/prisma";
import type {
  CreateProductInput,
  CreatePurchaseOrderInput,
  ExportPurchaseOrdersQuery,
  ListPurchaseOrdersQuery,
  UpdatePurchaseOrderInput,
} from "./purchase-order.dto";

const PO_NUMBER_PREFIX = "BRFPO";

export type PurchaseOrderListRow = {
  uid: string;
  poNumber: string | null;
  poDate: Date | null;
  arrivalDate: Date | null;
  clearenceDate: Date | null;
  flexitankCount: number;
};

const SORT_COLUMNS: Record<ListPurchaseOrdersQuery["sortBy"], Prisma.Sql> = {
  poNumber: Prisma.sql`po."po_number"`,
  poDate: Prisma.sql`po."po_date"`,
  arrivalDate: Prisma.sql`po."arrival_date"`,
  clearenceDate: Prisma.sql`po."clearence_date"`,
  createdAt: Prisma.sql`po."created_at"`,
};

function buildConditions(query: {
  search?: string;
  status?: "Completed" | "Expected";
  poDateFrom?: string;
  poDateUntil?: string;
  arrivalDateFrom?: string;
  arrivalDateUntil?: string;
}): Prisma.Sql[] {
  const conditions: Prisma.Sql[] = [];

  if (query.search) {
    const pattern = `%${query.search}%`;
    conditions.push(Prisma.sql`(
      COALESCE(po."po_number", '') ILIKE ${pattern} OR
      COALESCE(po."temp_admission_number", '') ILIKE ${pattern} OR
      COALESCE(po."bl_number", '') ILIKE ${pattern} OR
      COALESCE(po."proforma_number", '') ILIKE ${pattern} OR
      COALESCE(po."packing_list_number", '') ILIKE ${pattern}
    )`);
  }
  if (query.status === "Completed")
    conditions.push(Prisma.sql`po."clearence_date" IS NOT NULL`);
  if (query.status === "Expected")
    conditions.push(Prisma.sql`po."clearence_date" IS NULL`);
  if (query.poDateFrom)
    conditions.push(Prisma.sql`po."po_date" >= ${query.poDateFrom}::date`);
  if (query.poDateUntil)
    conditions.push(
      Prisma.sql`po."po_date" < (${query.poDateUntil}::date + interval '1 day')`
    );
  if (query.arrivalDateFrom)
    conditions.push(Prisma.sql`po."arrival_date" >= ${query.arrivalDateFrom}::date`);
  if (query.arrivalDateUntil)
    conditions.push(
      Prisma.sql`po."arrival_date" < (${query.arrivalDateUntil}::date + interval '1 day')`
    );

  return conditions;
}

export async function listPurchaseOrders(
  query: ListPurchaseOrdersQuery
): Promise<{ items: PurchaseOrderListRow[]; totalCount: number }> {
  const conditions = buildConditions(query);
  const where =
    conditions.length > 0 ? Prisma.join(conditions, " AND ") : Prisma.sql`TRUE`;
  const sortColumn = SORT_COLUMNS[query.sortBy];
  const sortDirection = query.sortDir === "desc" ? Prisma.sql`DESC` : Prisma.sql`ASC`;

  const rows = await prisma.$queryRaw<
    (PurchaseOrderListRow & { totalCount: bigint; flexitankCount: bigint })[]
  >(
    Prisma.sql`
      SELECT
        po."id" AS "uid",
        po."po_number" AS "poNumber",
        po."po_date" AS "poDate",
        po."arrival_date" AS "arrivalDate",
        po."clearence_date" AS "clearenceDate",
        COALESCE(f."flexitankCount", 0) AS "flexitankCount",
        COUNT(*) OVER() AS "totalCount"
      FROM "purchase_orders" po
      LEFT JOIN (
        SELECT "purchase_order_id", COUNT(*) AS "flexitankCount"
        FROM "flexitanks"
        GROUP BY "purchase_order_id"
      ) f ON f."purchase_order_id" = po."id"
      WHERE ${where}
      ORDER BY ${sortColumn} ${sortDirection} NULLS LAST, po."created_at" DESC
      LIMIT ${query.limit}
      OFFSET ${query.offset}
    `
  );

  const totalCount = rows.length > 0 ? Number(rows[0].totalCount) : 0;
  return {
    items: rows.map((row) => ({
      uid: row.uid,
      poNumber: row.poNumber,
      poDate: row.poDate,
      arrivalDate: row.arrivalDate,
      clearenceDate: row.clearenceDate,
      flexitankCount: Number(row.flexitankCount),
    })),
    totalCount,
  };
}

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function findPurchaseOrderByUid(uid: string) {
  if (!UUID_PATTERN.test(uid)) return null;
  return prisma.purchaseOrder.findUnique({
    where: { id: uid },
    include: {
      products: { orderBy: { createdAt: "asc" } },
      flexitanks: { orderBy: { status: "asc" } },
      accessories: { orderBy: { status: "asc" } },
    },
  });
}

export async function generateNextPoNumber(): Promise<string> {
  const yy = String(new Date().getFullYear()).slice(-2);
  const prefix = `${PO_NUMBER_PREFIX}${yy}`;

  const rows = await prisma.$queryRaw<{ poNumber: string }[]>(
    Prisma.sql`
      SELECT "po_number" AS "poNumber"
      FROM "purchase_orders"
      WHERE "po_number" LIKE ${`${prefix}%`}
      ORDER BY "po_number" DESC
      LIMIT 1
    `
  );

  const lastSerial = rows[0] ? Number(rows[0].poNumber.slice(prefix.length)) : 0;
  const nextSerial = String(lastSerial + 1).padStart(3, "0");
  return `${prefix}${nextSerial}`;
}

export async function createPurchaseOrder(
  poNumber: string,
  input: CreatePurchaseOrderInput
) {
  return prisma.purchaseOrder.create({
    data: {
      poNumber,
      poDate: input.poDate ? new Date(input.poDate) : undefined,
      tempAdmissionNumber: input.tempAdmissionNumber,
      tempAdmissionDate: input.tempAdmissionDate
        ? new Date(input.tempAdmissionDate)
        : undefined,
      arrivalDate: input.arrivalDate ? new Date(input.arrivalDate) : undefined,
      observations: input.observations,
    },
  });
}

const DATE_FIELDS = [
  "poDate",
  "tempAdmissionDate",
  "arrivalDate",
  "clearenceDate",
  "proformaDate",
  "packingListDate",
  "blDate",
] as const;

export async function updatePurchaseOrder(
  uid: string,
  input: UpdatePurchaseOrderInput
) {
  const data: Record<string, unknown> = { ...input };
  for (const field of DATE_FIELDS) {
    if (input[field] !== undefined) data[field] = new Date(input[field] as string);
  }

  return prisma.purchaseOrder.update({ where: { id: uid }, data });
}

export async function countRelatedRecords(poId: string) {
  const [flexitankCount, productCount, accessoryCount] = await Promise.all([
    prisma.flexitank.count({ where: { purchaseOrderId: poId } }),
    prisma.productPo.count({ where: { poId } }),
    prisma.accessory.count({ where: { purchaseOrderId: poId } }),
  ]);
  return { flexitankCount, productCount, accessoryCount };
}

export async function deletePurchaseOrder(uid: string) {
  return prisma.purchaseOrder.delete({ where: { id: uid } });
}

export async function createProduct(
  poId: string,
  userId: string,
  input: CreateProductInput
) {
  return prisma.productPo.create({
    data: {
      poId,
      userId,
      description: input.description,
      quantity: input.quantity,
      price: input.price,
      size: input.size,
      comments: input.comments,
      isFlexitank: input.isFlexitank,
    },
  });
}

export async function findProductByUid(uid: string) {
  if (!UUID_PATTERN.test(uid)) return null;
  return prisma.productPo.findUnique({ where: { id: uid } });
}

export async function updateProduct(uid: string, input: CreateProductInput) {
  return prisma.productPo.update({
    where: { id: uid },
    data: {
      description: input.description,
      quantity: input.quantity,
      price: input.price,
      size: input.size,
      comments: input.comments,
      isFlexitank: input.isFlexitank,
    },
  });
}

/** Sum of `quantity` for flexitank-flagged products of this PO, excluding one product uid. */
export async function sumFlexitankQuantityExcluding(
  poId: string,
  excludeProductUid: string
) {
  const result = await prisma.productPo.aggregate({
    where: { poId, isFlexitank: true, id: { not: excludeProductUid } },
    _sum: { quantity: true },
  });
  return result._sum.quantity ?? 0;
}

export async function countFlexitanksForPo(poId: string) {
  return prisma.flexitank.count({ where: { purchaseOrderId: poId } });
}

export async function createAntiBulgingBars(poId: string, quantityKit: number) {
  await prisma.accessory.createMany({
    data: Array.from({ length: quantityKit * 6 }, () => ({
      type: "anti_bulging_bars",
      purchaseOrderId: poId,
      status: "Available",
    })),
  });
  return quantityKit * 6;
}

export async function createHeatingPadAccessories(
  poId: string,
  items: { codePrefix: string; start: number; end: number; quantityKit: number }[]
) {
  return prisma.$transaction(async (tx) => {
    let count = 0;
    for (const item of items) {
      for (let current = item.start; current <= item.end; current++) {
        await tx.accessory.create({
          data: {
            type: "heating_pad",
            code: `${item.codePrefix}${String(current).padStart(3, "0")}`,
            quantityKit: item.quantityKit,
            status: "Available",
            purchaseOrderId: poId,
          },
        });
        count++;
      }
    }
    return count;
  });
}

export async function deleteAccessories(uids: string[]) {
  return prisma.accessory.deleteMany({ where: { id: { in: uids } } });
}

export type ExportRow = {
  poNumber: string | null;
  status: string;
  poDate: Date | null;
  tempAdmissionNumber: string | null;
  arrivalDate: Date | null;
  clearenceDate: Date | null;
  flexitankCount: number;
};

export async function findPurchaseOrdersForExport(
  query: ExportPurchaseOrdersQuery
): Promise<ExportRow[]> {
  const rows = await prisma.$queryRaw<
    (Omit<ExportRow, "status" | "flexitankCount"> & { flexitankCount: bigint })[]
  >(
    Prisma.sql`
      SELECT
        po."po_number" AS "poNumber",
        po."po_date" AS "poDate",
        po."temp_admission_number" AS "tempAdmissionNumber",
        po."arrival_date" AS "arrivalDate",
        po."clearence_date" AS "clearenceDate",
        COALESCE(f."flexitankCount", 0) AS "flexitankCount"
      FROM "purchase_orders" po
      LEFT JOIN (
        SELECT "purchase_order_id", COUNT(*) AS "flexitankCount"
        FROM "flexitanks"
        GROUP BY "purchase_order_id"
      ) f ON f."purchase_order_id" = po."id"
      WHERE po."created_at" >= ${query.from}::date
        AND po."created_at" < (${query.until}::date + interval '1 day')
      ORDER BY po."created_at" DESC
    `
  );

  return rows.map((row) => ({
    ...row,
    status: row.clearenceDate ? "Completed" : "Expected",
    flexitankCount: Number(row.flexitankCount),
  }));
}
