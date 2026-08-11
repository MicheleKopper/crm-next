import { ChevronRight, User } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Placeholder data only — Opportunities has no backend yet in this iteration.
 * Layout is ready to swap for a real `listOpportunities`-style call once that
 * API exists.
 */
const MOCK_OPPORTUNITIES = [
  {
    status: "Negociação",
    title: "Contrato anual de frete marítimo",
    service: "Serviço 01",
    operatorFullName: "Michele Kopper",
  },
];

const STATUS_CLASSES: Record<string, string> = {
  Negociação: "bg-status-orange/10 text-status-orange",
  Ganha: "bg-status-ativo/10 text-status-ativo",
  Perdida: "bg-status-perdido/10 text-status-perdido",
};

export function OpportunitiesTab() {
  if (MOCK_OPPORTUNITIES.length === 0) {
    return (
      <p className="py-12 text-center text-navy-500">
        Nenhuma oportunidade cadastrada.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-navy-100">
      {MOCK_OPPORTUNITIES.map((opportunity, index) => (
        <li
          key={index}
          className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-4 py-4 first:pt-0 last:pb-0"
        >
          <span
            className={cn(
              "inline-flex w-fit items-center rounded-full px-2.5 py-1 text-xs font-semibold",
              STATUS_CLASSES[opportunity.status] ?? "bg-navy-100 text-navy-500"
            )}
          >
            {opportunity.status}
          </span>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-navy-900">
              {opportunity.title}
            </p>
            <p className="mt-0.5 truncate text-xs text-navy-500">
              {opportunity.service}
            </p>
          </div>

          <p className="hidden items-center gap-1.5 truncate text-sm text-navy-700 sm:flex">
            <User size={14} className="shrink-0 text-navy-400" />
            {opportunity.operatorFullName}
          </p>

          <button
            type="button"
            aria-label={`Ver detalhes de ${opportunity.title}`}
            title="Ver detalhes"
            className="rounded-lg p-2 text-navy-500 hover:bg-navy-100 hover:text-navy-900"
          >
            <ChevronRight size={16} />
          </button>
        </li>
      ))}
    </ul>
  );
}
