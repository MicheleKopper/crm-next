import { FLEXITANK_SIZES } from "@/server/modules/flexitanks/flexitank.dto";
import type { FlexitankCounterRow } from "@/server/modules/flexitanks/flexitank.repository";

const PORT_NAME_LABELS: Record<string, string> = {
  PARANAGUA: "Paranaguá",
  "RIO GRANDE": "Rio Grande",
  SALVADOR: "Salvador",
  SANTOS: "Santos",
  "SAO SEBASTIAO": "São Sebastião",
};

function formatPortName(portName: string | null) {
  if (!portName) return "—";
  return (
    PORT_NAME_LABELS[portName] ??
    portName
      .toLowerCase()
      .replace(/\b\p{L}/gu, (letter) => letter.toUpperCase())
  );
}

export function SummaryPanel({
  counterRows,
}: {
  counterRows: FlexitankCounterRow[];
}) {
  const activeSizes = FLEXITANK_SIZES.filter((size) =>
    counterRows.some((row) => row.counts[size] > 0)
  );
  const grandTotals = Object.fromEntries(
    activeSizes.map((size) => [
      size,
      counterRows.reduce((sum, row) => sum + row.counts[size], 0),
    ])
  );
  const grandTotal = counterRows.reduce((sum, row) => sum + row.total, 0);

  if (counterRows.length === 0) return null;

  return (
    <div className="overflow-x-auto rounded-xl border border-navy-100">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-navy-100 bg-navy-50">
            <th className="px-4 py-2 text-xs font-semibold uppercase tracking-wide text-navy-400">
              Porto
            </th>
            <th className="px-4 py-2 text-xs font-semibold uppercase tracking-wide text-navy-400">
              Empresa
            </th>
            {activeSizes.map((size) => (
              <th
                key={size}
                className="px-3 py-2 text-center text-xs font-semibold uppercase tracking-wide text-navy-400"
              >
                {size}
              </th>
            ))}
            <th className="px-4 py-2 text-center text-xs font-semibold uppercase tracking-wide text-navy-400">
              Total
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-navy-100">
          {counterRows.map((row) => (
            <tr key={`${row.portName}-${row.companyName}`}>
              <td className="px-4 py-2 text-navy-900">
                {formatPortName(row.portName)}
              </td>
              <td className="px-4 py-2 text-navy-700">{row.companyName}</td>
              {activeSizes.map((size) => (
                <td key={size} className="px-3 py-2 text-center text-navy-700">
                  {row.counts[size]}
                </td>
              ))}
              <td className="px-4 py-2 text-center font-semibold text-navy-900">
                {row.total}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t border-navy-100 bg-navy-50 font-semibold">
            <td className="px-4 py-2 text-navy-900" colSpan={2}>
              Total geral
            </td>
            {activeSizes.map((size) => (
              <td key={size} className="px-3 py-2 text-center text-navy-900">
                {grandTotals[size]}
              </td>
            ))}
            <td className="px-4 py-2 text-center text-navy-900">{grandTotal}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
