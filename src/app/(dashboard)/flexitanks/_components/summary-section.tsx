"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";
import type { FlexitankCounterRow } from "@/server/modules/flexitanks/flexitank.repository";

import { SummaryPanel } from "./summary-panel";

export function SummarySection({
  counterRows,
}: {
  counterRows: FlexitankCounterRow[];
}) {
  const [open, setOpen] = useState(true);

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-navy-900">Inventário</h2>
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-label={open ? "Recolher resumo" : "Expandir resumo"}
          className="rounded-full p-1.5 text-navy-400 hover:bg-navy-100 hover:text-navy-900"
        >
          <ChevronDown
            size={16}
            className={cn("transition-transform", !open && "-rotate-180")}
          />
        </button>
      </div>

      {open && (
        <div className="mt-4">
          <SummaryPanel counterRows={counterRows} />
        </div>
      )}
    </div>
  );
}
