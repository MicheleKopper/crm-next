import { z } from "zod";

export type DashboardWidgetSize = 1 | 2 | 3 | 4;

export type DashboardWidgetDefault = {
  order: number;
  size: DashboardWidgetSize;
};

/**
 * Registro único dos widgets do dashboard. Para adicionar um card novo no
 * futuro, basta acrescentar uma entrada aqui e montar o nó correspondente em
 * `page.tsx` — nada no sistema de personalização precisa mudar.
 */
export const DASHBOARD_WIDGET_DEFAULTS: Record<string, DashboardWidgetDefault> = {
  "kpi-bookings": { order: 0, size: 1 },
  "kpi-containers": { order: 1, size: 1 },
  "kpi-active-customers": { order: 2, size: 1 },
  "kpi-new-customers": { order: 3, size: 1 },
  "commercial-overview": { order: 4, size: 2 },
  "period-cards": { order: 5, size: 2 },
  "annual-shipments": { order: 6, size: 2 },
  "cargo-profile": { order: 7, size: 2 },
  "status-shipments": { order: 8, size: 2 },
  "flexitank-availability": { order: 9, size: 2 },
};

export const DASHBOARD_WIDGET_IDS = Object.keys(DASHBOARD_WIDGET_DEFAULTS);

export type DashboardLayoutItem = {
  id: string;
  order: number;
  size: DashboardWidgetSize;
  visible: boolean;
};

export const DEFAULT_DASHBOARD_LAYOUT: DashboardLayoutItem[] = DASHBOARD_WIDGET_IDS.map((id) => ({
  id,
  order: DASHBOARD_WIDGET_DEFAULTS[id].order,
  size: DASHBOARD_WIDGET_DEFAULTS[id].size,
  visible: true,
}));

const dashboardLayoutItemSchema = z.object({
  id: z.string(),
  order: z.number().int(),
  size: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]),
  visible: z.boolean(),
});

const dashboardLayoutItemsSchema = z.array(dashboardLayoutItemSchema);

export const dashboardLayoutInputSchema = z.object({
  items: dashboardLayoutItemsSchema,
});

export type DashboardLayoutInput = z.infer<typeof dashboardLayoutInputSchema>;

/**
 * Combina um layout salvo com o registro atual de widgets: ids salvos que já
 * não existem no registro são descartados; ids novos do registro que o
 * usuário nunca salvou entram com o valor padrão. Garante que adicionar um
 * widget novo não quebre layouts já salvos.
 */
export function mergeDashboardLayout(saved: unknown): DashboardLayoutItem[] {
  const parsed = dashboardLayoutItemsSchema.safeParse(saved);
  const savedItems = parsed.success ? parsed.data : [];
  const byId = new Map(savedItems.map((item) => [item.id, item]));

  return DASHBOARD_WIDGET_IDS.map((id, index) => {
    const existing = byId.get(id);
    if (existing) return existing;
    const fallback = DASHBOARD_WIDGET_DEFAULTS[id];
    return { id, order: fallback?.order ?? index, size: fallback?.size ?? 2, visible: true };
  }).sort((a, b) => a.order - b.order);
}
