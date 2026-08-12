"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { ShipmentTypePoint } from "@/server/modules/dashboard/dashboard.dto";

const TOOLTIP_STYLE = {
  borderRadius: 8,
  border: "1px solid #e7ebf2",
  fontSize: 12,
};
const AXIS_TICK = { fontSize: 12, fill: "#47597a" };

const SERIES: {
  key: keyof Omit<ShipmentTypePoint, "month">;
  label: string;
  color: string;
}[] = [
  { key: "flexitankFullService", label: "Flexitank Full Service", color: "#101a30" },
  { key: "flexitankSupplyFit", label: "Flexitank Supply & Fit", color: "#17233d" },
  { key: "flexitankSupplyOnly", label: "Flexitank Supply Only", color: "#1e2c47" },
  { key: "isotankFullService", label: "Isotank Full Service", color: "#2a3b5c" },
  { key: "isotankRentalOnly", label: "Isotank Rental Only", color: "#47597a" },
  { key: "generalCargo", label: "General Cargo", color: "#2f6fed" },
];

export function CargoProfileChart({ data }: { data: ShipmentTypePoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data}>
        <CartesianGrid vertical={false} stroke="#e7ebf2" />
        <XAxis
          dataKey="month"
          tick={AXIS_TICK}
          axisLine={{ stroke: "#e7ebf2" }}
          tickLine={false}
        />
        <YAxis tick={AXIS_TICK} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={TOOLTIP_STYLE} />
        <Legend wrapperStyle={{ fontSize: 11 }} />
        {SERIES.map((series) => (
          <Bar
            key={series.key}
            dataKey={series.key}
            name={series.label}
            stackId="cargo"
            fill={series.color}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
