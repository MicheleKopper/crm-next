import "server-only";

import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/server/shared/prisma";
import type {
  CreateLeadInput,
  ExportLeadsQuery,
  ListLeadsQuery,
  UpdateLeadContactInput,
  UpdateLeadInput,
} from "./lead.dto";

export type LeadListRow = {
  uid: string;
  contactName: string | null;
  displayName: string;
  legalName: string;
  status: string;
  urgency: string;
  modal: string;
  score: number;
  operatorFullName: string;
  lastInteractionAt: Date | null;
  createdAt: Date;
};

const SORT_COLUMNS: Record<ListLeadsQuery["sortBy"], Prisma.Sql> = {
  contactName: Prisma.sql`ct."full_name"`,
  createdAt: Prisma.sql`l."created_at"`,
  status: Prisma.sql`l."status"`,
  operatorFullName: Prisma.sql`u."full_name"`,
  urgency: Prisma.sql`l."urgency"`,
};

export async function listLeads(
  query: ListLeadsQuery
): Promise<{ items: LeadListRow[]; totalCount: number }> {
  const conditions = [Prisma.sql`1=1`];

  if (query.search) {
    const pattern = `%${query.search}%`;
    conditions.push(Prisma.sql`(
      co."display_name" ILIKE ${pattern} OR
      co."legal_name" ILIKE ${pattern} OR
      COALESCE(ct."full_name", '') ILIKE ${pattern} OR
      COALESCE(u."full_name", '') ILIKE ${pattern}
    )`);
  }
  if (query.status) conditions.push(Prisma.sql`l."status" = ${query.status}`);
  if (query.operatorId)
    conditions.push(Prisma.sql`l."operator_id" = ${query.operatorId}::uuid`);
  if (query.modal) conditions.push(Prisma.sql`l."modal" = ${query.modal}`);
  if (query.urgency) conditions.push(Prisma.sql`l."urgency" = ${query.urgency}`);

  const where = Prisma.join(conditions, " AND ");
  const sortColumn = SORT_COLUMNS[query.sortBy];
  const sortDirection = query.sortDir === "desc" ? Prisma.sql`DESC` : Prisma.sql`ASC`;

  const rows = await prisma.$queryRaw<(LeadListRow & { totalCount: bigint })[]>(
    Prisma.sql`
      SELECT
        l."id" AS "uid",
        ct."full_name" AS "contactName",
        co."display_name" AS "displayName",
        co."legal_name" AS "legalName",
        l."status",
        l."urgency",
        l."modal",
        l."score",
        COALESCE(u."full_name", '') AS "operatorFullName",
        l."last_interaction_at" AS "lastInteractionAt",
        l."created_at" AS "createdAt",
        COUNT(*) OVER() AS "totalCount"
      FROM "leads" l
      JOIN "companies" co ON co."id" = l."customer_id"
      LEFT JOIN "contacts" ct ON ct."id" = l."contact_id"
      LEFT JOIN "users" u ON u."id" = l."operator_id"
      WHERE ${where}
      ORDER BY ${sortColumn} ${sortDirection} NULLS LAST, l."created_at" DESC
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

export async function findLeadByUid(uid: string) {
  if (!UUID_PATTERN.test(uid)) return null;
  return prisma.lead.findUnique({
    where: { id: uid },
    include: { customer: true, operator: true, contact: true },
  });
}

export async function findCompanyByTaxId(taxId: string) {
  return prisma.company.findUnique({ where: { taxId } });
}

export async function createLead(input: CreateLeadInput) {
  return prisma.$transaction(async (tx) => {
    let customerId = input.companyUid;

    if (!customerId) {
      const existing = await tx.company.findUnique({
        where: { taxId: input.taxId },
      });
      if (existing) {
        customerId = existing.id;
      } else {
        const company = await tx.company.create({
          data: {
            displayName: input.displayName,
            legalName: input.legalName,
            taxId: input.taxId,
            foreignValue: input.isForeignCompany,
            country: input.country,
            companyType: ["Lead"],
          },
        });
        customerId = company.id;
      }
    }

    const contact = await tx.contact.create({
      data: {
        companyId: customerId,
        firstName: input.name,
        lastName: input.lastName,
        fullName: `${input.name} ${input.lastName}`.trim(),
        email: input.email,
        phoneNumber: input.phone,
        workPhone: input.workPhone,
        extension: input.extension,
        jobTitle: input.jobTitle,
        birthday: input.birthday,
        language: input.language,
      },
    });

    const lead = await tx.lead.create({
      data: {
        customerId,
        contactId: contact.id,
        operatorId: input.operatorId,
        status: input.status,
        source: input.source,
        campaign: input.campaign,
        urgency: input.urgency,
        score: input.score,
        currency: input.currency,
        modal: input.modal,
        estimatedVolume: input.estimatedVolume,
        volumeUnit: input.volumeUnit,
        painIdentified: input.painIdentified,
        interest: input.interest,
      },
    });

    return { lead, contact };
  });
}

export async function updateLead(uid: string, input: UpdateLeadInput) {
  return prisma.lead.update({ where: { id: uid }, data: input });
}

/**
 * `contactId` here is the Contact's own id (resolved by the service from the
 * lead beforehand) — Contact belongs to a Company, not to a single Lead, so
 * there's no `where: { leadId }` shortcut anymore.
 */
export async function updateContact(
  contactId: string,
  input: UpdateLeadContactInput
) {
  const { name, lastName, phone, ...rest } = input;
  const data: Prisma.ContactUpdateInput = { ...rest };
  if (phone !== undefined) data.phoneNumber = phone;

  if (name !== undefined || lastName !== undefined) {
    const current = await prisma.contact.findUniqueOrThrow({
      where: { id: contactId },
      select: { firstName: true, lastName: true },
    });
    const nextFirst = name ?? current.firstName;
    const nextLast = lastName ?? current.lastName;
    data.firstName = nextFirst;
    data.lastName = nextLast;
    data.fullName = `${nextFirst} ${nextLast}`.trim();
  }

  return prisma.contact.update({ where: { id: contactId }, data });
}

export async function deleteLead(uid: string) {
  return prisma.lead.delete({ where: { id: uid } });
}

export async function listOperatorOptions() {
  return prisma.user.findMany({
    select: { id: true, fullName: true },
    orderBy: { fullName: "asc" },
  });
}

export type LeadExportRow = {
  contactName: string | null;
  email: string | null;
  phone: string | null;
  jobTitle: string | null;
  displayName: string;
  legalName: string;
  status: string;
  source: string;
  campaign: string | null;
  urgency: string;
  score: number;
  modal: string;
  estimatedVolume: number;
  volumeUnit: string;
  currency: string | null;
  operatorFullName: string;
  createdAt: Date;
};

export async function findLeadsForExport(
  query: ExportLeadsQuery
): Promise<LeadExportRow[]> {
  return prisma.$queryRaw<LeadExportRow[]>(
    Prisma.sql`
      SELECT
        ct."full_name" AS "contactName",
        ct."email",
        ct."phone_number" AS "phone",
        ct."job_title" AS "jobTitle",
        co."display_name" AS "displayName",
        co."legal_name" AS "legalName",
        l."status",
        l."source",
        l."campaign",
        l."urgency",
        l."score",
        l."modal",
        l."estimated_volume" AS "estimatedVolume",
        l."volume_unit" AS "volumeUnit",
        l."currency",
        COALESCE(u."full_name", '') AS "operatorFullName",
        l."created_at" AS "createdAt"
      FROM "leads" l
      JOIN "companies" co ON co."id" = l."customer_id"
      LEFT JOIN "contacts" ct ON ct."id" = l."contact_id"
      LEFT JOIN "users" u ON u."id" = l."operator_id"
      WHERE l."created_at" >= ${query.from}::date
        AND l."created_at" < (${query.until}::date + interval '1 day')
      ORDER BY l."created_at" DESC
    `
  );
}

/**
 * Richer variant of `listLeads` with nested customer/contact/operator records.
 * Not wired to any UI yet in this iteration — kept ready for future screens
 * (e.g. a "leads for this company" widget) that need more than the flat row shape.
 */
export async function listLeadsWithDetails(query: ListLeadsQuery) {
  const where: Prisma.LeadWhereInput = {
    ...(query.status ? { status: query.status } : {}),
    ...(query.operatorId ? { operatorId: query.operatorId } : {}),
    ...(query.modal ? { modal: query.modal } : {}),
    ...(query.urgency ? { urgency: query.urgency } : {}),
    ...(query.search
      ? {
          OR: [
            { customer: { displayName: { contains: query.search, mode: "insensitive" } } },
            { customer: { legalName: { contains: query.search, mode: "insensitive" } } },
            { contact: { fullName: { contains: query.search, mode: "insensitive" } } },
          ],
        }
      : {}),
  };

  const [items, totalCount] = await Promise.all([
    prisma.lead.findMany({
      where,
      include: { customer: true, contact: true, operator: true },
      orderBy: { createdAt: query.sortDir },
      take: query.limit,
      skip: query.offset,
    }),
    prisma.lead.count({ where }),
  ]);

  return { items, totalCount };
}
