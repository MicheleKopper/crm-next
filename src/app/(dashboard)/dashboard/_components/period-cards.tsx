"use client";

import { cn } from "@/lib/utils";
import { DashboardCard, DeltaBadge, FORECAST_BAR } from "@/components/dashboard/dashboard-card";
import type { PeriodSummary } from "@/server/modules/dashboard/dashboard.dto";

type Column = { key: "lastMonth" | "currentMonth" | "nextMonth"; label: string };

const COLUMNS: Column[] = [
  { key: "lastMonth", label: "Mês anterior" },
  { key: "currentMonth", label: "Mês atual" },
  { key: "nextMonth", label: "Próx. mês" },
];

function MetricRow({
  label,
  summary,
  last,
}: {
  label: string;
  summary: PeriodSummary;
  last?: boolean;
}) {
  const max = Math.max(summary.lastMonth, summary.currentMonth, summary.nextMonth, 1);
  const deltas: Record<Column["key"], number | undefined> = {
    lastMonth: undefined,
    currentMonth: summary.percCurrent,
    nextMonth: summary.percNext,
  };

  return (
    <div
      className={cn(
        "grid grid-cols-[120px_repeat(3,1fr)] items-end gap-3.5 px-5 py-4",
        !last && "border-b border-navy-100/70"
      )}
    >
      <p className="pb-1 text-xs font-semibold text-navy-500">{label}</p>
      {COLUMNS.map((column) => {
        const value = summary[column.key];
        const isCurrent = column.key === "currentMonth";
        const isForecast = column.key === "nextMonth";
        return (
          <div key={column.key} className="flex flex-col gap-1.5">
            <div className="flex items-baseline gap-2">
              <span className="text-[26px] font-bold leading-none tracking-[-0.035em] text-navy-900">
                {value}
              </span>
              <DeltaBadge value={deltas[column.key]} />
            </div>
            <span className="h-[5px] overflow-hidden rounded-full bg-navy-100/70">
              <span
                className={cn(
                  "block h-full rounded-full",
                  isCurrent && "bg-status-lead",
                  !isCurrent && !isForecast && "bg-navy-100"
                )}
                style={{
                  width: `${Math.round((value / max) * 100)}%`,
                  ...(isForecast ? { backgroundImage: FORECAST_BAR } : null),
                  ...(!isCurrent && !isForecast ? { backgroundColor: "#dbe2ee" } : null),
                }}
              />
            </span>
          </div>
        );
      })}
    </div>
  );
}

function ratio(containers: number, bookings: number) {
  if (bookings === 0) return "—";
  return (containers / bookings).toLocaleString("pt-BR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
}

export function PeriodCards({
  shipmentsSummary,
  containerSummary,
}: {
  shipmentsSummary: PeriodSummary;
  containerSummary: PeriodSummary;
}) {
  return (
    <DashboardCard
      title="Embarques por período"
      subtitle="Bookings e containers, variação mensal"
    >
      <div className="grid grid-cols-[120px_repeat(3,1fr)] gap-3.5 border-y border-navy-100 bg-navy-100/25 px-5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.09em] text-navy-500/70">
        <span />
        {COLUMNS.map((column) => (
          <span
            key={column.key}
            className={column.key === "currentMonth" ? "text-status-lead" : undefined}
          >
            {column.label}
          </span>
        ))}
      </div>

      <MetricRow label="Bookings" summary={shipmentsSummary} />
      <MetricRow label="Containers" summary={containerSummary} last />

      <footer className="flex flex-wrap items-center gap-2 border-t border-navy-100 bg-navy-100/20 px-5 py-3 text-xs text-navy-500">
        <span>
          Containers por booking:{" "}
          <b className="text-navy-900">
            {ratio(containerSummary.lastMonth, shipmentsSummary.lastMonth)}
          </b>{" "}
          →{" "}
          <b className="text-navy-900">
            {ratio(containerSummary.currentMonth, shipmentsSummary.currentMonth)}
          </b>{" "}
          →{" "}
          <b className="text-navy-900">
            {ratio(containerSummary.nextMonth, shipmentsSummary.nextMonth)}
          </b>
        </span>
      </footer>
    </DashboardCard>
  );
}
