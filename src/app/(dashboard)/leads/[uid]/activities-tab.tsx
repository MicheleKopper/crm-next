import { Calendar, ChevronRight, User } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Placeholder data only — Activities has no backend yet in this iteration.
 * Layout is ready to swap for a real `listActivities`-style call once that
 * API exists.
 */
const MOCK_ACTIVITIES = [
  {
    status: "Agendada",
    subject: "Follow-up sobre proposta comercial",
    type: "E-mail",
    scheduledFor: "22/07/2026",
    operatorFullName: "Michele Kopper",
  },
];

const STATUS_CLASSES: Record<string, string> = {
  Agendada: "bg-status-warning/10 text-status-warning",
  Concluída: "bg-status-ativo/10 text-status-ativo",
  Cancelada: "bg-status-perdido/10 text-status-perdido",
};

export function ActivitiesTab() {
  if (MOCK_ACTIVITIES.length === 0) {
    return (
      <p className="py-12 text-center text-navy-500">
        Nenhuma atividade cadastrada.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-navy-100">
      {MOCK_ACTIVITIES.map((activity, index) => (
        <li
          key={index}
          className="grid grid-cols-[auto_1fr_auto_auto_auto] items-center gap-4 py-4 first:pt-0 last:pb-0"
        >
          <span
            className={cn(
              "inline-flex w-fit items-center rounded-full px-2.5 py-1 text-xs font-semibold",
              STATUS_CLASSES[activity.status] ?? "bg-navy-100 text-navy-500"
            )}
          >
            {activity.status}
          </span>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-navy-900">
              {activity.subject}
            </p>
            <p className="mt-0.5 truncate text-xs text-navy-500">
              {activity.type}
            </p>
          </div>

          <p className="hidden items-center gap-1.5 truncate text-sm text-navy-700 sm:flex">
            <Calendar size={14} className="shrink-0 text-navy-400" />
            {activity.scheduledFor}
          </p>

          <p className="hidden items-center gap-1.5 truncate text-sm text-navy-700 sm:flex">
            <User size={14} className="shrink-0 text-navy-400" />
            {activity.operatorFullName}
          </p>

          <button
            type="button"
            aria-label={`Ver detalhes de ${activity.subject}`}
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
