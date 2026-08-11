"use client";

import { ChevronDown, SlidersHorizontal } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import type { FlexitankCounterRow } from "@/server/modules/flexitanks/flexitank.repository";

import { formatPortName, getActiveSizes, SummaryPanel } from "./summary-panel";

function toggleSetItem(set: Set<string>, item: string) {
  const next = new Set(set);
  if (next.has(item)) next.delete(item);
  else next.add(item);
  return next;
}

function ToggleChip({
  label,
  hidden,
  onToggle,
}: {
  label: string;
  hidden: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={!hidden}
      className={cn(
        "rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
        hidden
          ? "border-navy-100 bg-white text-navy-400 line-through"
          : "border-navy-100 bg-navy-50 text-navy-700 hover:bg-navy-100"
      )}
    >
      {label}
    </button>
  );
}

function ToggleGroup({
  title,
  items,
  hiddenKeys,
  onToggle,
}: {
  title: string;
  items: { key: string; label: string }[];
  hiddenKeys: Set<string>;
  onToggle: (key: string) => void;
}) {
  if (items.length === 0) return null;
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-navy-400">
        {title}
      </p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {items.map((item) => (
          <ToggleChip
            key={item.key}
            label={item.label}
            hidden={hiddenKeys.has(item.key)}
            onToggle={() => onToggle(item.key)}
          />
        ))}
      </div>
    </div>
  );
}

export function SummarySection({
  counterRows,
}: {
  counterRows: FlexitankCounterRow[];
}) {
  const [open, setOpen] = useState(true);
  const [togglesOpen, setTogglesOpen] = useState(false);
  const [hiddenPorts, setHiddenPorts] = useState<Set<string>>(new Set());
  const [hiddenCompanies, setHiddenCompanies] = useState<Set<string>>(new Set());
  const [hiddenSizes, setHiddenSizes] = useState<Set<string>>(new Set());
  const togglesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!togglesOpen) return;
    function handleClickOutside(event: MouseEvent) {
      if (!togglesRef.current?.contains(event.target as Node)) {
        setTogglesOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [togglesOpen]);

  const activeSizes = getActiveSizes(counterRows);
  const ports = Array.from(
    new Set(
      counterRows.map((row) => row.portName).filter((name): name is string => Boolean(name))
    )
  );
  const companies = Array.from(new Set(counterRows.map((row) => row.companyName)));

  const hasActiveToggles =
    hiddenPorts.size > 0 || hiddenCompanies.size > 0 || hiddenSizes.size > 0;

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-navy-900">Inventário</h2>

        <div className="flex items-center gap-1">
          <div ref={togglesRef} className="relative">
            <button
              type="button"
              onClick={() => setTogglesOpen((value) => !value)}
              aria-expanded={togglesOpen}
              aria-label="Ocultar ou exibir itens da tabela"
              className={cn(
                "rounded-full p-1.5 transition-colors",
                hasActiveToggles
                  ? "bg-status-lead/10 text-status-lead"
                  : "text-navy-400 hover:bg-navy-100 hover:text-navy-900"
              )}
            >
              <SlidersHorizontal size={16} />
            </button>

            {togglesOpen && (
              <div className="absolute right-0 top-full z-10 mt-2 w-72 space-y-4 rounded-xl border border-navy-100 bg-white p-4 shadow-lg">
                <ToggleGroup
                  title="Porto"
                  items={ports.map((port) => ({ key: port, label: formatPortName(port) }))}
                  hiddenKeys={hiddenPorts}
                  onToggle={(key) =>
                    setHiddenPorts((current) => toggleSetItem(current, key))
                  }
                />
                <ToggleGroup
                  title="Empresa"
                  items={companies.map((company) => ({ key: company, label: company }))}
                  hiddenKeys={hiddenCompanies}
                  onToggle={(key) =>
                    setHiddenCompanies((current) => toggleSetItem(current, key))
                  }
                />
                <ToggleGroup
                  title="Tamanho"
                  items={activeSizes.map((size) => ({ key: size, label: size }))}
                  hiddenKeys={hiddenSizes}
                  onToggle={(key) =>
                    setHiddenSizes((current) => toggleSetItem(current, key))
                  }
                />
              </div>
            )}
          </div>

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
      </div>

      {open && (
        <div className="mt-4">
          <SummaryPanel
            counterRows={counterRows}
            hiddenPorts={hiddenPorts}
            hiddenCompanies={hiddenCompanies}
            hiddenSizes={hiddenSizes}
          />
        </div>
      )}
    </div>
  );
}
