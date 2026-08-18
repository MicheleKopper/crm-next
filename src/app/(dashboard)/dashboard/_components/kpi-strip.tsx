import type { ComponentType } from "react";

import { DeltaBadge } from "@/components/dashboard/dashboard-card";

export function KpiTile({
  icon: Icon,
  value,
  delta,
  label,
}: {
  icon: ComponentType<{ size?: number }>;
  value: number;
  delta?: number;
  label: string;
}) {
  return (
    <div className="h-full rounded-2xl border border-navy-100 bg-white p-5 shadow-[0_1px_2px_rgba(16,26,48,0.05)]">
      <span className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-navy-100/70 text-navy-500">
        <Icon size={17} />
      </span>
      <p className="flex items-baseline gap-2">
        <span className="text-[30px] font-bold leading-none tracking-[-0.035em] text-navy-900">
          {value}
        </span>
        <DeltaBadge value={delta} />
      </p>
      <p className="mt-1.5 text-[12.5px] text-navy-500">{label}</p>
    </div>
  );
}
