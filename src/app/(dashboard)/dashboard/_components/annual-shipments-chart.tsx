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
import type { AnnualShipmentPoint } from "@/server/modules/dashboard/dashboard.dto";

const TOOLTIP_STYLE = {
  borderRadius: 10,
  border: "1px solid #e7ebf2",
  boxShadow: "0 8px 24px -18px rgba(16,26,48,0.35)",
  fontSize: 12,
};
const AXIS_TICK = { fontSize: 11.5, fill: "#8c97ab" };

const SERIES = [
  { key: "containers", label: "Containers", color: DATA_COLORS[1] },
  { key: "bookings", label: "Bookings", color: DATA_COLORS[0] },
  { key: "customers", label: "Clientes", color: DATA_COLORS[2] },
] as const;

function Legend() {
  return (
    <div className="flex flex-wrap items-center gap-3 text-[11px] text-navy-500">
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
  );
}

export function AnnualShipmentsChart({ data }: { data: AnnualShipmentPoint[] }) {
  const peak = data.reduce(
    (best, point) => (point.containers > best.containers ? point : best),
    data[0] ?? { month: "—", containers: 0, bookings: 0, customers: 0 }
  );

  return (
    <DashboardCard
      title="Embarques nos últimos 12 meses"
      subtitle="Bookings, containers e clientes"
      actions={<Legend />}
      footer={
        <span>
          Pico em <b className="text-navy-900">{peak.month}</b> ·{" "}
          <b className="text-navy-900">{peak.containers}</b> containers
        </span>
      }
    >
      <div className="px-3 pb-2 pt-4">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data} barGap={3}>
            <CartesianGrid vertical={false} stroke="#f1f4f9" />
            <XAxis
              dataKey="month"
              tick={AXIS_TICK}
              axisLine={{ stroke: "#e7ebf2" }}
              tickLine={false}
            />
            <YAxis tick={AXIS_TICK} axisLine={false} tickLine={false} width={30} />
            <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: "#f7f9fc" }} />
            {SERIES.map((series) => (
              <Bar
                key={series.key}
                dataKey={series.key}
                name={series.label}
                fill={series.color}
                radius={[3, 3, 0, 0]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </DashboardCard>
  );
}
