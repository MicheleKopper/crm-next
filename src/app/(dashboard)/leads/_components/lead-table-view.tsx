import { ChevronRight } from "lucide-react";
import Link from "next/link";

import { LeadStatusBadge } from "@/components/ui/badge";
import type { LeadListRow } from "@/server/modules/leads/lead.repository";

const COLUMNS = [
  "Status",
  "Lead",
  "Empresa",
  "Urgência",
  "Modal",
  "Responsável",
  "Última interação",
];

export function LeadTableView({ items }: { items: LeadListRow[] }) {
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
          {items.map((lead) => (
            <tr key={lead.uid} className="hover:bg-navy-50 dark:hover:bg-navy-800">
              <td className="py-3 pr-4">
                <LeadStatusBadge status={lead.status} />
              </td>
              <td
                className="max-w-[160px] truncate py-3 pr-4 font-semibold text-navy-900 dark:text-navy-100"
                title={lead.contactName ?? undefined}
              >
                {lead.contactName || "—"}
              </td>
              <td
                className="max-w-[200px] truncate py-3 pr-4 text-navy-700 dark:text-navy-100"
                title={lead.displayName}
              >
                {lead.displayName}
              </td>
              <td className="whitespace-nowrap py-3 pr-4 text-navy-700 dark:text-navy-100">
                {lead.urgency}
              </td>
              <td className="whitespace-nowrap py-3 pr-4 text-navy-700 dark:text-navy-100">
                {lead.modal}
              </td>
              <td
                className="max-w-[160px] truncate py-3 pr-4 text-navy-700 dark:text-navy-100"
                title={lead.operatorFullName}
              >
                {lead.operatorFullName || "—"}
              </td>
              <td className="whitespace-nowrap py-3 pr-4 text-navy-500 dark:text-navy-100/70">
                {lead.lastInteractionAt
                  ? new Date(lead.lastInteractionAt).toLocaleDateString("pt-BR")
                  : "—"}
              </td>
              <td className="py-3 pl-4 text-right">
                <Link
                  href={`/leads/${lead.uid}`}
                  aria-label={`Ver detalhes de ${lead.contactName || lead.displayName}`}
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
