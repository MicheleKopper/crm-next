"use client";

import { Building2, ChevronDown, MapPin, Package, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { ComponentType } from "react";

import { cn } from "@/lib/utils";
import type { FlexitankCounterRow } from "@/server/modules/flexitanks/flexitank.repository";

import { formatPortName, getActiveSizes, SummaryPanel } from "./summary-panel";

function toggleSetItem(set: Set<string>, item: string) {
  const next = new Set(set);
  if (next.has(item)) next.delete(item);
  else next.add(item);
  return next;
}

function FilterChip({
  label,
  active,
  onToggle,
}: {
  label: string;
  active: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={active}
      className={cn(
        "rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
        active
          ? "border-status-lead/30 bg-status-lead/10 text-status-lead hover:bg-status-lead/15"
          : "border-navy-100 bg-white text-navy-400 line-through hover:border-navy-200 hover:text-navy-500"
      )}
    >
      {label}
    </button>
  );
}

function FilterSection({
  icon: Icon,
  iconClass,
  title,
  items,
  hiddenKeys,
  onToggle,
}: {
  icon: ComponentType<{ size?: number }>;
  iconClass: string;
  title: string;
  items: { key: string; label: string }[];
  hiddenKeys: Set<string>;
  onToggle: (key: string) => void;
}) {
  if (items.length === 0) return null;
  return (
    <div className="border-b border-navy-100 pb-3 last:border-b-0 last:pb-0">
      <div className="mb-1.5 flex items-center gap-2">
        <span
          className={cn(
            "flex h-7 w-7 items-center justify-center rounded-lg",
            iconClass
          )}
        >
          <Icon size={14} />
        </span>
        <p className="text-xs font-semibold uppercase tracking-wide text-navy-500">
          {title}
        </p>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {items.map((item) => (
          <FilterChip
            key={item.key}
            label={item.label}
            active={!hiddenKeys.has(item.key)}
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
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [hiddenPorts, setHiddenPorts] = useState<Set<string>>(new Set());
  const [hiddenCompanies, setHiddenCompanies] = useState<Set<string>>(new Set());
  const [hiddenSizes, setHiddenSizes] = useState<Set<string>>(new Set());
  const filtersRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!filtersOpen) return;
    function handleClickOutside(event: MouseEvent) {
      if (!filtersRef.current?.contains(event.target as Node)) {
        setFiltersOpen(false);
      }
    }
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setFiltersOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [filtersOpen]);

  const activeSizes = getActiveSizes(counterRows);
  const ports = Array.from(
    new Set(
      counterRows.map((row) => row.portName).filter((name): name is string => Boolean(name))
    )
  );
  const companies = Array.from(new Set(counterRows.map((row) => row.companyName)));

  const activeFilterCount = hiddenPorts.size + hiddenCompanies.size + hiddenSizes.size;

  function clearFilters() {
    setHiddenPorts(new Set());
    setHiddenCompanies(new Set());
    setHiddenSizes(new Set());
  }

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-navy-900">Inventário</h2>

        <div className="flex items-center gap-1">
          <div ref={filtersRef} className="relative">
            <button
              type="button"
              onClick={() => setFiltersOpen((value) => !value)}
              aria-expanded={filtersOpen}
              aria-label="Filtrar inventário"
              className="relative rounded-full p-1.5 text-navy-400 hover:bg-navy-100 hover:text-navy-900"
            >
              <SlidersHorizontal size={16} />
              {activeFilterCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-navy-900 text-[10px] font-semibold text-white">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {filtersOpen && (
              <div className="absolute right-0 top-full z-20 mt-2 w-[min(20rem,90vw)] rounded-xl border border-navy-100 bg-white shadow-lg">
                <div className="flex items-center justify-between border-b border-navy-100 px-4 py-2.5">
                  <p className="text-sm font-bold text-navy-900">Filtrar inventário</p>
                  <button
                    type="button"
                    onClick={() => setFiltersOpen(false)}
                    aria-label="Fechar"
                    className="rounded-full p-1 text-navy-400 hover:bg-navy-50 hover:text-navy-900"
                  >
                    <X size={14} />
                  </button>
                </div>

                <div className="max-h-80 space-y-3 overflow-y-auto px-4 py-3">
                  <FilterSection
                    icon={MapPin}
                    iconClass="bg-status-lead/10 text-status-lead"
                    title="Porto"
                    items={ports.map((port) => ({ key: port, label: formatPortName(port) }))}
                    hiddenKeys={hiddenPorts}
                    onToggle={(key) =>
                      setHiddenPorts((current) => toggleSetItem(current, key))
                    }
                  />
                  <FilterSection
                    icon={Building2}
                    iconClass="bg-status-prospecto/10 text-status-prospecto"
                    title="Empresa"
                    items={companies.map((company) => ({ key: company, label: company }))}
                    hiddenKeys={hiddenCompanies}
                    onToggle={(key) =>
                      setHiddenCompanies((current) => toggleSetItem(current, key))
                    }
                  />
                  <FilterSection
                    icon={Package}
                    iconClass="bg-status-ativo/10 text-status-ativo"
                    title="Tamanho"
                    items={activeSizes.map((size) => ({ key: size, label: size }))}
                    hiddenKeys={hiddenSizes}
                    onToggle={(key) =>
                      setHiddenSizes((current) => toggleSetItem(current, key))
                    }
                  />
                </div>

                <div className="flex items-center justify-between border-t border-navy-100 px-4 py-2.5">
                  <span className="text-xs text-navy-400">
                    {activeFilterCount > 0
                      ? `${activeFilterCount} oculto${activeFilterCount > 1 ? "s" : ""}`
                      : "Exibindo tudo"}
                  </span>
                  <button
                    type="button"
                    onClick={clearFilters}
                    disabled={activeFilterCount === 0}
                    className="text-xs font-semibold text-status-lead hover:underline disabled:cursor-not-allowed disabled:text-navy-300 disabled:no-underline"
                  >
                    Limpar filtros
                  </button>
                </div>
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
