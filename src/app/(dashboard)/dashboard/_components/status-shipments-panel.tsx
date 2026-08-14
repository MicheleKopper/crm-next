"use client";

import {
  Anchor,
  Calendar,
  Circle,
  Clock,
  Info,
  Settings,
  Ship,
  Truck,
  XCircle,
} from "lucide-react";
import type { ComponentType } from "react";
import { useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { cn } from "@/lib/utils";
import type { StatusShipmentRow } from "@/server/modules/dashboard/dashboard.dto";

type Period = "current" | "next";
type NumericKey =
  | "bookingsCurrentMonth"
  | "bookingsNextMonth"
  | "containersCurrentMonth"
  | "containersNextMonth";

const STATUS_ICONS: Record<string, ComponentType<{ size?: number; className?: string }>> = {
  Arrived: Ship,
  Booked: Calendar,
  "In Operation": Settings,
  Pending: Clock,
  Shipped: Truck,
  Cancelled: XCircle,
  "Waiting Departure": Anchor,
};

function bookingsKeyFor(period: Period): NumericKey {
  return period === "current" ? "bookingsCurrentMonth" : "bookingsNextMonth";
}

function containersKeyFor(period: Period): NumericKey {
  return period === "current" ? "containersCurrentMonth" : "containersNextMonth";
}

function sumBy(rows: StatusShipmentRow[], dataKey: NumericKey) {
  return rows.reduce((sum, row) => sum + row[dataKey], 0);
}

function ToggleGroup<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div className="inline-flex rounded-full bg-navy-50 p-1">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={cn(
            "rounded-full px-3 py-1.5 text-xs font-semibold transition-colors",
            value === option.value
              ? "bg-white text-navy-900 shadow-sm"
              : "text-navy-500 hover:text-navy-900"
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

function RingTooltip({
  active,
  payload,
  bookingsByStatus,
  containersByStatus,
}: {
  active?: boolean;
  payload?: { payload: StatusShipmentRow }[];
  bookingsByStatus: Map<string, number>;
  containersByStatus: Map<string, number>;
}) {
  if (!active || !payload || payload.length === 0) return null;
  const status = payload[0].payload.status;

  return (
    <div className="rounded-lg border border-navy-100 bg-white px-3 py-2 text-xs shadow-lg">
      <p className="font-semibold text-navy-900">{status}</p>
      <hr className="my-1.5 border-navy-100" />
      <p className="text-navy-500">
        Bookings: <span className="font-semibold text-navy-900">{bookingsByStatus.get(status) ?? 0}</span>
      </p>
      <p className="text-navy-500">
        Containers: <span className="font-semibold text-navy-900">{containersByStatus.get(status) ?? 0}</span>
      </p>
    </div>
  );
}

export function StatusShipmentsPanel({ rows }: { rows: StatusShipmentRow[] }) {
  const [period, setPeriod] = useState<Period>("current");
  const bookingsKey = bookingsKeyFor(period);
  const containersKey = containersKeyFor(period);

  const bookingsSegments = rows
    .filter((row) => row[bookingsKey] > 0)
    .sort((a, b) => b[bookingsKey] - a[bookingsKey]);
  const containersSegments = rows
    .filter((row) => row[containersKey] > 0)
    .sort((a, b) => b[containersKey] - a[containersKey]);

  const bookingsTotal = sumBy(rows, bookingsKey);
  const containersTotal = sumBy(rows, containersKey);

  const bookingsByStatus = new Map(rows.map((row) => [row.status, row[bookingsKey]]));
  const containersByStatus = new Map(rows.map((row) => [row.status, row[containersKey]]));

  const allStatuses = rows
    .filter((row) => row[bookingsKey] > 0 || row[containersKey] > 0)
    .sort((a, b) => b[bookingsKey] + b[containersKey] - (a[bookingsKey] + a[containersKey]));

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-status-lead/10 text-status-lead">
            <Ship size={20} />
          </span>
          <div>
            <p className="text-base font-bold text-navy-900">Status dos embarques</p>
            <p className="text-sm text-navy-500">Bookings e containers por status</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ToggleGroup
            value={period}
            onChange={setPeriod}
            options={[
              { value: "current", label: "Mês atual" },
              { value: "next", label: "Próx. mês" },
            ]}
          />
          <span
            title="Comparação de bookings e containers por status e período."
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-navy-300 hover:text-navy-500"
          >
            <Info size={16} />
          </span>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 border-t border-navy-100 pt-6">
        <div className="text-center">
          <p className="mb-2 text-xs font-semibold text-navy-500">Bookings</p>
          <div className="relative mx-auto h-36 w-36">
            {bookingsSegments.length === 0 ? (
              <div className="flex h-full items-center justify-center rounded-full bg-navy-50 text-xs text-navy-400">
                Sem dados
              </div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={bookingsSegments}
                      dataKey={bookingsKey}
                      nameKey="status"
                      innerRadius="60%"
                      outerRadius="100%"
                      paddingAngle={bookingsSegments.length > 1 ? 2 : 0}
                      cornerRadius={3}
                      stroke="none"
                      isAnimationActive={false}
                    >
                      {bookingsSegments.map((row) => (
                        <Cell key={row.status} fill={row.colorCode} />
                      ))}
                    </Pie>
                    <Tooltip
                      content={
                        <RingTooltip
                          bookingsByStatus={bookingsByStatus}
                          containersByStatus={containersByStatus}
                        />
                      }
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl font-bold text-navy-900">{bookingsTotal}</span>
                  <span className="text-[10px] text-navy-400">total</span>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="text-center">
          <p className="mb-2 text-xs font-semibold text-navy-500">Containers</p>
          <div className="relative mx-auto h-36 w-36">
            {containersSegments.length === 0 ? (
              <div className="flex h-full items-center justify-center rounded-full bg-navy-50 text-xs text-navy-400">
                Sem dados
              </div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={containersSegments}
                      dataKey={containersKey}
                      nameKey="status"
                      innerRadius="60%"
                      outerRadius="100%"
                      paddingAngle={containersSegments.length > 1 ? 2 : 0}
                      cornerRadius={3}
                      stroke="none"
                      isAnimationActive={false}
                    >
                      {containersSegments.map((row) => (
                        <Cell key={row.status} fill={row.colorCode} />
                      ))}
                    </Pie>
                    <Tooltip
                      content={
                        <RingTooltip
                          bookingsByStatus={bookingsByStatus}
                          containersByStatus={containersByStatus}
                        />
                      }
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl font-bold text-navy-900">{containersTotal}</span>
                  <span className="text-[10px] text-navy-400">total</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-2 border-t border-navy-100 pt-5">
        <div className="grid grid-cols-[1fr_64px_72px] gap-2 text-[10px] font-semibold uppercase tracking-wide text-navy-400">
          <span>Status</span>
          <span className="text-right">Bookings</span>
          <span className="text-right">Containers</span>
        </div>
        {allStatuses.length === 0 ? (
          <p className="text-sm text-navy-400">Nenhum dado para esta seleção.</p>
        ) : (
          allStatuses.map((row) => {
            const Icon = STATUS_ICONS[row.status] ?? Circle;
            return (
              <div
                key={row.status}
                className="grid grid-cols-[1fr_64px_72px] items-center gap-2 text-sm"
              >
                <span className="flex min-w-0 items-center gap-2 text-navy-700">
                  <span
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{ backgroundColor: row.colorCode }}
                  />
                  <Icon size={14} className="shrink-0 text-navy-400" />
                  <span className="truncate">{row.status}</span>
                </span>
                <span className="text-right font-semibold text-navy-900">
                  {row[bookingsKey]}
                </span>
                <span className="text-right font-semibold text-navy-900">
                  {row[containersKey]}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
