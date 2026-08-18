import { MapPin } from "lucide-react";

import { FLEXITANK_SIZES } from "@/server/modules/flexitanks/flexitank.dto";
import type { FlexitankCounterRow } from "@/server/modules/flexitanks/flexitank.repository";

export const PORT_NAME_LABELS: Record<string, string> = {
  PARANAGUA: "Paranaguá",
  "RIO GRANDE": "Rio Grande",
  SALVADOR: "Salvador",
  SANTOS: "Santos",
  "SAO SEBASTIAO": "São Sebastião",
};

export function formatPortName(portName: string | null) {
  if (!portName) return "—";
  return (
    PORT_NAME_LABELS[portName] ??
    portName
      .toLowerCase()
      .replace(/\b\p{L}/gu, (letter) => letter.toUpperCase())
  );
}

export function getActiveSizes(counterRows: FlexitankCounterRow[]) {
  return FLEXITANK_SIZES.filter((size) =>
    counterRows.some((row) => row.counts[size] > 0)
  );
}

export function SummaryPanel({
  counterRows,
  hiddenPorts,
  hiddenCompanies,
  hiddenSizes,
}: {
  counterRows: FlexitankCounterRow[];
  hiddenPorts: Set<string>;
  hiddenCompanies: Set<string>;
  hiddenSizes: Set<string>;
}) {
  const activeSizes = getActiveSizes(counterRows);
  const visibleSizes = activeSizes.filter((size) => !hiddenSizes.has(size));
  const visibleRows = counterRows.filter(
    (row) =>
      !(row.portName && hiddenPorts.has(row.portName)) &&
      !hiddenCompanies.has(row.companyName)
  );

  const rowTotal = (row: FlexitankCounterRow) =>
    visibleSizes.reduce((sum, size) => sum + row.counts[size], 0);
  const grandTotals = Object.fromEntries(
    visibleSizes.map((size) => [
      size,
      visibleRows.reduce((sum, row) => sum + row.counts[size], 0),
    ])
  );
  const grandTotal = visibleRows.reduce((sum, row) => sum + rowTotal(row), 0);

  if (counterRows.length === 0) return null;

  return (
    <div className="overflow-x-auto rounded-xl border border-navy-100 dark:border-navy-700">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-navy-100 bg-navy-50 dark:border-navy-700 dark:bg-navy-800/60">
            <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-navy-400 dark:text-navy-100/40">
              Porto
            </th>
            <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-navy-400 dark:text-navy-100/40">
              Empresa
            </th>
            {visibleSizes.map((size) => (
              <th
                key={size}
                className="px-3 py-3 text-center text-xs font-semibold uppercase tracking-wide text-navy-400 dark:text-navy-100/40"
              >
                {size}
              </th>
            ))}
            <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wide text-navy-400 dark:text-navy-100/40">
              Total
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-navy-100 dark:divide-navy-700">
          {visibleRows.length === 0 ? (
            <tr>
              <td
                colSpan={visibleSizes.length + 3}
                className="px-5 py-6 text-center text-sm text-navy-400 dark:text-navy-100/40"
              >
                Nenhum item visível. Ajuste as opções de exibição.
              </td>
            </tr>
          ) : (
            visibleRows.map((row) => (
              <tr
                key={`${row.portName}-${row.companyName}`}
                className="hover:bg-navy-50/60 dark:hover:bg-navy-800/60"
              >
                <td className="px-5 py-3 text-navy-900 dark:text-navy-100">
                  <span className="flex items-center gap-2">
                    <MapPin size={14} className="text-navy-400 dark:text-navy-100/40" />
                    {formatPortName(row.portName)}
                  </span>
                </td>
                <td className="px-5 py-3 text-navy-700 dark:text-navy-100">{row.companyName}</td>
                {visibleSizes.map((size) => (
                  <td key={size} className="px-3 py-3 text-center text-navy-700 dark:text-navy-100">
                    {row.counts[size]}
                  </td>
                ))}
                <td className="px-5 py-3 text-center font-semibold text-navy-900 dark:text-navy-100">
                  {rowTotal(row)}
                </td>
              </tr>
            ))
          )}
        </tbody>
        {visibleRows.length > 0 && (
          <tfoot>
            <tr className="border-t border-navy-100 bg-navy-100/60 font-semibold dark:border-navy-700 dark:bg-navy-800/60">
              <td className="px-5 py-3 text-navy-900 dark:text-navy-100" colSpan={2}>
                Total geral
              </td>
              {visibleSizes.map((size) => (
                <td key={size} className="px-3 py-3 text-center text-navy-900 dark:text-navy-100">
                  {grandTotals[size]}
                </td>
              ))}
              <td className="px-5 py-3 text-center text-navy-900 dark:text-navy-100">
                {grandTotal}
              </td>
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
}
