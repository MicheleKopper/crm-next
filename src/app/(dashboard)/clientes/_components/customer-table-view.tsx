import { ChevronRight } from "lucide-react";
import Link from "next/link";

import { StatusBadge } from "@/components/ui/badge";
import type { CustomerListRow } from "@/server/modules/customers/customer.repository";

const COLUMNS = [
  "Status",
  "Nome",
  "Razão social",
  "Segmento",
  "Porte",
  "Potencial",
  "Carga",
  "País",
  "Responsável",
  "Criado em",
];

export function CustomerTableView({ items }: { items: CustomerListRow[] }) {
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
          {items.map((customer) => (
            <tr key={customer.uid} className="hover:bg-navy-50 dark:hover:bg-navy-800">
              <td className="py-3 pr-4">
                <StatusBadge status={customer.status} />
              </td>
              <td
                className="max-w-[180px] truncate py-3 pr-4 font-semibold text-navy-900 dark:text-navy-100"
                title={customer.displayName}
              >
                {customer.displayName}
              </td>
              <td
                className="max-w-[220px] truncate py-3 pr-4 text-navy-500 dark:text-navy-100/70"
                title={customer.legalName}
              >
                {customer.legalName}
              </td>
              <td className="whitespace-nowrap py-3 pr-4 text-navy-700 dark:text-navy-100">
                {customer.segment ?? "—"}
              </td>
              <td className="whitespace-nowrap py-3 pr-4 text-navy-700 dark:text-navy-100">
                {customer.size ?? "—"}
              </td>
              <td className="whitespace-nowrap py-3 pr-4 text-navy-700 dark:text-navy-100">
                {customer.accountPotential ?? "—"}
              </td>
              <td className="whitespace-nowrap py-3 pr-4 text-navy-700 dark:text-navy-100">
                {customer.cargoType ?? "—"}
              </td>
              <td className="whitespace-nowrap py-3 pr-4 text-navy-700 dark:text-navy-100">
                {customer.country ?? "—"}
              </td>
              <td
                className="max-w-[160px] truncate py-3 pr-4 text-navy-700 dark:text-navy-100"
                title={customer.ownerFullName}
              >
                {customer.ownerFullName || "—"}
              </td>
              <td className="whitespace-nowrap py-3 pr-4 text-navy-500 dark:text-navy-100/70">
                {new Date(customer.createdAt).toLocaleDateString("pt-BR")}
              </td>
              <td className="py-3 pl-4 text-right">
                <Link
                  href={`/clientes/${customer.uid}`}
                  aria-label={`Ver detalhes de ${customer.displayName}`}
                  className="inline-flex rounded-full p-2 text-navy-700 hover:bg-navy-100 dark:text-navy-100 dark:hover:bg-navy-800"
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
