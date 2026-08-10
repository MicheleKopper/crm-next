import { ChevronRight } from "lucide-react";
import Link from "next/link";

import { LeadStatusBadge } from "@/components/ui/badge";
import type { LeadListRow } from "@/server/modules/leads/lead.repository";

function MetaField({ label, value }: { label: string; value: string | null }) {
  return (
    <>
      <span className="font-semibold text-navy-500">{label}</span>
      <span className="truncate text-navy-800" title={value ?? undefined}>
        {value || "—"}
      </span>
    </>
  );
}

export function LeadRow({ lead }: { lead: LeadListRow }) {
  return (
    <div className="grid grid-cols-[104px_2fr_1.5fr_1.5fr_auto] items-start gap-4 rounded-lg border-b border-navy-100 py-4 px-2 -mx-2 last:border-b-0 hover:bg-navy-50">
      <LeadStatusBadge status={lead.status} />

      <div className="min-w-0 space-y-1 text-sm">
        <p className="truncate" title={lead.contactName ?? undefined}>
          <span className="font-semibold text-navy-500">Lead</span>{" "}
          <span className="font-semibold text-navy-900">
            {lead.contactName || "—"}
          </span>
        </p>
        <p className="truncate" title={lead.displayName}>
          <span className="font-semibold text-navy-500">Empresa</span>{" "}
          <span className="text-navy-800">{lead.displayName}</span>
        </p>
      </div>

      <div className="grid min-w-0 grid-cols-[auto_1fr] gap-x-2 gap-y-1 text-sm">
        <MetaField label="Urgência" value={lead.urgency} />
        <MetaField label="Modal" value={lead.modal} />
      </div>

      <div className="grid min-w-0 grid-cols-[auto_1fr] gap-x-2 gap-y-1 text-sm">
        <MetaField label="Responsável" value={lead.operatorFullName} />
        <MetaField
          label="Última Interação"
          value={
            lead.lastInteractionAt
              ? new Date(lead.lastInteractionAt).toLocaleDateString("pt-BR")
              : null
          }
        />
      </div>

      <Link
        href={`/leads/${lead.uid}`}
        aria-label={`Ver detalhes de ${lead.contactName || lead.displayName}`}
        className="rounded-full p-2 text-navy-700 hover:bg-navy-100"
      >
        <ChevronRight size={20} />
      </Link>
    </div>
  );
}
