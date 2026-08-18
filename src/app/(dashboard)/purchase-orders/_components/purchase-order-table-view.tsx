import { ChevronRight } from "lucide-react";
import Link from "next/link";

import { PurchaseOrderStatusBadge } from "@/components/ui/badge";
import type { PurchaseOrderListRow } from "@/server/modules/purchase-orders/purchase-order.repository";

const COLUMNS = [
  "Status",
  "Nº da PO",
  "Data da PO",
  "Chegada",
  "Liberação",
  "Flexitanks",
];

function formatDate(value: Date | null) {
  return value ? new Date(value).toLocaleDateString("pt-BR", { timeZone: "UTC" }) : "—";
}

export function PurchaseOrderTableView({ items }: { items: PurchaseOrderListRow[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-navy-100 dark:border-navy-700">
            {COLUMNS.map((column) => (
              <th
                key={column}
                className="whitespace-nowrap py-2 pr-4 text-xs font-semibold uppercase tracking-wide text-navy-400 dark:text-navy-100/40"
              >
                {column}
              </th>
            ))}
            <th className="py-2 pl-4" />
          </tr>
        </thead>
        <tbody className="divide-y divide-navy-100 dark:divide-navy-700">
          {items.map((po) => {
            const status = po.clearenceDate ? "Completed" : "Expected";
            return (
              <tr key={po.uid} className="hover:bg-navy-50 dark:hover:bg-navy-800">
                <td className="py-3 pr-4">
                  <PurchaseOrderStatusBadge status={status} />
                </td>
                <td className="whitespace-nowrap py-3 pr-4 font-semibold text-navy-900 dark:text-navy-100">
                  {po.poNumber ?? "—"}
                </td>
                <td className="whitespace-nowrap py-3 pr-4 text-navy-700 dark:text-navy-100">
                  {formatDate(po.poDate)}
                </td>
                <td className="whitespace-nowrap py-3 pr-4 text-navy-700 dark:text-navy-100">
                  {formatDate(po.arrivalDate)}
                </td>
                <td className="whitespace-nowrap py-3 pr-4 text-navy-700 dark:text-navy-100">
                  {formatDate(po.clearenceDate)}
                </td>
                <td className="whitespace-nowrap py-3 pr-4 text-navy-700 dark:text-navy-100">
                  {po.flexitankCount}
                </td>
                <td className="py-3 pl-4 text-right">
                  <Link
                    href={`/purchase-orders/${po.uid}`}
                    aria-label={`Ver detalhes da PO ${po.poNumber}`}
                    className="inline-flex rounded-full p-2 text-navy-700 hover:bg-navy-100 dark:text-navy-100 dark:hover:bg-navy-800"
                  >
                    <ChevronRight size={18} />
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
