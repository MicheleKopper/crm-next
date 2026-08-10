"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";

const TABS = ["Detalhes", "Oportunidades", "Atividades"] as const;
type Tab = (typeof TABS)[number];

export function LeadDetailTabs({
  detailsPanel,
  opportunitiesPanel,
  activitiesPanel,
}: {
  detailsPanel: React.ReactNode;
  opportunitiesPanel: React.ReactNode;
  activitiesPanel: React.ReactNode;
}) {
  const [tab, setTab] = useState<Tab>("Detalhes");

  const panels: Record<Tab, React.ReactNode> = {
    Detalhes: detailsPanel,
    Oportunidades: opportunitiesPanel,
    Atividades: activitiesPanel,
  };

  return (
    <div className="rounded-xl bg-white shadow-sm">
      <nav className="flex gap-8 border-b border-navy-100 px-6">
        {TABS.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setTab(item)}
            className={cn(
              "border-b-2 py-4 text-sm font-semibold transition-colors",
              tab === item
                ? "border-navy-900 text-navy-900"
                : "border-transparent text-navy-500 hover:text-navy-900"
            )}
          >
            {item}
          </button>
        ))}
      </nav>
      <div className="p-6">{panels[tab]}</div>
    </div>
  );
}
