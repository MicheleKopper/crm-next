import "server-only";

import { Prisma } from "@/generated/prisma/client";

import type { DashboardFilterCondition, DashboardFilterState } from "./dashboard-filter.dto";
import { isConditionComplete } from "./dashboard-filter.dto";

const NUMBER_OPERATORS: Record<string, string> = {
  eq: "=",
  neq: "<>",
  gt: ">",
  gte: ">=",
  lt: "<",
  lte: "<=",
};

function conditionToSql(condition: DashboardFilterCondition): Prisma.Sql | null {
  switch (condition.field) {
    case "status": {
      const value = String(condition.value);
      return condition.operator === "is_not"
        ? Prisma.sql`s."status" IS DISTINCT FROM ${value}`
        : Prisma.sql`s."status" = ${value}`;
    }

    case "shipmentType": {
      const value = String(condition.value);
      return condition.operator === "is_not"
        ? Prisma.sql`s."shipment_type" IS DISTINCT FROM ${value}`
        : Prisma.sql`s."shipment_type" = ${value}`;
    }

    case "customer": {
      const value = String(condition.value);
      if (condition.operator === "equals") {
        return Prisma.sql`s."customer_id" IN (SELECT id FROM companies WHERE display_name = ${value})`;
      }
      const pattern = `%${value}%`;
      return condition.operator === "not_contains"
        ? Prisma.sql`s."customer_id" NOT IN (SELECT id FROM companies WHERE display_name ILIKE ${pattern})`
        : Prisma.sql`s."customer_id" IN (SELECT id FROM companies WHERE display_name ILIKE ${pattern})`;
    }

    case "vessel": {
      const value = String(condition.value);
      if (condition.operator === "equals") {
        return Prisma.sql`s."vessel" = ${value}`;
      }
      const pattern = `%${value}%`;
      return condition.operator === "not_contains"
        ? Prisma.sql`(s."vessel" IS NULL OR s."vessel" NOT ILIKE ${pattern})`
        : Prisma.sql`s."vessel" ILIKE ${pattern}`;
    }

    case "quantity": {
      const value = Number(condition.value);
      if (Number.isNaN(value)) return null;
      const op = NUMBER_OPERATORS[condition.operator] ?? "=";
      return Prisma.sql`s."quantity" ${Prisma.raw(op)} ${value}`;
    }

    case "date": {
      if (condition.operator === "between" && Array.isArray(condition.value)) {
        const [from, to] = condition.value;
        const fromDate = new Date(from);
        const toDate = new Date(to);
        if (Number.isNaN(fromDate.getTime()) || Number.isNaN(toDate.getTime())) return null;
        return Prisma.sql`COALESCE(s."atd", s."etd") BETWEEN ${fromDate} AND ${toDate}`;
      }
      const date = new Date(String(condition.value));
      if (Number.isNaN(date.getTime())) return null;
      if (condition.operator === "before") return Prisma.sql`COALESCE(s."atd", s."etd") < ${date}`;
      if (condition.operator === "after") return Prisma.sql`COALESCE(s."atd", s."etd") > ${date}`;
      return Prisma.sql`DATE_TRUNC('day', COALESCE(s."atd", s."etd")) = DATE_TRUNC('day', ${date}::timestamp)`;
    }

    default:
      return null;
  }
}

/**
 * Traduz o filtro global em condições `Prisma.Sql` prontas para entrar num
 * array de condições existente (mesmo padrão de `flexitank.repository.ts`),
 * assumindo que a query referencia a tabela de embarques como `s`.
 */
export function buildDashboardFilterConditions(filter: DashboardFilterState): Prisma.Sql[] {
  return filter.conditions
    .filter(isConditionComplete)
    .map(conditionToSql)
    .filter((sql): sql is Prisma.Sql => sql !== null);
}

export function joinDashboardFilterConditions(filter: DashboardFilterState): Prisma.Sql {
  const conditions = buildDashboardFilterConditions(filter);
  if (conditions.length === 0) return Prisma.sql`TRUE`;
  const separator = filter.connector === "OR" ? " OR " : " AND ";
  return Prisma.sql`(${Prisma.join(conditions, separator)})`;
}
