import "server-only";

import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/server/shared/prisma";
import {
  FLEXITANK_SIZES,
  type ExportFlexitanksQuery,
  type ListFlexitanksQuery,
  type TransferFlexitanksInput,
  type UpdateFlexitankInput,
} from "./flexitank.dto";

export type FlexitankListRow = {
  uid: string;
  status: string;
  serialNumber: string;
  size: string;
  price: number;
  locationName: string | null;
  poNumber: string | null;
  tempAdmissionNumber: string | null;
  booking: string | null;
  container: string | null;
  loading: string | null;
};

const SORT_COLUMNS: Record<ListFlexitanksQuery["sortBy"], Prisma.Sql> = {
  serialNumber: Prisma.sql`f."serial_number"`,
  size: Prisma.sql`f."size"`,
  price: Prisma.sql`f."price"`,
  createdAt: Prisma.sql`f."created_at"`,
};

export async function listFlexitanks(
  query: ListFlexitanksQuery
): Promise<{ items: FlexitankListRow[]; totalCount: number }> {
  const conditions: Prisma.Sql[] = [];

  if (query.status) conditions.push(Prisma.sql`f."status" = ${query.status}`);
  if (query.search) {
    const pattern = `%${query.search}%`;
    conditions.push(Prisma.sql`(
      f."serial_number" ILIKE ${pattern} OR
      COALESCE(po."po_number", '') ILIKE ${pattern} OR
      COALESCE(co."display_name", '') ILIKE ${pattern}
    )`);
  }
  if (query.size) conditions.push(Prisma.sql`f."size" = ${query.size}`);
  if (query.locationId)
    conditions.push(Prisma.sql`f."location_id" = ${query.locationId}::uuid`);
  if (query.poNumber)
    conditions.push(Prisma.sql`po."po_number" ILIKE ${`%${query.poNumber}%`}`);
  if (query.booking)
    conditions.push(Prisma.sql`sh."booking" ILIKE ${`%${query.booking}%`}`);

  const where =
    conditions.length > 0 ? Prisma.join(conditions, " AND ") : Prisma.sql`TRUE`;
  const sortColumn = SORT_COLUMNS[query.sortBy];
  const sortDirection = query.sortDir === "desc" ? Prisma.sql`DESC` : Prisma.sql`ASC`;

  const rows = await prisma.$queryRaw<(FlexitankListRow & { totalCount: bigint })[]>(
    Prisma.sql`
      SELECT
        f."id" AS "uid",
        f."status",
        f."serial_number" AS "serialNumber",
        f."size",
        f."price",
        co."display_name" AS "locationName",
        po."po_number" AS "poNumber",
        po."temp_admission_number" AS "tempAdmissionNumber",
        sh."booking",
        c."container" AS "container",
        c."loading" AS "loading",
        COUNT(*) OVER() AS "totalCount"
      FROM "flexitanks" f
      LEFT JOIN "companies" co ON co."id" = f."location_id"
      LEFT JOIN "purchase_orders" po ON po."id" = f."purchase_order_id"
      LEFT JOIN "shipments" sh ON sh."id" = f."shipment_id"
      LEFT JOIN "containers" c ON c."flexitank_id" = f."id"
      WHERE ${where}
      ORDER BY (f."status" = 'Available') DESC, ${sortColumn} ${sortDirection} NULLS LAST, f."created_at" DESC
      LIMIT ${query.limit}
      OFFSET ${query.offset}
    `
  );

  const totalCount = rows.length > 0 ? Number(rows[0].totalCount) : 0;
  return {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    items: rows.map(({ totalCount, ...rest }) => rest),
    totalCount,
  };
}

export type FlexitankCounterRow = {
  portName: string | null;
  companyName: string;
  counts: Record<(typeof FLEXITANK_SIZES)[number], number>;
  total: number;
};

export async function getFlexitankCounter(): Promise<FlexitankCounterRow[]> {
  const sizeColumns = Prisma.join(
    FLEXITANK_SIZES.map(
      (size) =>
        Prisma.sql`COUNT(*) FILTER (WHERE f."size" = ${size} AND f."status" = 'Available') AS ${Prisma.raw(`"size_${size}"`)}`
    ),
    ", "
  );

  const rows = await prisma.$queryRaw<
    ({
      portName: string | null;
      companyName: string;
      total: bigint;
    } & Record<string, bigint>)[]
  >(
    Prisma.sql`
      SELECT
        p."port_name" AS "portName",
        co."display_name" AS "companyName",
        ${sizeColumns},
        COUNT(*) FILTER (WHERE f."status" = 'Available') AS "total"
      FROM "flexitank_depot" fd
      JOIN "ports" p ON p."id" = fd."port_id"
      JOIN "companies" co ON co."id" = fd."company_id"
      LEFT JOIN "flexitanks" f ON f."location_id" = co."id"
      GROUP BY p."port_name", co."display_name"
      ORDER BY p."port_name" ASC
    `
  );

  return rows.map((row) => ({
    portName: row.portName,
    companyName: row.companyName,
    counts: Object.fromEntries(
      FLEXITANK_SIZES.map((size) => [size, Number(row[`size_${size}`] ?? 0)])
    ) as Record<(typeof FLEXITANK_SIZES)[number], number>,
    total: Number(row.total),
  }));
}

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function findFlexitankByUid(uid: string) {
  if (!UUID_PATTERN.test(uid)) return null;
  return prisma.flexitank.findUnique({
    where: { id: uid },
    include: {
      location: true,
      purchaseOrder: true,
      shipment: {
        include: {
          customer: true,
          shipper: true,
          consignee: true,
          shippingLine: true,
          product: true,
          portLoad: true,
          portDischarge: true,
        },
      },
      containers: true,
    },
  });
}

export async function updateFlexitank(uid: string, input: UpdateFlexitankInput) {
  return prisma.flexitank.update({ where: { id: uid }, data: input });
}

export async function listLocationOptions() {
  return prisma.company.findMany({
    select: { id: true, displayName: true },
    orderBy: { displayName: "asc" },
  });
}

export async function searchFlexitanksForTransfer(search: string) {
  const pattern = `%${search}%`;
  return prisma.$queryRaw<
    { uid: string; serialNumber: string; poNumber: string | null; companyName: string | null; size: string }[]
  >(
    Prisma.sql`
      SELECT
        f."id" AS "uid",
        f."serial_number" AS "serialNumber",
        po."po_number" AS "poNumber",
        co."display_name" AS "companyName",
        f."size"
      FROM "flexitanks" f
      LEFT JOIN "companies" co ON co."id" = f."location_id"
      LEFT JOIN "purchase_orders" po ON po."id" = f."purchase_order_id"
      WHERE f."location_id" IS NOT NULL
        AND (
          f."serial_number" ILIKE ${pattern} OR
          COALESCE(po."po_number", '') ILIKE ${pattern} OR
          COALESCE(co."display_name", '') ILIKE ${pattern}
        )
      ORDER BY f."serial_number" ASC
      LIMIT 50
    `
  );
}

export async function transferFlexitanks(input: TransferFlexitanksInput) {
  return prisma.flexitank.updateMany({
    where: { id: { in: input.uids } },
    data: { locationId: input.locationId },
  });
}

export type FlexitankExportRow = {
  serialNumber: string;
  status: string;
  size: string;
  price: number;
  locationName: string | null;
  poNumber: string | null;
  booking: string | null;
  createdAt: Date;
};

export async function findFlexitanksForExport(
  query: ExportFlexitanksQuery
): Promise<FlexitankExportRow[]> {
  return prisma.$queryRaw<FlexitankExportRow[]>(
    Prisma.sql`
      SELECT
        f."serial_number" AS "serialNumber",
        f."status",
        f."size",
        f."price",
        co."display_name" AS "locationName",
        po."po_number" AS "poNumber",
        sh."booking",
        f."created_at" AS "createdAt"
      FROM "flexitanks" f
      LEFT JOIN "companies" co ON co."id" = f."location_id"
      LEFT JOIN "purchase_orders" po ON po."id" = f."purchase_order_id"
      LEFT JOIN "shipments" sh ON sh."id" = f."shipment_id"
      WHERE f."created_at" >= ${query.from}::date
        AND f."created_at" < (${query.until}::date + interval '1 day')
      ORDER BY f."created_at" DESC
    `
  );
}
