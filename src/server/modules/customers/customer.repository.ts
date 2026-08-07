import "server-only";

import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/server/shared/prisma";
import type {
  CreateCustomerInput,
  ExportCustomersQuery,
  ListCustomersQuery,
  UpdateCompanyInput,
  UpdateProfileInput,
} from "./customer.dto";

const CUSTOMER_TYPE_FILTER = Prisma.sql`c."company_type" @> '["Customer"]'::jsonb`;

export type CustomerListRow = {
  uid: string;
  displayName: string;
  legalName: string;
  taxId: string;
  country: string | null;
  segment: string | null;
  size: string | null;
  status: string | null;
  accountPotential: string | null;
  cargoType: string | null;
  ownerFullName: string;
  createdAt: Date;
};

const SORT_COLUMNS: Record<ListCustomersQuery["sortBy"], Prisma.Sql> = {
  displayName: Prisma.sql`c."display_name"`,
  createdAt: Prisma.sql`c."created_at"`,
  status: Prisma.sql`cp."status"`,
  ownerFullName: Prisma.sql`u."full_name"`,
  country: Prisma.sql`c."country"`,
};

/**
 * Raw SQL (via Prisma $queryRaw) instead of the query builder: this mirrors the
 * legacy `COUNT(*) OVER()` window function and `jsonb @>` containment check,
 * which the Prisma query builder cannot express directly.
 */
export async function listCustomers(
  query: ListCustomersQuery
): Promise<{ items: CustomerListRow[]; totalCount: number }> {
  const conditions = [CUSTOMER_TYPE_FILTER];

  if (query.search) {
    const pattern = `%${query.search}%`;
    conditions.push(Prisma.sql`(
      c."display_name" ILIKE ${pattern} OR
      c."legal_name" ILIKE ${pattern} OR
      c."tax_id" ILIKE ${pattern} OR
      COALESCE(u."full_name", '') ILIKE ${pattern}
    )`);
  }
  if (query.segment) conditions.push(Prisma.sql`cp."segment" = ${query.segment}`);
  if (query.size) conditions.push(Prisma.sql`cp."size" = ${query.size}`);
  if (query.status) conditions.push(Prisma.sql`cp."status" = ${query.status}`);
  if (query.accountPotential)
    conditions.push(Prisma.sql`cp."account_potential" = ${query.accountPotential}`);
  if (query.ownerId)
    conditions.push(Prisma.sql`c."owner_id" = ${query.ownerId}::uuid`);

  const where = Prisma.join(conditions, " AND ");
  const sortColumn = SORT_COLUMNS[query.sortBy];
  const sortDirection = query.sortDir === "desc" ? Prisma.sql`DESC` : Prisma.sql`ASC`;

  const rows = await prisma.$queryRaw<(CustomerListRow & { totalCount: bigint })[]>(
    Prisma.sql`
      SELECT
        c."id" AS "uid",
        c."display_name" AS "displayName",
        c."legal_name" AS "legalName",
        c."tax_id" AS "taxId",
        c."country",
        cp."segment",
        cp."size",
        cp."status",
        cp."account_potential" AS "accountPotential",
        cp."cargo_type" AS "cargoType",
        COALESCE(u."full_name", '') AS "ownerFullName",
        c."created_at" AS "createdAt",
        COUNT(*) OVER() AS "totalCount"
      FROM "companies" c
      LEFT JOIN "customer_profiles" cp ON cp."customer_id" = c."id"
      LEFT JOIN "users" u ON u."id" = c."owner_id"
      WHERE ${where}
      ORDER BY ${sortColumn} ${sortDirection} NULLS LAST, c."display_name" ASC
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

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function findCustomerByUid(uid: string) {
  if (!UUID_PATTERN.test(uid)) return null;
  return prisma.company.findFirst({
    where: { id: uid, companyType: { array_contains: "Customer" } },
    include: { customerProfile: true, owner: true },
  });
}

export async function existsCompanyWithTaxId(taxId: string, excludeUid?: string) {
  const found = await prisma.company.findFirst({
    where: { taxId, ...(excludeUid ? { id: { not: excludeUid } } : {}) },
    select: { id: true },
  });
  return Boolean(found);
}

export async function existsCompanyWithPhone(phone: string, excludeUid?: string) {
  const found = await prisma.company.findFirst({
    where: { phone, ...(excludeUid ? { id: { not: excludeUid } } : {}) },
    select: { id: true },
  });
  return Boolean(found);
}

export async function createCustomer(input: CreateCustomerInput) {
  return prisma.$transaction(async (tx) => {
    const company = await tx.company.create({
      data: {
        displayName: input.displayName,
        legalName: input.legalName,
        taxId: input.taxId,
        foreignValue: input.isForeignCompany,
        phone: input.phone,
        website: input.website,
        address1: input.address,
        number: input.number,
        address2: input.complement,
        city: input.city,
        state: input.state,
        country: input.country,
        postalCode: input.postalCode,
        companyType: ["Customer"],
        ownerId: input.ownerId,
      },
    });

    const profile = await tx.customerProfile.create({
      data: {
        customerId: company.id,
        segment: input.segment,
        size: input.size,
        status: input.status,
        source: input.source,
        sourceSpecify: input.sourceSpecify,
        accountPotential: input.accountPotential,
        estimatedVolume: input.estimatedVolume,
        volumeUnit: input.volumeUnit,
        currency: input.currency,
        incoterms: input.incoterms,
        mainRoutes: input.mainRoutes,
        cargoType: input.cargoType,
        restrictions: input.restrictions,
        notes: input.notes,
      },
    });

    return { company, profile };
  });
}

export async function updateCompany(uid: string, input: UpdateCompanyInput) {
  return prisma.company.update({
    where: { id: uid },
    data: {
      displayName: input.displayName,
      legalName: input.legalName,
      taxId: input.taxId,
      foreignValue: input.isForeignCompany,
      phone: input.phone,
      website: input.website,
      address1: input.address,
      number: input.number,
      address2: input.complement,
      city: input.city,
      state: input.state,
      country: input.country,
      postalCode: input.postalCode,
      ownerId: input.ownerId,
    },
  });
}

export async function upsertCustomerProfile(
  customerId: string,
  input: UpdateProfileInput
) {
  return prisma.customerProfile.upsert({
    where: { customerId },
    create: { customerId, ...input },
    update: input,
  });
}

export async function deleteCustomer(uid: string) {
  return prisma.company.delete({ where: { id: uid } });
}

export async function listOwnerOptions() {
  return prisma.user.findMany({
    select: { id: true, fullName: true },
    orderBy: { fullName: "asc" },
  });
}

export type ExportRow = {
  displayName: string;
  legalName: string;
  taxId: string;
  country: string | null;
  city: string | null;
  state: string | null;
  phone: string;
  website: string | null;
  segment: string | null;
  size: string | null;
  status: string | null;
  accountPotential: string | null;
  cargoType: string | null;
  estimatedVolume: number | null;
  volumeUnit: string | null;
  currency: string | null;
  ownerFullName: string;
  createdAt: Date;
};

export async function findCustomersForExport(
  query: ExportCustomersQuery
): Promise<ExportRow[]> {
  return prisma.$queryRaw<ExportRow[]>(
    Prisma.sql`
      SELECT
        c."display_name" AS "displayName",
        c."legal_name" AS "legalName",
        c."tax_id" AS "taxId",
        c."country",
        c."city",
        c."state",
        c."phone",
        c."website",
        cp."segment",
        cp."size",
        cp."status",
        cp."account_potential" AS "accountPotential",
        cp."cargo_type" AS "cargoType",
        cp."estimated_volume" AS "estimatedVolume",
        cp."volume_unit" AS "volumeUnit",
        cp."currency",
        COALESCE(u."full_name", '') AS "ownerFullName",
        c."created_at" AS "createdAt"
      FROM "companies" c
      LEFT JOIN "customer_profiles" cp ON cp."customer_id" = c."id"
      LEFT JOIN "users" u ON u."id" = c."owner_id"
      WHERE ${CUSTOMER_TYPE_FILTER}
        AND c."created_at" >= ${query.from}::date
        AND c."created_at" < (${query.until}::date + interval '1 day')
      ORDER BY c."display_name" ASC
    `
  );
}
