"use client";

import { useViewMode } from "@/components/list/view-mode";
import type { LeadListRow } from "@/server/modules/leads/lead.repository";

import { LeadRow } from "./lead-row";
import { LeadTableView } from "./lead-table-view";

export function LeadListBody({ items }: { items: LeadListRow[] }) {
  const { view } = useViewMode();

  if (items.length === 0) {
    return (
      <p className="py-12 text-center text-navy-500 dark:text-navy-100/70">Nenhum lead cadastrado.</p>
    );
  }

  if (view === "list") {
    return <LeadTableView items={items} />;
  }

  return (
    <div>
      {items.map((lead) => (
        <LeadRow key={lead.uid} lead={lead} />
      ))}
    </div>
  );
}
