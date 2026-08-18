"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { DashboardCard, DATA_COLORS } from "@/components/dashboard/dashboard-card";
import { useTheme } from "@/components/theme/theme-provider";
import type { AnnualShipmentPoint } from "@/server/modules/dashboard/dashboard.dto";

const LIGHT_TOOLTIP_STYLE = {
  borderRadius: 10,
  border: "1px solid #e7ebf2",
  boxShadow: "0 8px 24px -18px rgba(16,26,48,0.35)",
  fontSize: 12,
  background: "#ffffff",
  color: "#1b2436",
};
const DARK_TOOLTIP_STYLE = {
  ...LIGHT_TOOLTIP_STYLE,
  border: "1px solid #2a3b5c",
  background: "#17233d",
  color: "#e7ebf2",
};
const LIGHT_AXIS_TICK = { fontSize: 11.5, fill: "#8c97ab" };
const DARK_AXIS_TICK = { fontSize: 11.5, fill: "#8a94ab" };
const LIGHT_GRID_STROKE = "#f1f4f9";
const DARK_GRID_STROKE = "#22304d";
const LIGHT_AXIS_LINE = "#e7ebf2";
const DARK_AXIS_LINE = "#2a3b5c";
const LIGHT_CURSOR_FILL = "#f7f9fc";
const DARK_CURSOR_FILL = "#1e2c47";

type SeriesItem = { key: "containers" | "bookings" | "customers"; label: string; color: string };

// A cor "Containers" (data-2 = navy-900) some contra um card escuro no dark mode; substituída por um tom mais claro só nesse tema.
const LIGHT_SERIES: SeriesItem[] = [
  { key: "containers", label: "Containers", color: DATA_COLORS[1] },
  { key: "bookings", label: "Bookings", color: DATA_COLORS[0] },
  { key: "customers", label: "Clientes", color: DATA_COLORS[2] },
];
const DARK_SERIES: SeriesItem[] = [
  { key: "containers", label: "Containers", color: "#8a9cc2" },
  { key: "bookings", label: "Bookings", color: DATA_COLORS[0] },
  { key: "customers", label: "Clientes", color: DATA_COLORS[2] },
];

function Legend({ series }: { series: SeriesItem[] }) {
  return (
    <div className="flex flex-wrap items-center gap-3 text-[11px] text-navy-500 dark:text-navy-100/70">
      {series.map((s) => (
        <span key={s.key} className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-sm" style={{ backgroundColor: s.color }} />
          {s.label}
        </span>
      ))}
    </div>
  );
}

export function AnnualShipmentsChart({ data }: { data: AnnualShipmentPoint[] }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const series = isDark ? DARK_SERIES : LIGHT_SERIES;
  const tooltipStyle = isDark ? DARK_TOOLTIP_STYLE : LIGHT_TOOLTIP_STYLE;
  const axisTick = isDark ? DARK_AXIS_TICK : LIGHT_AXIS_TICK;

  const peak = data.reduce(
    (best, point) => (point.containers > best.containers ? point : best),
    data[0] ?? { month: "—", containers: 0, bookings: 0, customers: 0 }
  );

  return (
    <DashboardCard
      title="Embarques nos últimos 12 meses"
      subtitle="Bookings, containers e clientes"
      actions={<Legend series={series} />}
      footer={
        <span>
          Pico em <b className="text-navy-900 dark:text-navy-100">{peak.month}</b> ·{" "}
          <b className="text-navy-900 dark:text-navy-100">{peak.containers}</b> containers
        </span>
      }
    >
      <div className="px-3 pb-2 pt-4">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data} barGap={3}>
            <CartesianGrid vertical={false} stroke={isDark ? DARK_GRID_STROKE : LIGHT_GRID_STROKE} />
            <XAxis
              dataKey="month"
              tick={axisTick}
              axisLine={{ stroke: isDark ? DARK_AXIS_LINE : LIGHT_AXIS_LINE }}
              tickLine={false}
            />
            <YAxis tick={axisTick} axisLine={false} tickLine={false} width={30} />
            <Tooltip
              contentStyle={tooltipStyle}
              cursor={{ fill: isDark ? DARK_CURSOR_FILL : LIGHT_CURSOR_FILL }}
            />
            {series.map((s) => (
              <Bar key={s.key} dataKey={s.key} name={s.label} fill={s.color} radius={[3, 3, 0, 0]} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </DashboardCard>
  );
}
