import { ChevronRight } from "lucide-react";

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
    createdAt: "27/07/2026",
  },
];

const STATUS_CLASSES: Record<string, string> = {
  Agendada: "bg-status-warning/10 text-status-warning",
  Concluída: "bg-status-ativo/10 text-status-ativo",
  Cancelada: "bg-status-perdido/10 text-status-perdido",
};

export function ActivitiesTab({ leadFullName }: { leadFullName: string }) {
  if (MOCK_ACTIVITIES.length === 0) {
    return (
      <p className="py-12 text-center text-navy-500">
        Nenhuma atividade cadastrada.
      </p>
    );
  }

  return (
    <div>
      {MOCK_ACTIVITIES.map((activity, index) => (
        <div
          key={index}
          className="grid grid-cols-[104px_2fr_1.5fr_1.5fr_auto] items-start gap-4 border-b border-navy-100 py-4 last:border-b-0"
        >
          <span
            className={cn(
              "inline-flex w-fit items-center rounded-full px-2.5 py-1 text-xs font-semibold",
              STATUS_CLASSES[activity.status] ?? "bg-navy-100 text-navy-500"
            )}
          >
            {activity.status}
          </span>

          <div className="min-w-0 space-y-1 text-sm">
            <p className="truncate">
              <span className="font-semibold text-navy-500">Assunto</span>{" "}
              <span className="font-semibold text-navy-900">
                {activity.subject}
              </span>
            </p>
            <p className="truncate">
              <span className="font-semibold text-navy-500">Lead</span>{" "}
              <span className="text-navy-800">{leadFullName}</span>
            </p>
          </div>

          <div className="grid min-w-0 grid-cols-[auto_1fr] gap-x-2 gap-y-1 text-sm">
            <span className="font-semibold text-navy-500">Tipo</span>
            <span className="text-navy-800">{activity.type}</span>
            <span className="font-semibold text-navy-500">Agendado para</span>
            <span className="text-navy-800">{activity.scheduledFor}</span>
          </div>

          <div className="grid min-w-0 grid-cols-[auto_1fr] gap-x-2 gap-y-1 text-sm">
            <span className="font-semibold text-navy-500">Responsável</span>
            <span className="text-navy-800">{activity.operatorFullName}</span>
            <span className="font-semibold text-navy-500">Criado em</span>
            <span className="text-navy-800">{activity.createdAt}</span>
          </div>

          <span className="rounded-full p-2 text-navy-300">
            <ChevronRight size={20} />
          </span>
        </div>
      ))}
    </div>
  );
}
