"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";
import { DashboardCard, SegmentedControl } from "@/components/dashboard/dashboard-card";

type Props = {
  sizes: string[];
  available: Record<string, number>;
  expected: Record<string, number>;
};

function SizeTile({
  size,
  available,
  expected,
}: {
  size: string;
  available: number;
  expected: number;
}) {
  const out = available === 0;

  return (
    <div
      className={cn(
        "flex flex-col gap-2.5 rounded-xl border p-3.5",
        out ? "border-status-perdido/25 bg-status-perdido/[0.03]" : "border-navy-100 dark:border-navy-700"
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-navy-900 dark:text-navy-100">{size}</span>
        {out ? (
          <span className="text-[10.5px] font-semibold text-status-perdido">sem estoque</span>
        ) : (
          <span className="h-[7px] w-[7px] rounded-full bg-status-ativo" />
        )}
      </div>

      <div className="flex items-baseline gap-1.5">
        <span
          className={cn(
            "text-[28px] font-bold leading-none tracking-[-0.035em]",
            out ? "text-status-perdido/35" : "text-navy-900 dark:text-navy-100"
          )}
        >
          {available}
        </span>
        <span className="text-[11.5px] text-navy-500 dark:text-navy-100/70">disponível</span>
      </div>

      <div
        className={cn(
          "flex items-center gap-1.5 border-t pt-2.5 text-[11.5px] text-navy-500 dark:text-navy-100/70",
          out ? "border-status-perdido/15" : "border-navy-100/70 dark:border-navy-700/70"
        )}
      >
        {expected > 0 ? (
          <>
            <span className="rounded-md bg-status-lead/10 px-1.5 py-0.5 font-semibold text-status-lead">
              +{expected}
            </span>
            esperados
          </>
        ) : (
          <span className="text-navy-500/70 dark:text-navy-100/40">Nada previsto</span>
        )}
      </div>
    </div>
  );
}

export function FlexitankAvailabilityGrid({ sizes, available, expected }: Props) {
  const [onlyInStock, setOnlyInStock] = useState(false);

  const totalAvailable = sizes.reduce((sum, size) => sum + (available[size] ?? 0), 0);
  const visible = onlyInStock ? sizes.filter((size) => (available[size] ?? 0) > 0) : sizes;

  return (
    <DashboardCard
      title="Flexitanks em estoque"
      subtitle={`${sizes.length} ${sizes.length === 1 ? "tamanho" : "tamanhos"} · ${totalAvailable} ${
        totalAvailable === 1 ? "unidade" : "unidades"
      } disponíveis`}
      actions={
        <SegmentedControl
          value={onlyInStock}
          onChange={setOnlyInStock}
          options={[
            { value: false, label: "Todos" },
            { value: true, label: "Só com estoque" },
          ]}
        />
      }
    >
      {visible.length === 0 ? (
        <p className="p-5 text-sm text-navy-500 dark:text-navy-100/70">
          Nenhum flexitank disponível ou esperado.
        </p>
      ) : (
        <div className="@container">
          <div className="grid grid-cols-2 gap-3 p-5 @lg:grid-cols-3 @4xl:grid-cols-4 @6xl:grid-cols-6">
            {visible.map((size) => (
              <SizeTile
                key={size}
                size={size}
                available={available[size] ?? 0}
                expected={expected[size] ?? 0}
              />
            ))}
          </div>
        </div>
      )}
    </DashboardCard>
  );
}
