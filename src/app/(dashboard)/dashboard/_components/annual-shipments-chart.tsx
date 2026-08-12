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

import type { AnnualShipmentPoint } from "@/server/modules/dashboard/dashboard.dto";

const TOOLTIP_STYLE = {
  borderRadius: 8,
  border: "1px solid #e7ebf2",
  fontSize: 12,
};
const AXIS_TICK = { fontSize: 12, fill: "#47597a" };

export function AnnualShipmentsChart({ data }: { data: AnnualShipmentPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} barGap={4}>
        <CartesianGrid vertical={false} stroke="#e7ebf2" />
        <XAxis
          dataKey="month"
          tick={AXIS_TICK}
          axisLine={{ stroke: "#e7ebf2" }}
          tickLine={false}
        />
        <YAxis tick={AXIS_TICK} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={TOOLTIP_STYLE} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Bar dataKey="containers" name="Containers" fill="#1fa971" radius={[3, 3, 0, 0]} />
        <Bar dataKey="bookings" name="Bookings" fill="#2f6fed" radius={[3, 3, 0, 0]} />
        <Bar dataKey="customers" name="Customers" fill="#ea580c" radius={[3, 3, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
