"use client";

import { useMemo, useState } from "react";

import { DashboardCard, SegmentedControl } from "@/components/dashboard/dashboard-card";
import type { StatusShipmentRow } from "@/server/modules/dashboard/dashboard.dto";

type Period = "current" | "next";
type NumericKey =
  | "bookingsCurrentMonth"
  | "bookingsNextMonth"
  | "containersCurrentMonth"
  | "containersNextMonth";

const bookingsKeyFor = (p: Period): NumericKey =>
  p === "current" ? "bookingsCurrentMonth" : "bookingsNextMonth";
const containersKeyFor = (p: Period): NumericKey =>
  p === "current" ? "containersCurrentMonth" : "containersNextMonth";

const sumBy = (rows: StatusShipmentRow[], key: NumericKey) =>
  rows.reduce((sum, row) => sum + row[key], 0);

const RADIUS = 48;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const GAP = 3;
const STROKE = 15;
const STROKE_HOVER = 19;
const FALLBACK_COLOR = "#c7d0d9";

type Arc = {
  name: string;
  count: number;
  color: string;
  pct: number;
  dashArray: string;
  dashOffset: number;
};

function buildArcs(rows: StatusShipmentRow[], dataKey: NumericKey, total: number): Arc[] {
  let acc = 0;
  return rows.map((row) => {
    const count = row[dataKey];
    const frac = total > 0 ? count / total : 0;
    const length = Math.max(frac * CIRCUMFERENCE - GAP, 1);
    const arc: Arc = {
      name: row.status,
      count,
      color: row.colorCode || FALLBACK_COLOR,
      pct: Math.round(frac * 100),
      dashArray: `${length} ${CIRCUMFERENCE - length}`,
      dashOffset: -acc * CIRCUMFERENCE,
    };
    acc += frac;
    return arc;
  });
}

function StatusDonutPanel({
  rows,
  dataKey,
  total,
  label,
}: {
  rows: StatusShipmentRow[];
  dataKey: NumericKey;
  total: number;
  label: string;
}) {
  const arcs = useMemo(() => buildArcs(rows, dataKey, total), [rows, dataKey, total]);
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="flex items-center gap-7 p-6">
      <div className="relative h-[148px] w-[148px] shrink-0">
        {arcs.length === 0 ? (
          <div className="flex h-full items-center justify-center rounded-full bg-navy-100/60 text-xs text-navy-500">
            Sem dados
          </div>
        ) : (
          <svg viewBox="0 0 120 120" className="h-[148px] w-[148px] -rotate-90">
            <circle cx={60} cy={60} r={RADIUS} fill="none" stroke="#eef1f4" strokeWidth={STROKE} />
            {arcs.map((arc, index) => (
              <circle
                key={arc.name}
                cx={60}
                cy={60}
                r={RADIUS}
                fill="none"
                stroke={arc.color}
                strokeWidth={hovered === index ? STROKE_HOVER : STROKE}
                strokeDasharray={arc.dashArray}
                strokeDashoffset={arc.dashOffset}
                opacity={hovered === null || hovered === index ? 1 : 0.28}
                className="transition-[opacity,stroke-width] duration-200"
              />
            ))}
          </svg>
        )}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-0.5">
          <span className="text-[30px] font-bold leading-none tracking-[-0.02em] text-navy-900">
            {total}
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-[0.11em] text-navy-500/70">
            {label}
          </span>
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        {arcs.map((arc, index) => (
          <div
            key={arc.name}
            onMouseEnter={() => setHovered(index)}
            onMouseLeave={() => setHovered(null)}
            className="-mx-2 grid grid-cols-[1fr_auto_auto] items-center gap-x-3 rounded-[7px] px-2 py-[7px] transition-colors hover:bg-[#f6f8fa]"
          >
            <div className="flex min-w-0 items-center gap-[9px]">
              <span
                className="h-[9px] w-[9px] shrink-0 rounded-full"
                style={{ background: arc.color }}
              />
              <span className="truncate text-[13.5px] text-navy-700">{arc.name}</span>
            </div>
            <span className="text-[12.5px] tabular-nums text-navy-500">{arc.count}</span>
            <span className="min-w-[38px] text-right text-[13.5px] font-semibold tabular-nums text-navy-900">
              {arc.pct}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function StatusShipmentsPanel({ rows }: { rows: StatusShipmentRow[] }) {
  const [period, setPeriod] = useState<Period>("current");
  const bookingsKey = bookingsKeyFor(period);
  const containersKey = containersKeyFor(period);

  const bookingsTotal = sumBy(rows, bookingsKey);
  const containersTotal = sumBy(rows, containersKey);

  const bookingRows = rows
    .filter((row) => row[bookingsKey] > 0)
    .sort((a, b) => b[bookingsKey] - a[bookingsKey]);
  const containerRows = rows
    .filter((row) => row[containersKey] > 0)
    .sort((a, b) => b[containersKey] - a[containersKey]);

  return (
    <DashboardCard
      title="Status dos embarques"
      subtitle="Bookings e containers por status"
      actions={
        <SegmentedControl
          value={period}
          onChange={setPeriod}
          options={[
            { value: "current", label: "Mês atual" },
            { value: "next", label: "Próx. mês" },
          ]}
        />
      }
    >
      <div className="grid sm:grid-cols-2">
        <div className="sm:border-r sm:border-navy-100">
          <StatusDonutPanel rows={bookingRows} dataKey={bookingsKey} total={bookingsTotal} label="Bookings" />
        </div>
        <div className="border-t border-navy-100 sm:border-t-0">
          <StatusDonutPanel
            rows={containerRows}
            dataKey={containersKey}
            total={containersTotal}
            label="Containers"
          />
        </div>
      </div>
    </DashboardCard>
  );
}
