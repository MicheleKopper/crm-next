import { cn } from "@/lib/utils";
import type { PeriodSummary } from "@/server/modules/dashboard/dashboard.dto";

function DeltaBadge({ value }: { value: number }) {
  const positive = value >= 0;
  return (
    <span
      className={cn(
        "ml-1 text-[11px] font-semibold",
        positive ? "text-status-ativo" : "text-status-perdido"
      )}
    >
      {positive ? "+" : ""}
      {value}%
    </span>
  );
}

function PeriodMiniCard({
  label,
  bookings,
  containers,
  bookingsDelta,
  containersDelta,
}: {
  label: string;
  bookings: number;
  containers: number;
  bookingsDelta?: number;
  containersDelta?: number;
}) {
  return (
    <div className="rounded-lg border border-navy-100 bg-navy-50/40 p-3 text-center">
      <p className="mb-2 text-[10px] font-bold uppercase tracking-wide text-navy-400">
        {label}
      </p>
      <p className="text-lg font-bold text-navy-900">
        {bookings}
        {bookingsDelta !== undefined && <DeltaBadge value={bookingsDelta} />}
      </p>
      <p className="text-[10px] font-semibold text-navy-400">Bookings</p>
      <p className="mt-1.5 text-lg font-bold text-navy-900">
        {containers}
        {containersDelta !== undefined && <DeltaBadge value={containersDelta} />}
      </p>
      <p className="text-[10px] font-semibold text-navy-400">Containers</p>
    </div>
  );
}

export function PeriodCards({
  shipmentsSummary,
  containerSummary,
}: {
  shipmentsSummary: PeriodSummary;
  containerSummary: PeriodSummary;
}) {
  return (
    <div className="grid grid-cols-3 gap-2.5">
      <PeriodMiniCard
        label="Mês anterior"
        bookings={shipmentsSummary.lastMonth}
        containers={containerSummary.lastMonth}
      />
      <PeriodMiniCard
        label="Mês atual"
        bookings={shipmentsSummary.currentMonth}
        containers={containerSummary.currentMonth}
        bookingsDelta={shipmentsSummary.percCurrent}
        containersDelta={containerSummary.percCurrent}
      />
      <PeriodMiniCard
        label="Próx. mês"
        bookings={shipmentsSummary.nextMonth}
        containers={containerSummary.nextMonth}
        bookingsDelta={shipmentsSummary.percNext}
        containersDelta={containerSummary.percNext}
      />
    </div>
  );
}
