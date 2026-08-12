import { cn } from "@/lib/utils";

function RankRow({
  label,
  value,
  max,
  colorClass,
}: {
  label: string;
  value: number;
  max: number;
  colorClass: string;
}) {
  const width = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="flex w-20 shrink-0 items-center gap-2 text-xs text-navy-500">
        <span className={cn("h-2 w-2 shrink-0 rounded-full", colorClass)} />
        {label}
      </span>
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-navy-100">
        <div
          className={cn("h-full min-w-[6px] rounded-full", colorClass)}
          style={{ width: `${width}%` }}
        />
      </div>
      <span className="w-6 shrink-0 text-right text-sm font-bold text-navy-900">
        {value}
      </span>
    </div>
  );
}

export function CustomerAcquisitionList({
  leads,
  potential,
  new: newCount,
}: {
  leads: number;
  potential: number;
  new: number;
}) {
  const items = [
    { key: "new", label: "Novos", value: newCount, colorClass: "bg-status-ativo" },
    { key: "potential", label: "Potenciais", value: potential, colorClass: "bg-status-lead" },
    { key: "leads", label: "Leads", value: leads, colorClass: "bg-navy-500" },
  ].sort((a, b) => b.value - a.value);

  const max = Math.max(...items.map((item) => item.value), 1);

  return (
    <div className="space-y-2.5">
      {items.map((item) => (
        <RankRow
          key={item.key}
          label={item.label}
          value={item.value}
          max={max}
          colorClass={item.colorClass}
        />
      ))}
    </div>
  );
}
