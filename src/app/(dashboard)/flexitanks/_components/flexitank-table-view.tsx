import { ChevronRight } from "lucide-react";
import Link from "next/link";

import { FlexitankSizeBadge, FlexitankStatusBadge } from "@/components/ui/badge";
import type { FlexitankListRow } from "@/server/modules/flexitanks/flexitank.repository";

const COLUMNS = ["Status", "Série", "PO", "Localização", "Tamanho", "Preço"];

export function FlexitankTableView({ items }: { items: FlexitankListRow[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-navy-100">
            {COLUMNS.map((column) => (
              <th
                key={column}
                className="whitespace-nowrap py-2 pr-4 text-xs font-semibold uppercase tracking-wide text-navy-400"
              >
                {column}
              </th>
            ))}
            <th className="py-2 pl-4" />
          </tr>
        </thead>
        <tbody className="divide-y divide-navy-100">
          {items.map((flexitank) => (
            <tr key={flexitank.uid} className="hover:bg-navy-50">
              <td className="py-3 pr-4">
                <FlexitankStatusBadge status={flexitank.status} />
              </td>
              <td
                className="max-w-[180px] truncate py-3 pr-4 font-semibold text-navy-900"
                title={flexitank.serialNumber}
              >
                {flexitank.serialNumber}
              </td>
              <td
                className="max-w-[140px] truncate py-3 pr-4 text-navy-700"
                title={flexitank.poNumber ?? undefined}
              >
                {flexitank.poNumber || "—"}
              </td>
              <td
                className="max-w-[160px] truncate py-3 pr-4 text-navy-700"
                title={flexitank.locationName ?? undefined}
              >
                {flexitank.locationName || "—"}
              </td>
              <td className="whitespace-nowrap py-3 pr-4">
                <FlexitankSizeBadge size={flexitank.size} />
              </td>
              <td className="whitespace-nowrap py-3 pr-4 font-medium text-navy-900">
                {flexitank.price.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </td>
              <td className="py-3 pl-4 text-right">
                <Link
                  href={`/flexitanks/${flexitank.uid}`}
                  aria-label={`Ver detalhes de ${flexitank.serialNumber}`}
                  className="inline-flex rounded-full p-2 text-navy-700 hover:bg-navy-100"
                >
                  <ChevronRight size={18} />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
