"use client";

import { Filter, Plus, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { SegmentedControl } from "@/components/dashboard/dashboard-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  DASHBOARD_FILTER_FIELDS,
  DASHBOARD_FILTER_OPERATORS,
  fieldByKey,
  isConditionComplete,
  parseDashboardFilters,
  type DashboardFilterCondition,
  type DashboardFilterField,
  type DashboardFilterOperator,
  type DashboardFilterState,
} from "@/server/modules/dashboard/dashboard-filter.dto";

type DraftCondition = DashboardFilterCondition;

function newCondition(field: DashboardFilterField): DraftCondition {
  return {
    id: crypto.randomUUID(),
    field: field.key,
    operator: DASHBOARD_FILTER_OPERATORS[field.type][0].value,
    value: "",
  };
}

function ConditionValueInput({
  field,
  operator,
  condition,
  onChange,
}: {
  field: DashboardFilterField;
  operator: DashboardFilterOperator;
  condition: DraftCondition;
  onChange: (value: DraftCondition["value"]) => void;
}) {
  if (operator.valueKind === "range") {
    const [from, to] = Array.isArray(condition.value) ? condition.value : ["", ""];
    return (
      <div className="flex items-center gap-1">
        <Input type="date" value={from} onChange={(e) => onChange([e.target.value, to])} />
        <Input type="date" value={to} onChange={(e) => onChange([from, e.target.value])} />
      </div>
    );
  }

  if (field.type === "select" || field.type === "boolean") {
    const options =
      field.type === "boolean"
        ? [
            { value: "true", label: "Sim" },
            { value: "false", label: "Não" },
          ]
        : (field.options ?? []);
    return (
      <Select value={String(condition.value)} onChange={(e) => onChange(e.target.value)}>
        <option value="" disabled>
          Selecione…
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    );
  }

  if (field.type === "date") {
    return (
      <Input type="date" value={String(condition.value)} onChange={(e) => onChange(e.target.value)} />
    );
  }

  if (field.type === "number") {
    return (
      <Input
        type="number"
        value={condition.value === "" ? "" : String(condition.value)}
        onChange={(e) => onChange(e.target.value === "" ? "" : Number(e.target.value))}
      />
    );
  }

  return (
    <Input
      type="text"
      placeholder="Valor"
      value={String(condition.value)}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

/**
 * Estado de edição vive aqui, não em GlobalFilterButton: como este painel só
 * é montado enquanto o popover está aberto, cada abertura recomeça o rascunho
 * a partir do filtro aplicado na URL sem precisar de um efeito de resync.
 */
function FilterPanel({
  appliedState,
  onApply,
  onClose,
}: {
  appliedState: DashboardFilterState;
  onApply: (state: DashboardFilterState) => void;
  onClose: () => void;
}) {
  const [connector, setConnector] = useState<DashboardFilterState["connector"]>(
    appliedState.connector
  );
  const [conditions, setConditions] = useState<DraftCondition[]>(appliedState.conditions);

  function addCondition() {
    setConditions((prev) => [...prev, newCondition(DASHBOARD_FILTER_FIELDS[0])]);
  }

  function updateCondition(id: string, patch: Partial<DraftCondition>) {
    setConditions((prev) =>
      prev.map((condition) => (condition.id === id ? { ...condition, ...patch } : condition))
    );
  }

  function changeField(id: string, fieldKey: string) {
    const field = fieldByKey(fieldKey);
    if (!field) return;
    updateCondition(id, {
      field: fieldKey,
      operator: DASHBOARD_FILTER_OPERATORS[field.type][0].value,
      value: "",
    });
  }

  function changeOperator(id: string, field: DashboardFilterField, operatorValue: string) {
    const operator =
      DASHBOARD_FILTER_OPERATORS[field.type].find((o) => o.value === operatorValue) ??
      DASHBOARD_FILTER_OPERATORS[field.type][0];
    updateCondition(id, {
      operator: operator.value,
      value: operator.valueKind === "range" ? ["", ""] : "",
    });
  }

  function removeCondition(id: string) {
    setConditions((prev) => prev.filter((condition) => condition.id !== id));
  }

  function clearAll() {
    setConnector("AND");
    setConditions([]);
  }

  return (
    <div className="absolute right-0 top-[calc(100%+8px)] z-40 w-[min(92vw,600px)] rounded-xl border border-navy-100 bg-white p-4 shadow-xl dark:border-navy-700 dark:bg-navy-900">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-semibold text-navy-900 dark:text-navy-100">Filtro inteligente</p>
        {conditions.length > 0 && (
          <button
            type="button"
            onClick={clearAll}
            className="text-xs font-semibold text-navy-500 hover:text-navy-900 dark:text-navy-100/70 dark:hover:text-navy-100"
          >
            Limpar filtros
          </button>
        )}
      </div>

      {conditions.length === 0 ? (
        <p className="rounded-lg bg-navy-100/40 px-3 py-3 text-[13px] text-navy-500 dark:bg-navy-800/40 dark:text-navy-100/70">
          Nenhuma condição adicionada.
        </p>
      ) : (
        <div className="flex flex-col gap-2.5">
          {conditions.map((condition, index) => {
            const field = fieldByKey(condition.field) ?? DASHBOARD_FILTER_FIELDS[0];
            const operators = DASHBOARD_FILTER_OPERATORS[field.type];
            const operator = operators.find((o) => o.value === condition.operator) ?? operators[0];

            return (
              <div key={condition.id} className="flex items-start gap-2">
                <div className="w-14 pt-2.5 text-right text-xs font-semibold uppercase tracking-wide text-navy-500/70 dark:text-navy-100/50">
                  {index === 0 ? "Onde" : connector === "OR" ? "ou" : "e"}
                </div>

                <div className="grid flex-1 grid-cols-3 gap-2">
                  <Select value={condition.field} onChange={(e) => changeField(condition.id, e.target.value)}>
                    {DASHBOARD_FILTER_FIELDS.map((f) => (
                      <option key={f.key} value={f.key}>
                        {f.label}
                      </option>
                    ))}
                  </Select>

                  <Select
                    value={condition.operator}
                    onChange={(e) => changeOperator(condition.id, field, e.target.value)}
                  >
                    {operators.map((op) => (
                      <option key={op.value} value={op.value}>
                        {op.label}
                      </option>
                    ))}
                  </Select>

                  <ConditionValueInput
                    field={field}
                    operator={operator}
                    condition={condition}
                    onChange={(value) => updateCondition(condition.id, { value })}
                  />
                </div>

                <button
                  type="button"
                  onClick={() => removeCondition(condition.id)}
                  aria-label="Remover condição"
                  className="mt-1.5 rounded p-1 text-navy-500 hover:bg-navy-100 hover:text-navy-900 dark:text-navy-100/60 dark:hover:bg-navy-800 dark:hover:text-navy-100"
                >
                  <X size={14} />
                </button>
              </div>
            );
          })}

          {conditions.length > 1 && (
            <div className="ml-14 mt-1">
              <SegmentedControl
                value={connector}
                onChange={setConnector}
                options={[
                  { value: "AND", label: "E" },
                  { value: "OR", label: "OU" },
                ]}
              />
            </div>
          )}
        </div>
      )}

      <button
        type="button"
        onClick={addCondition}
        className="mt-3 flex items-center gap-1.5 text-[13px] font-semibold text-status-lead hover:underline"
      >
        <Plus size={14} /> Adicionar filtro
      </button>

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-navy-100 pt-3 dark:border-navy-700">
        <p className="text-[11.5px] text-navy-500/80 dark:text-navy-100/50">
          Novos clientes e disponibilidade de flexitank não são afetados pelo filtro.
        </p>
        <div className="flex shrink-0 gap-2">
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={() => onApply({ connector, conditions })}>Aplicar</Button>
        </div>
      </div>
    </div>
  );
}

export function GlobalFilterButton() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const appliedState = parseDashboardFilters(searchParams.get("filters") ?? undefined);

  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const activeCount = appliedState.conditions.length;

  function applyFilters(state: DashboardFilterState) {
    const params = new URLSearchParams(searchParams.toString());
    const valid = state.conditions.filter(isConditionComplete);
    if (valid.length > 0) {
      params.set("filters", JSON.stringify({ connector: state.connector, conditions: valid }));
    } else {
      params.delete("filters");
    }
    router.push(`/dashboard?${params.toString()}`);
    setOpen(false);
  }

  return (
    <div className="relative" ref={containerRef}>
      <Button
        type="button"
        variant="secondary"
        onClick={() => setOpen((v) => !v)}
        aria-label="Filtros"
        title="Filtros"
        className="h-10 w-10 p-0"
      >
        <Filter size={16} />
      </Button>
      {activeCount > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-navy-900 px-1 text-[11px] font-semibold text-white">
          {activeCount}
        </span>
      )}

      {open && (
        <FilterPanel appliedState={appliedState} onApply={applyFilters} onClose={() => setOpen(false)} />
      )}
    </div>
  );
}
