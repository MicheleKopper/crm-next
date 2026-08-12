import { Building2, Package, Ship, UserPlus } from "lucide-react";
import type { ComponentType } from "react";

import { cn } from "@/lib/utils";

function DeltaBadge({ value }: { value: number }) {
  const positive = value >= 0;
  return (
    <span
      className={cn(
        "text-xs font-semibold",
        positive ? "text-status-ativo" : "text-status-perdido"
      )}
    >
      {positive ? "+" : ""}
      {value}%
    </span>
  );
}

function KpiTile({
  icon: Icon,
  iconClass,
  value,
  delta,
  label,
}: {
  icon: ComponentType<{ size?: number }>;
  iconClass: string;
  value: number;
  delta?: number;
  label: string;
}) {
  return (
    <div className="rounded-xl border border-navy-100 bg-white p-5">
      <span
        className={cn(
          "mb-3 flex h-9 w-9 items-center justify-center rounded-lg",
          iconClass
        )}
      >
        <Icon size={17} />
      </span>
      <p className="flex items-baseline gap-1.5 text-3xl font-bold text-navy-900">
        {value}
        {delta !== undefined && <DeltaBadge value={delta} />}
      </p>
      <p className="mt-1 text-sm font-medium text-navy-500">{label}</p>
    </div>
  );
}

export function KpiStrip({
  bookings,
  bookingsDelta,
  containers,
  containersDelta,
  activeCustomers,
  newCustomers,
}: {
  bookings: number;
  bookingsDelta: number;
  containers: number;
  containersDelta: number;
  activeCustomers: number;
  newCustomers: number;
}) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      <KpiTile
        icon={Package}
        iconClass="bg-status-lead/10 text-status-lead"
        value={bookings}
        delta={bookingsDelta}
        label="Bookings no mês"
      />
      <KpiTile
        icon={Ship}
        iconClass="bg-status-ativo/10 text-status-ativo"
        value={containers}
        delta={containersDelta}
        label="Containers no mês"
      />
      <KpiTile
        icon={Building2}
        iconClass="bg-status-prospecto/10 text-status-prospecto"
        value={activeCustomers}
        label="Clientes ativos"
      />
      <KpiTile
        icon={UserPlus}
        iconClass="bg-status-orange/10 text-status-orange"
        value={newCustomers}
        label="Novos clientes"
      />
    </div>
  );
}
