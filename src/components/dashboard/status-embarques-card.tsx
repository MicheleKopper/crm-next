"use client";

import type { ReactNode } from "react";
import { useState } from "react";

import { cn } from "@/lib/utils";

export type StatusEmbarquesItem = [name: string, count: number];

export type StatusEmbarquesPanel = {
  label: string;
  total: number;
  items: StatusEmbarquesItem[];
};

export type StatusEmbarquesCardProps = {
  panels: StatusEmbarquesPanel[];
  footer?: ReactNode;
};

type Period = "current" | "next";

const PERIOD_OPTIONS: { value: Period; label: string }[] = [
  { value: "current", label: "Mês atual" },
  { value: "next", label: "Próx. mês" },
];

const PALETTE: Record<string, string> = {
  Arrived: "#199BDC",
  "In Operation": "#E8871B",
  Shipped: "#2C7A3F",
  Pending: "#DC3B29",
  Booked: "#1B5E8C",
};
const FALLBACK_COLOR = "#8b9aa8";

const RADIUS = 48;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const GAP = 3;
const STROKE = 15;
const STROKE_HOVER = 19;

function buildArcs(items: StatusEmbarquesItem[], total: number) {
  const fractions = items.map(([, count]) => (total > 0 ? count / total : 0));
  return items.map(([name, count], index) => {
    const before = fractions.slice(0, index).reduce((sum, fraction) => sum + fraction, 0);
    return {
      name,
      count,
      length: Math.max(fractions[index] * CIRCUMFERENCE - GAP, 1),
      offset: -before * CIRCUMFERENCE,
    };
  });
}

function StatusPanel({ panel }: { panel: StatusEmbarquesPanel }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const arcs = buildArcs(panel.items, panel.total);

  return (
    <div className="flex items-center gap-7 p-6">
      <div className="relative h-[148px] w-[148px] shrink-0">
        <svg viewBox="0 0 120 120" className="h-[148px] w-[148px] -rotate-90">
          <circle cx={60} cy={60} r={RADIUS} fill="none" stroke="#eef1f4" strokeWidth={STROKE} />
          {arcs.map((arc, index) => (
            <circle
              key={arc.name}
              cx={60}
              cy={60}
              r={RADIUS}
              fill="none"
              stroke={PALETTE[arc.name] ?? FALLBACK_COLOR}
              strokeWidth={hoveredIndex === index ? STROKE_HOVER : STROKE}
              strokeDasharray={`${arc.length} ${CIRCUMFERENCE - arc.length}`}
              strokeDashoffset={arc.offset}
              opacity={hoveredIndex === null || hoveredIndex === index ? 1 : 0.28}
              style={{ transition: "opacity .18s ease, stroke-width .18s ease" }}
            />
          ))}
        </svg>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-0.5">
          <span className="text-[30px] font-bold leading-none tracking-[-0.02em] text-[#10202f]">
            {panel.total}
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-[0.11em] text-[#8b9aa8]">
            {panel.label}
          </span>
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        {panel.items.map(([name, count], index) => (
          <div
            key={name}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            className="-mx-2 grid grid-cols-[1fr_auto_auto] items-center gap-3 rounded-[7px] px-2 py-[7px] transition-colors hover:bg-[#f6f8fa]"
          >
            <span className="flex min-w-0 items-center gap-2.5 text-[13.5px] text-[#33465a]">
              <span
                className="h-[9px] w-[9px] shrink-0 rounded-full"
                style={{ backgroundColor: PALETTE[name] ?? FALLBACK_COLOR }}
              />
              <span className="truncate">{name}</span>
            </span>
            <span className="text-[12.5px] tabular-nums text-[#8b9aa8]">{count}</span>
            <span className="min-w-[38px] text-right text-[13.5px] font-semibold tabular-nums text-[#10202f]">
              {panel.total > 0 ? Math.round((count / panel.total) * 100) : 0}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function StatusEmbarquesCard({ panels, footer }: StatusEmbarquesCardProps) {
  const [period, setPeriod] = useState<Period>("current");

  return (
    <section className="w-full overflow-hidden rounded-[14px] border border-[#e6eaee] bg-white shadow-[0_1px_2px_rgba(16,32,48,.04),0_8px_24px_rgba(16,32,48,.05)]">
      <header className="flex flex-wrap items-start justify-between gap-6 border-b border-[#edf0f3] px-[26px] pb-5 pt-[22px]">
        <div>
          <p className="text-[17px] font-semibold tracking-[-0.01em] text-[#10202f]">
            Status dos embarques
          </p>
          <p className="mt-[3px] text-[13px] text-[#6b7c8c]">Bookings e containers por status</p>
        </div>

        <div className="flex gap-0.5 rounded-[9px] border border-[#e6eaee] bg-[#f1f4f7] p-[3px]" role="tablist">
          {PERIOD_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              role="tab"
              aria-selected={period === option.value}
              onClick={() => setPeriod(option.value)}
              className={cn(
                "rounded-[7px] px-3.5 py-[7px] text-[13px] font-semibold transition-colors",
                period === option.value
                  ? "bg-white text-[#10202f] shadow-[0_1px_2px_rgba(16,32,48,.10)]"
                  : "bg-transparent text-[#7b8a99] hover:text-[#10202f]"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </header>

      <div className="grid sm:grid-cols-2">
        {panels.map((panel, index) => (
          <div
            key={panel.label}
            className={cn(index > 0 && "border-t border-[#edf0f3] sm:border-l sm:border-t-0")}
          >
            <StatusPanel panel={panel} />
          </div>
        ))}
      </div>

      <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-[#edf0f3] bg-[#fafbfc] px-[26px] py-3.5 text-[12.5px] text-[#7b8a99]">
        <div>{footer}</div>
        <a href="#" className="font-semibold text-[#1B5E8C] hover:text-[#124465]">
          Ver embarques →
        </a>
      </footer>
    </section>
  );
}
