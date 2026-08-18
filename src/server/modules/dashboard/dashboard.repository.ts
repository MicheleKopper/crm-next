import "server-only";

import { Prisma } from "@/generated/prisma/client";
import { FLEXITANK_SIZES } from "@/server/modules/flexitanks/flexitank.dto";
import { prisma } from "@/server/shared/prisma";
import { joinDashboardFilterConditions } from "./dashboard-filter.repository";
import type { DashboardFilterState } from "./dashboard-filter.dto";
import type {
  AnnualShipmentPoint,
  CustomerNewSummary,
  CustomerTotalSummary,
  FlexitankAvailabilitySummary,
  PeriodSummary,
  ShipmentTypePoint,
  StatusShipmentRow,
} from "./dashboard.dto";
import { SHIPMENT_STATUS_COLORS } from "./dashboard.dto";

export async function getCustomerNew(): Promise<CustomerNewSummary> {
  const rows = await prisma.$queryRaw<CustomerNewSummary[]>`
    SELECT
      COUNT(*) FILTER (
        WHERE NOT EXISTS (
          SELECT 1 FROM quotes q
          WHERE q.customer_id = c.id
            AND DATE_TRUNC('month', q.created_at) = DATE_TRUNC('month', CURRENT_DATE)
        )
        AND NOT EXISTS (
          SELECT 1 FROM shipments s
          WHERE s.customer_id = c.id
            AND DATE_TRUNC('month', s.created_at) = DATE_TRUNC('month', CURRENT_DATE)
        )
      )::int AS leads,

      COUNT(*) FILTER (
        WHERE EXISTS (
          SELECT 1 FROM quotes q
          WHERE q.customer_id = c.id
            AND DATE_TRUNC('month', q.created_at) = DATE_TRUNC('month', CURRENT_DATE)
        )
        AND NOT EXISTS (
          SELECT 1 FROM shipments s
          WHERE s.customer_id = c.id
            AND DATE_TRUNC('month', s.created_at) = DATE_TRUNC('month', CURRENT_DATE)
        )
      )::int AS potential,

      COUNT(*) FILTER (
        WHERE EXISTS (
          SELECT 1 FROM shipments s
          WHERE s.customer_id = c.id
            AND DATE_TRUNC('month', s.created_at) = DATE_TRUNC('month', CURRENT_DATE)
        )
      )::int AS "new"

    FROM companies c
    WHERE c.company_type @> '["Customer"]'::jsonb
      AND c.created_at >= DATE_TRUNC('month', CURRENT_DATE)
      AND c.created_at < DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month'
  `;
  return rows[0] ?? { leads: 0, potential: 0, new: 0 };
}

export async function getCustomerTotal(filter: DashboardFilterState): Promise<CustomerTotalSummary> {
  const where = Prisma.join(
    [Prisma.sql`c.company_type @> '["Customer"]'::jsonb`, joinDashboardFilterConditions(filter)],
    " AND "
  );
  const rows = await prisma.$queryRaw<CustomerTotalSummary[]>`
    SELECT
      COUNT(DISTINCT c.id) FILTER (
        WHERE COALESCE(s.atd, s.etd) >= DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '1 month'
          AND COALESCE(s.atd, s.etd) <  DATE_TRUNC('month', CURRENT_DATE)
      )::int AS "prevMonth",
      COUNT(DISTINCT c.id) FILTER (
        WHERE COALESCE(s.atd, s.etd) >= DATE_TRUNC('month', CURRENT_DATE)
          AND COALESCE(s.atd, s.etd) <  DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month'
      )::int AS "currentMonth",
      COUNT(DISTINCT c.id) FILTER (
        WHERE COALESCE(s.atd, s.etd) >= DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month'
          AND COALESCE(s.atd, s.etd) <  DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '2 month'
      )::int AS "nextMonth"
    FROM companies c
    JOIN shipments s ON s.customer_id = c.id
    WHERE ${where}
  `;
  return rows[0] ?? { prevMonth: 0, currentMonth: 0, nextMonth: 0 };
}

function computeSummary(
  lastMonth: number,
  currentMonth: number,
  nextMonth: number
): PeriodSummary {
  const percCurrent =
    lastMonth === 0
      ? currentMonth > 0
        ? 100
        : 0
      : Math.round(((currentMonth - lastMonth) / lastMonth) * 100);
  const percNext =
    currentMonth === 0
      ? nextMonth > 0
        ? 100
        : 0
      : Math.round(((nextMonth - currentMonth) / currentMonth) * 100);
  return { lastMonth, currentMonth, nextMonth, percCurrent, percNext };
}

export async function getShipmentsSummary(filter: DashboardFilterState): Promise<PeriodSummary> {
  const where = Prisma.join(
    [Prisma.sql`s.status IS DISTINCT FROM 'Cancelled'`, joinDashboardFilterConditions(filter)],
    " AND "
  );
  const rows = await prisma.$queryRaw<
    { lastMonth: number; currentMonth: number; nextMonth: number }[]
  >`
    SELECT
      COUNT(*) FILTER (
        WHERE DATE_TRUNC('month', COALESCE(s.atd, s.etd)) = DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')
      )::int AS "lastMonth",
      COUNT(*) FILTER (
        WHERE DATE_TRUNC('month', COALESCE(s.atd, s.etd)) = DATE_TRUNC('month', CURRENT_DATE)
      )::int AS "currentMonth",
      COUNT(*) FILTER (
        WHERE DATE_TRUNC('month', COALESCE(s.atd, s.etd)) = DATE_TRUNC('month', CURRENT_DATE + INTERVAL '1 month')
      )::int AS "nextMonth"
    FROM shipments s
    WHERE ${where}
  `;
  const row = rows[0] ?? { lastMonth: 0, currentMonth: 0, nextMonth: 0 };
  return computeSummary(row.lastMonth, row.currentMonth, row.nextMonth);
}

export async function getContainerSummary(filter: DashboardFilterState): Promise<PeriodSummary> {
  const where = joinDashboardFilterConditions(filter);
  const rows = await prisma.$queryRaw<
    { lastMonth: number; currentMonth: number; nextMonth: number }[]
  >`
    SELECT
      COALESCE(SUM(s.quantity) FILTER (
        WHERE DATE_TRUNC('month', COALESCE(s.atd, s.etd)) = DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')
      ), 0)::int AS "lastMonth",
      COALESCE(SUM(s.quantity) FILTER (
        WHERE DATE_TRUNC('month', COALESCE(s.atd, s.etd)) = DATE_TRUNC('month', CURRENT_DATE)
      ), 0)::int AS "currentMonth",
      COALESCE(SUM(s.quantity) FILTER (
        WHERE DATE_TRUNC('month', COALESCE(s.atd, s.etd)) = DATE_TRUNC('month', CURRENT_DATE + INTERVAL '1 month')
      ), 0)::int AS "nextMonth"
    FROM shipments s
    WHERE ${where}
  `;
  const row = rows[0] ?? { lastMonth: 0, currentMonth: 0, nextMonth: 0 };
  return computeSummary(row.lastMonth, row.currentMonth, row.nextMonth);
}

export async function getAnnualShipments(filter: DashboardFilterState): Promise<AnnualShipmentPoint[]> {
  const joinCondition = Prisma.join(
    [
      Prisma.sql`DATE_TRUNC('month', COALESCE(s.atd, s.etd)) = m.month`,
      Prisma.sql`s.status <> 'Cancelled'`,
      joinDashboardFilterConditions(filter),
    ],
    " AND "
  );
  return prisma.$queryRaw<AnnualShipmentPoint[]>`
    SELECT
      TO_CHAR(m.month, 'Mon/YY') AS month,
      COALESCE(COUNT(DISTINCT s.id), 0)::int AS bookings,
      COALESCE(COUNT(DISTINCT s.customer_id), 0)::int AS customers,
      COALESCE(SUM(s.quantity), 0)::int AS containers
    FROM (
      SELECT generate_series(
        DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '12 months',
        DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '1 month',
        INTERVAL '1 month'
      ) AS month
    ) m
    LEFT JOIN shipments s
      ON ${joinCondition}
    GROUP BY m.month
    ORDER BY m.month
  `;
}

export async function getShipmentTypeBreakdown(
  filter: DashboardFilterState
): Promise<ShipmentTypePoint[]> {
  const where = Prisma.join(
    [
      Prisma.sql`COALESCE(s.atd, s.etd) IS NOT NULL`,
      Prisma.sql`COALESCE(s.atd, s.etd) >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '12 months')`,
      Prisma.sql`s.status <> 'Cancelled'`,
      joinDashboardFilterConditions(filter),
    ],
    " AND "
  );
  return prisma.$queryRaw<ShipmentTypePoint[]>`
    WITH months AS (
      SELECT DATE_TRUNC('month', CURRENT_DATE - INTERVAL '12 months') + (INTERVAL '1 month' * gs) AS month
      FROM generate_series(0, 11) gs
    ),
    shipments_agg AS (
      SELECT
        DATE_TRUNC('month', COALESCE(s.atd, s.etd)) AS month,
        SUM(CASE WHEN s.shipment_type = 'Flexitank - Full Service' THEN COALESCE(s.quantity, 0) ELSE 0 END)::int AS flexitank_full_service,
        SUM(CASE WHEN s.shipment_type = 'Flexitank - Supply & Fit' THEN COALESCE(s.quantity, 0) ELSE 0 END)::int AS flexitank_supply_fit,
        SUM(CASE WHEN s.shipment_type = 'Flexitank - Supply Only' THEN COALESCE(s.quantity, 0) ELSE 0 END)::int AS flexitank_supply_only,
        SUM(CASE WHEN s.shipment_type = 'Isotank - Full Service' THEN COALESCE(s.quantity, 0) ELSE 0 END)::int AS isotank_full_service,
        SUM(CASE WHEN s.shipment_type = 'Isotank - Rental Only' THEN COALESCE(s.quantity, 0) ELSE 0 END)::int AS isotank_rental_only,
        SUM(CASE WHEN s.shipment_type = 'General Cargo' THEN COALESCE(s.quantity, 0) ELSE 0 END)::int AS general_cargo
      FROM shipments s
      WHERE ${where}
      GROUP BY DATE_TRUNC('month', COALESCE(s.atd, s.etd))
    )
    SELECT
      TO_CHAR(m.month, 'Mon/YY') AS month,
      COALESCE(sa.flexitank_full_service, 0) AS "flexitankFullService",
      COALESCE(sa.flexitank_supply_fit, 0) AS "flexitankSupplyFit",
      COALESCE(sa.flexitank_supply_only, 0) AS "flexitankSupplyOnly",
      COALESCE(sa.isotank_full_service, 0) AS "isotankFullService",
      COALESCE(sa.isotank_rental_only, 0) AS "isotankRentalOnly",
      COALESCE(sa.general_cargo, 0) AS "generalCargo"
    FROM months m
    LEFT JOIN shipments_agg sa ON sa.month = m.month
    ORDER BY m.month
  `;
}

export async function getStatusShipments(
  filter: DashboardFilterState
): Promise<StatusShipmentRow[]> {
  const where = Prisma.join(
    [
      Prisma.sql`COALESCE(s.atd, s.etd) >= DATE_TRUNC('month', CURRENT_DATE)`,
      Prisma.sql`COALESCE(s.atd, s.etd) < DATE_TRUNC('month', CURRENT_DATE + INTERVAL '2 month')`,
      Prisma.sql`s.status IS NOT NULL`,
      joinDashboardFilterConditions(filter),
    ],
    " AND "
  );
  const rows = await prisma.$queryRaw<Omit<StatusShipmentRow, "colorCode">[]>`
    WITH shipments_month AS (
      SELECT
        s.status,
        DATE_TRUNC('month', COALESCE(s.atd, s.etd)) AS month,
        COUNT(*) AS bookings,
        SUM(COALESCE(s.quantity, 0)) AS containers
      FROM shipments s
      WHERE ${where}
      GROUP BY s.status, DATE_TRUNC('month', COALESCE(s.atd, s.etd))
    )
    SELECT
      s.status,
      COALESCE(cm.bookings, 0)::int AS "bookingsCurrentMonth",
      COALESCE(cm.containers, 0)::int AS "containersCurrentMonth",
      COALESCE(cnm.bookings, 0)::int AS "bookingsNextMonth",
      COALESCE(cnm.containers, 0)::int AS "containersNextMonth"
    FROM (SELECT DISTINCT status FROM shipments WHERE status IS NOT NULL) s
    LEFT JOIN shipments_month cm
      ON cm.status = s.status AND cm.month = DATE_TRUNC('month', CURRENT_DATE)
    LEFT JOIN shipments_month cnm
      ON cnm.status = s.status AND cnm.month = DATE_TRUNC('month', CURRENT_DATE + INTERVAL '1 month')
    ORDER BY s.status
  `;

  return rows.map((row) => ({
    ...row,
    colorCode: SHIPMENT_STATUS_COLORS[row.status] ?? "#7A8699",
  }));
}

export async function getFlexitankAvailability(): Promise<FlexitankAvailabilitySummary> {
  const rows = await prisma.$queryRaw<{ status: string; size: string; count: bigint }[]>`
    SELECT status, size, COUNT(*)::int AS count
    FROM flexitanks
    WHERE status IN ('Available', 'Waiting')
    GROUP BY status, size
  `;

  const available = Object.fromEntries(FLEXITANK_SIZES.map((size) => [size, 0]));
  const expected = Object.fromEntries(FLEXITANK_SIZES.map((size) => [size, 0]));

  for (const row of rows) {
    const target = row.status === "Available" ? available : expected;
    target[row.size] = Number(row.count);
  }

  return { sizes: [...FLEXITANK_SIZES], available, expected };
}
