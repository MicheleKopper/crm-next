import { z } from "zod";

import { SHIPMENT_STATUS_COLORS } from "./dashboard.dto";

export type DashboardFilterFieldType = "text" | "number" | "date" | "select" | "boolean";

export type DashboardFilterField = {
  key: string;
  label: string;
  type: DashboardFilterFieldType;
  options?: { value: string; label: string }[];
};

export type DashboardFilterOperatorValueKind = "single" | "range" | "none";

export type DashboardFilterOperator = {
  value: string;
  label: string;
  valueKind: DashboardFilterOperatorValueKind;
};

const SHIPMENT_TYPE_OPTIONS = [
  "Flexitank - Full Service",
  "Flexitank - Supply & Fit",
  "Flexitank - Supply Only",
  "Isotank - Full Service",
  "Isotank - Rental Only",
  "General Cargo",
].map((value) => ({ value, label: value }));

/**
 * Registro único dos campos filtráveis. Para adicionar um campo novo basta
 * incluir uma entrada aqui e um `case` correspondente em
 * `dashboard-filter.repository.ts#buildDashboardFilterConditions` — o popover
 * (`GlobalFilterButton`) e o parsing da URL já funcionam de forma genérica.
 */
export const DASHBOARD_FILTER_FIELDS: DashboardFilterField[] = [
  {
    key: "status",
    label: "Status",
    type: "select",
    options: Object.keys(SHIPMENT_STATUS_COLORS).map((status) => ({
      value: status,
      label: status,
    })),
  },
  {
    key: "shipmentType",
    label: "Tipo de embarque",
    type: "select",
    options: SHIPMENT_TYPE_OPTIONS,
  },
  { key: "customer", label: "Cliente", type: "text" },
  { key: "vessel", label: "Navio", type: "text" },
  { key: "quantity", label: "Quantidade", type: "number" },
  { key: "date", label: "Data (ETD/ATD)", type: "date" },
];

export const DASHBOARD_FILTER_OPERATORS: Record<DashboardFilterFieldType, DashboardFilterOperator[]> = {
  text: [
    { value: "contains", label: "contém", valueKind: "single" },
    { value: "not_contains", label: "não contém", valueKind: "single" },
    { value: "equals", label: "é", valueKind: "single" },
  ],
  number: [
    { value: "eq", label: "=", valueKind: "single" },
    { value: "neq", label: "≠", valueKind: "single" },
    { value: "gt", label: ">", valueKind: "single" },
    { value: "gte", label: "≥", valueKind: "single" },
    { value: "lt", label: "<", valueKind: "single" },
    { value: "lte", label: "≤", valueKind: "single" },
  ],
  date: [
    { value: "on", label: "em", valueKind: "single" },
    { value: "before", label: "antes de", valueKind: "single" },
    { value: "after", label: "depois de", valueKind: "single" },
    { value: "between", label: "entre", valueKind: "range" },
  ],
  select: [
    { value: "is", label: "é", valueKind: "single" },
    { value: "is_not", label: "não é", valueKind: "single" },
  ],
  boolean: [{ value: "is", label: "é", valueKind: "single" }],
};

export function fieldByKey(key: string): DashboardFilterField | undefined {
  return DASHBOARD_FILTER_FIELDS.find((field) => field.key === key);
}

export function operatorsForField(field: DashboardFilterField): DashboardFilterOperator[] {
  return DASHBOARD_FILTER_OPERATORS[field.type];
}

const dashboardFilterConditionSchema = z.object({
  id: z.string(),
  field: z.string(),
  operator: z.string(),
  value: z.union([z.string(), z.number(), z.tuple([z.string(), z.string()])]),
});

export const dashboardFilterStateSchema = z.object({
  connector: z.enum(["AND", "OR"]),
  conditions: z.array(dashboardFilterConditionSchema),
});

export type DashboardFilterCondition = z.infer<typeof dashboardFilterConditionSchema>;
export type DashboardFilterState = z.infer<typeof dashboardFilterStateSchema>;

export const EMPTY_DASHBOARD_FILTER_STATE: DashboardFilterState = {
  connector: "AND",
  conditions: [],
};

/** Só considera condições completas (campo, operador e valor preenchidos). */
export function isConditionComplete(condition: DashboardFilterCondition): boolean {
  if (!condition.field || !condition.operator) return false;
  if (Array.isArray(condition.value)) return condition.value.every((v) => v !== "");
  return condition.value !== "" && condition.value !== undefined && condition.value !== null;
}

export function parseDashboardFilters(raw: string | string[] | undefined): DashboardFilterState {
  if (typeof raw !== "string" || !raw) return EMPTY_DASHBOARD_FILTER_STATE;
  try {
    const parsed = dashboardFilterStateSchema.safeParse(JSON.parse(raw));
    if (!parsed.success) return EMPTY_DASHBOARD_FILTER_STATE;
    return { ...parsed.data, conditions: parsed.data.conditions.filter(isConditionComplete) };
  } catch {
    return EMPTY_DASHBOARD_FILTER_STATE;
  }
}
