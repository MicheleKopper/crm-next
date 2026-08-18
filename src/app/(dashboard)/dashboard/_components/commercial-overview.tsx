"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";
import { DashboardCard, SegmentedControl } from "@/components/dashboard/dashboard-card";
import type {
  CustomerNewSummary,
  CustomerTotalSummary,
} from "@/server/modules/dashboard/dashboard.dto";

type Range = "month" | "quarter" | "year";

const RANGES: { value: Range; label: string }[] = [
  { value: "month", label: "Mês" },
  { value: "quarter", label: "Trimestre" },
  { value: "year", label: "Ano" },
];

function monthLabel(offset: number) {
  const date = new Date();
  date.setDate(1);
  date.setMonth(date.getMonth() + offset);
  const label = date.toLocaleDateString("pt-BR", { month: "short" });
  const clean = label.replace(".", "");
  return clean.charAt(0).toUpperCase() + clean.slice(1);
}

function TrendBar({
  label,
  value,
  max,
  variant,
}: {
  label: string;
  value: number;
  max: number;
  variant: "past" | "current" | "forecast";
}) {
  const height = max > 0 ? Math.max(6, Math.round((value / max) * 56)) : 6;
  return (
    <div className="flex flex-1 flex-col items-center gap-1.5">
      <div
        className={cn(
          "w-full rounded-t-md",
          variant === "past" && "bg-navy-100 dark:bg-navy-700",
          variant === "current" && "bg-status-lead"
        )}
        style={{
          height,
          ...(variant === "forecast"
            ? {
                backgroundImage:
                  "repeating-linear-gradient(135deg,#c7d6f7 0 5px,#e8effc 5px 10px)",
              }
            : null),
        }}
      />
      <span
        className={cn(
          "text-[10.5px]",
          variant === "current"
            ? "font-semibold text-navy-900 dark:text-navy-100"
            : "text-navy-500/80 dark:text-navy-100/50"
        )}
      >
        {label} · {value}
      </span>
    </div>
  );
}

function AcquisitionRow({
  initial,
  label,
  value,
  tone,
  last,
}: {
  initial: string;
  label: string;
  value: number;
  tone: "prospecto" | "lead" | "ativo";
  last?: boolean;
}) {
  const tones = {
    prospecto: "bg-status-prospecto/10 text-status-prospecto",
    lead: "bg-status-lead/10 text-status-lead",
    ativo: "bg-status-ativo/10 text-status-ativo",
  } as const;

  return (
    <div
      className={cn(
        "flex items-center gap-3 py-3",
        !last && "border-b border-navy-100/70 dark:border-navy-700/70"
      )}
    >
      <span
        className={cn(
          "grid h-[26px] w-[26px] place-items-center rounded-lg text-xs font-bold",
          tones[tone]
        )}
      >
        {initial}
      </span>
      <span className="flex-1 text-[13.5px] text-navy-900 dark:text-navy-100">{label}</span>
      <span className="text-[11.5px] text-navy-500/80 dark:text-navy-100/50">
        {value === 0 ? "sem movimento" : "no mês"}
      </span>
      <span
        className={cn(
          "w-7 text-right text-lg font-bold tracking-tight",
          value === 0 ? "text-navy-100 dark:text-navy-100/20" : "text-navy-900 dark:text-navy-100"
        )}
      >
        {value}
      </span>
    </div>
  );
}

export function CommercialOverview({
  acquisition,
  customerTotal,
}: {
  acquisition: CustomerNewSummary;
  customerTotal: CustomerTotalSummary;
}) {
  const [range, setRange] = useState<Range>("month");

  const { prevMonth, currentMonth, nextMonth } = customerTotal;
  const diff = currentMonth - prevMonth;
  const perc = prevMonth > 0 ? Math.round((diff / prevMonth) * 100) : null;
  const max = Math.max(prevMonth, currentMonth, nextMonth, 1);
  const positive = diff >= 0;

  return (
    <DashboardCard
      title="Clientes e aquisição"
      subtitle="Base ativa e entradas do mês"
      actions={<SegmentedControl value={range} onChange={setRange} options={RANGES} />}
    >
      <div className="grid md:grid-cols-[1.05fr_1fr]">
        <section className="flex flex-col gap-4 border-navy-100 p-6 md:border-r dark:border-navy-700">
          <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-navy-500/70 dark:text-navy-100/50">
            Base de clientes ativos
          </p>

          <div className="flex items-end gap-3">
            <span className="text-[54px] font-bold leading-[0.9] tracking-[-0.04em] text-navy-900 dark:text-navy-100">
              {currentMonth}
            </span>
            <div className="flex flex-col gap-1.5 pb-1">
              <span
                className={cn(
                  "inline-flex w-fit items-center gap-1.5 rounded-md px-1.5 py-0.5 text-[11.5px] font-semibold",
                  positive
                    ? "bg-status-ativo/10 text-status-ativo"
                    : "bg-status-perdido/10 text-status-perdido"
                )}
              >
                {positive ? "▲" : "▼"} {Math.abs(diff)}
                {perc !== null ? ` (${positive ? "+" : "−"}${Math.abs(perc)}%)` : ""} vs. mês
                anterior
              </span>
              <span className="text-[11.5px] text-navy-500/80 dark:text-navy-100/50">
                Previsto p/ próx. mês: {nextMonth}
              </span>
            </div>
          </div>

          <div className="flex items-end gap-2.5 border-t border-navy-100/70 pt-3 dark:border-navy-700/70">
            <TrendBar label={monthLabel(-1)} value={prevMonth} max={max} variant="past" />
            <TrendBar label={monthLabel(0)} value={currentMonth} max={max} variant="current" />
            <TrendBar label={monthLabel(1)} value={nextMonth} max={max} variant="forecast" />
          </div>
        </section>

        <section className="flex flex-col gap-3 p-6">
          <div className="flex items-baseline justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-navy-500/70 dark:text-navy-100/50">
              Indicadores comerciais
            </p>
            <button type="button" className="text-xs font-semibold text-status-lead hover:underline">
              Detalhes
            </button>
          </div>

          <div className="flex flex-col">
            <AcquisitionRow initial="L" label="Leads" value={acquisition.leads} tone="prospecto" />
            <AcquisitionRow initial="P" label="Potenciais" value={acquisition.potential} tone="lead" />
            <AcquisitionRow initial="N" label="Novos" value={acquisition.new} tone="ativo" last />
          </div>

          {acquisition.leads + acquisition.potential + acquisition.new === 0 ? (
            <div className="mt-auto flex items-center gap-2 rounded-lg bg-navy-100/40 px-3 py-2.5 text-[12.5px] text-navy-500 dark:bg-navy-800/40 dark:text-navy-100/70">
              Comece o mês registrando um lead
              <button
                type="button"
                className="ml-auto font-semibold text-status-lead hover:underline"
              >
                + Novo lead
              </button>
            </div>
          ) : null}
        </section>
      </div>
    </DashboardCard>
  );
}
