import { ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Placeholder data only — Opportunities has no backend yet in this iteration.
 * Layout is ready to swap for a real `listOpportunities`-style call once that
 * API exists.
 */
const MOCK_OPPORTUNITIES = [
  {
    status: "Em negociação",
    title: "Contrato anual de frete marítimo",
    service: "Serviço 01",
    estimatedValue: "BRL 45.000",
    closesAt: "28/07/2026",
    operatorFullName: "Michele Kopper",
    createdAt: "10/07/2026",
  },
];

const STATUS_CLASSES: Record<string, string> = {
  "Em negociação": "bg-status-orange/10 text-status-orange",
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
    <div>
      {MOCK_OPPORTUNITIES.map((opportunity, index) => (
        <div
          key={index}
          className="grid grid-cols-[104px_2fr_1.5fr_1.5fr_auto] items-start gap-4 border-b border-navy-100 py-4 last:border-b-0"
        >
          <span
            className={cn(
              "inline-flex w-fit items-center rounded-full px-2.5 py-1 text-xs font-semibold",
              STATUS_CLASSES[opportunity.status] ?? "bg-navy-100 text-navy-500"
            )}
          >
            {opportunity.status}
          </span>

          <div className="min-w-0 space-y-1 text-sm">
            <p className="truncate">
              <span className="font-semibold text-navy-500">Título</span>{" "}
              <span className="font-semibold text-navy-900">
                {opportunity.title}
              </span>
            </p>
            <p className="truncate">
              <span className="font-semibold text-navy-500">Responsável</span>{" "}
              <span className="text-navy-800">
                {opportunity.operatorFullName}
              </span>
            </p>
          </div>

          <div className="grid min-w-0 grid-cols-[auto_1fr] gap-x-2 gap-y-1 text-sm">
            <span className="font-semibold text-navy-500">Serviço</span>
            <span className="text-navy-800">{opportunity.service}</span>
            <span className="font-semibold text-navy-500">Valor Est.</span>
            <span className="text-navy-800">{opportunity.estimatedValue}</span>
          </div>

          <div className="grid min-w-0 grid-cols-[auto_1fr] gap-x-2 gap-y-1 text-sm">
            <span className="font-semibold text-navy-500">Fecha em</span>
            <span className="text-navy-800">{opportunity.closesAt}</span>
            <span className="font-semibold text-navy-500">Criado em</span>
            <span className="text-navy-800">{opportunity.createdAt}</span>
          </div>

          <span className="rounded-full p-2 text-navy-300">
            <ChevronRight size={20} />
          </span>
        </div>
      ))}
    </div>
  );
}
