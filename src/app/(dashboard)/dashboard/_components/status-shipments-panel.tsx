import type { StatusShipmentRow } from "@/server/modules/dashboard/dashboard.dto";

type NumericKey =
  | "bookingsCurrentMonth"
  | "bookingsNextMonth"
  | "containersCurrentMonth"
  | "containersNextMonth";

function StatusBar({
  rows,
  dataKey,
  label,
}: {
  rows: StatusShipmentRow[];
  dataKey: NumericKey;
  label: string;
}) {
  const total = rows.reduce((sum, row) => sum + row[dataKey], 0);
  const segments = rows.filter((row) => row[dataKey] > 0);

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-xs font-semibold text-navy-500">
        <span>{label}</span>
        <span className="text-navy-900">{total}</span>
      </div>
      {total === 0 ? (
        <div className="h-5 rounded-full bg-navy-100" />
      ) : (
        <div className="flex h-5 overflow-hidden rounded-full">
          {segments.map((row) => (
            <div
              key={row.status}
              style={{
                width: `${(row[dataKey] / total) * 100}%`,
                backgroundColor: row.colorCode,
              }}
              title={`${row.status}: ${row[dataKey]}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function StatusShipmentsPanel({ rows }: { rows: StatusShipmentRow[] }) {
  return (
    <div className="space-y-4">
      <StatusBar rows={rows} dataKey="bookingsCurrentMonth" label="Bookings — mês atual" />
      <StatusBar rows={rows} dataKey="bookingsNextMonth" label="Bookings — próx. mês" />
      <StatusBar rows={rows} dataKey="containersCurrentMonth" label="Containers — mês atual" />
      <StatusBar rows={rows} dataKey="containersNextMonth" label="Containers — próx. mês" />

      <div className="flex flex-wrap gap-x-4 gap-y-1.5 border-t border-navy-100 pt-3">
        {rows.map((row) => (
          <span key={row.status} className="flex items-center gap-1.5 text-xs text-navy-500">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: row.colorCode }}
            />
            {row.status}
          </span>
        ))}
      </div>
    </div>
  );
}
