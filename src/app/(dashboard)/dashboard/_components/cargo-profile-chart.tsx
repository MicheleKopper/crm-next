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
import type { ShipmentTypePoint } from "@/server/modules/dashboard/dashboard.dto";

const TOOLTIP_STYLE = {
  borderRadius: 10,
  border: "1px solid #e7ebf2",
  boxShadow: "0 8px 24px -18px rgba(16,26,48,0.35)",
  fontSize: 12,
};
const AXIS_TICK = { fontSize: 11.5, fill: "#8c97ab" };

/** Rampa contínua: do navy mais escuro ao azul mais claro. */
const SERIES: {
  key: keyof Omit<ShipmentTypePoint, "month">;
  label: string;
  color: string;
}[] = [
  { key: "flexitankFullService", label: "Flexitank Full Service", color: "#17233d" },
  { key: "flexitankSupplyFit", label: "Flexitank Supply & Fit", color: "#2a3b5c" },
  { key: "flexitankSupplyOnly", label: "Flexitank Supply Only", color: "#47597a" },
  { key: "isotankFullService", label: "Isotank Full Service", color: "#2f6fed" },
  { key: "isotankRentalOnly", label: "Isotank Rental Only", color: "#7ea3ee" },
  { key: "generalCargo", label: "General Cargo", color: "#c7d6f7" },
];

export function CargoProfileChart({ data }: { data: ShipmentTypePoint[] }) {
  return (
    <DashboardCard
      title="Perfil de cargas"
      subtitle="Mix de serviço por mês"
      footer={
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px]">
          {SERIES.map((series) => (
            <span key={series.key} className="flex items-center gap-1.5">
              <span
                className="h-2 w-2 rounded-sm"
                style={{ backgroundColor: series.color }}
              />
              {series.label}
            </span>
          ))}
        </div>
      }
    >
      <div className="px-3 pb-2 pt-4">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data}>
            <CartesianGrid vertical={false} stroke="#f1f4f9" />
            <XAxis
              dataKey="month"
              tick={AXIS_TICK}
              axisLine={{ stroke: "#e7ebf2" }}
              tickLine={false}
            />
            <YAxis tick={AXIS_TICK} axisLine={false} tickLine={false} width={30} />
            <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: "#f7f9fc" }} />
            {SERIES.map((series, index) => (
              <Bar
                key={series.key}
                dataKey={series.key}
                name={series.label}
                stackId="cargo"
                fill={series.color}
                radius={index === SERIES.length - 1 ? [3, 3, 0, 0] : undefined}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </DashboardCard>
  );
}
