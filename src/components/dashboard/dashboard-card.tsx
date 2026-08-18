"use client";

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/** Séries de dados — usar nesta ordem. Espelha --data-1…5 do globals.css. */
export const DATA_COLORS = ["#2f6fed", "#17233d", "#7ea3ee", "#47597a", "#c7d6f7"] as const;

/** Hachura para valores previstos / projetados. */
export const FORECAST_BAR =
  "repeating-linear-gradient(135deg,#c7d6f7 0 5px,#e8effc 5px 10px)";

export function DashboardCard({
  title,
  subtitle,
  actions,
  footer,
  children,
  className,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "flex h-full flex-col overflow-hidden rounded-2xl border border-navy-100 bg-white dark:border-navy-700 dark:bg-navy-900",
        "shadow-[0_1px_2px_rgba(16,26,48,0.05),0_8px_24px_-18px_rgba(16,26,48,0.25)]",
        className
      )}
    >
      <header className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-navy-100 px-5 py-4 dark:border-navy-700">
        <div className="min-w-0">
          <h3 className="text-[15px] font-semibold tracking-tight text-navy-900 dark:text-navy-100">
            {title}
          </h3>
          {subtitle ? (
            <p className="text-[12.5px] text-navy-500 dark:text-navy-100/70">{subtitle}</p>
          ) : null}
        </div>
        {actions ? <div className="flex items-center gap-2.5">{actions}</div> : null}
      </header>

      <div className="flex-1">{children}</div>

      {footer ? (
        <footer className="flex shrink-0 flex-wrap items-center gap-2 border-t border-navy-100 bg-navy-100/20 px-5 py-3 text-xs text-navy-500 dark:border-navy-700 dark:bg-navy-800/40 dark:text-navy-100/70">
          {footer}
        </footer>
      ) : null}
    </section>
  );
}

/** Rótulo de seção dentro do card. */
export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-navy-500/70 dark:text-navy-100/50">
      {children}
    </p>
  );
}

/** Variação percentual. Verde = alta, vermelho = queda. */
export function DeltaBadge({ value }: { value?: number | null }) {
  if (value === undefined || value === null) return null;
  const positive = value >= 0;
  return (
    <span
      className={cn(
        "rounded-md px-1.5 py-0.5 text-[11px] font-semibold",
        positive
          ? "bg-status-ativo/10 text-status-ativo"
          : "bg-status-perdido/10 text-status-perdido"
      )}
    >
      {positive ? "+" : "−"}
      {Math.abs(value)}%
    </span>
  );
}

/** Número de métrica. size: "hero" (30px) | "table" (20px). */
export function MetricValue({
  value,
  size = "table",
  className,
}: {
  value: number;
  size?: "hero" | "table";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "font-bold leading-none",
        size === "hero" ? "text-[30px] tracking-[-0.035em]" : "text-[20px] tracking-[-0.03em]",
        value === 0 ? "text-data-zero" : "text-navy-900 dark:text-navy-100",
        className
      )}
    >
      {value}
    </span>
  );
}

/** Segmented control — o único estilo de toggle do dashboard. */
export function SegmentedControl<T extends string | boolean>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div className="inline-flex gap-0.5 rounded-lg bg-navy-100/60 p-[3px] dark:bg-navy-800/60">
      {options.map((option) => (
        <button
          key={String(option.value)}
          type="button"
          onClick={() => onChange(option.value)}
          className={cn(
            "rounded-md px-3 py-1.5 text-xs font-semibold transition-colors",
            value === option.value
              ? "bg-white text-navy-900 shadow-sm dark:bg-navy-700 dark:text-navy-100"
              : "text-navy-500 hover:text-navy-900 dark:text-navy-100/60 dark:hover:text-navy-100"
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

/** Barra horizontal de proporção. */
export function ProportionBar({
  ratio,
  color = DATA_COLORS[0],
  forecast,
  height = 6,
}: {
  ratio: number;
  color?: string;
  forecast?: boolean;
  height?: number;
}) {
  return (
    <span
      className="block overflow-hidden rounded-full bg-data-track dark:bg-navy-800/60"
      style={{ height }}
    >
      <span
        className="block h-full rounded-full"
        style={{
          width: `${Math.max(0, Math.min(100, Math.round(ratio * 100)))}%`,
          ...(forecast ? { backgroundImage: FORECAST_BAR } : { backgroundColor: color }),
        }}
      />
    </span>
  );
}
