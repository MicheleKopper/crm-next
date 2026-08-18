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

import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { useTheme } from "@/components/theme/theme-provider";
import type { ShipmentTypePoint } from "@/server/modules/dashboard/dashboard.dto";

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

type SeriesItem = {
  key: keyof Omit<ShipmentTypePoint, "month">;
  label: string;
  color: string;
};

/** Rampa contínua: do navy mais escuro ao azul mais claro. */
const LIGHT_SERIES: SeriesItem[] = [
  { key: "flexitankFullService", label: "Flexitank Full Service", color: "#17233d" },
  { key: "flexitankSupplyFit", label: "Flexitank Supply & Fit", color: "#2a3b5c" },
  { key: "flexitankSupplyOnly", label: "Flexitank Supply Only", color: "#47597a" },
  { key: "isotankFullService", label: "Isotank Full Service", color: "#2f6fed" },
  { key: "isotankRentalOnly", label: "Isotank Rental Only", color: "#7ea3ee" },
  { key: "generalCargo", label: "General Cargo", color: "#c7d6f7" },
];

/** Mesma rampa, clareada para permanecer visível sobre um card escuro. */
const DARK_SERIES: SeriesItem[] = [
  { key: "flexitankFullService", label: "Flexitank Full Service", color: "#64749c" },
  { key: "flexitankSupplyFit", label: "Flexitank Supply & Fit", color: "#8494b8" },
  { key: "flexitankSupplyOnly", label: "Flexitank Supply Only", color: "#a4b1d0" },
  { key: "isotankFullService", label: "Isotank Full Service", color: "#4f8cff" },
  { key: "isotankRentalOnly", label: "Isotank Rental Only", color: "#94b6f5" },
  { key: "generalCargo", label: "General Cargo", color: "#c7d6f7" },
];

export function CargoProfileChart({ data }: { data: ShipmentTypePoint[] }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const series = isDark ? DARK_SERIES : LIGHT_SERIES;
  const tooltipStyle = isDark ? DARK_TOOLTIP_STYLE : LIGHT_TOOLTIP_STYLE;
  const axisTick = isDark ? DARK_AXIS_TICK : LIGHT_AXIS_TICK;

  return (
    <DashboardCard
      title="Perfil de cargas"
      subtitle="Mix de serviço por mês"
      footer={
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] dark:text-navy-100/70">
          {series.map((s) => (
            <span key={s.key} className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-sm" style={{ backgroundColor: s.color }} />
              {s.label}
            </span>
          ))}
        </div>
      }
    >
      <div className="px-3 pb-2 pt-4">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data}>
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
            {series.map((s, index) => (
              <Bar
                key={s.key}
                dataKey={s.key}
                name={s.label}
                stackId="cargo"
                fill={s.color}
                radius={index === series.length - 1 ? [3, 3, 0, 0] : undefined}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </DashboardCard>
  );
}
