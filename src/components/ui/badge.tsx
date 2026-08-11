import { cn } from "@/lib/utils";

const STATUS_CLASSES: Record<string, string> = {
  Lead: "bg-status-lead/10 text-status-lead",
  Prospecto: "bg-status-prospecto/10 text-status-prospecto",
  Ativo: "bg-status-ativo/10 text-status-ativo",
  Inativo: "bg-status-inativo/10 text-status-inativo",
  Perdido: "bg-status-perdido/10 text-status-perdido",
  Incompleto: "bg-status-incompleto/15 text-navy-500",
};

export function StatusBadge({ status }: { status: string | null }) {
  const label = status ?? "Incompleto";
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center rounded-full px-2.5 py-1 text-xs font-semibold",
        STATUS_CLASSES[label] ?? STATUS_CLASSES.Incompleto
      )}
    >
      {label}
    </span>
  );
}

const LEAD_STATUS_CLASSES: Record<string, string> = {
  Novo: "bg-status-lead/10 text-status-lead",
  Contato: "bg-status-warning/10 text-status-warning",
  Negociação: "bg-status-orange/10 text-status-orange",
  Convertido: "bg-status-ativo/10 text-status-ativo",
  Perdido: "bg-status-perdido/10 text-status-perdido",
};

export function LeadStatusBadge({ status }: { status: string | null }) {
  const label = status ?? "Novo";
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center rounded-full px-2.5 py-1 text-xs font-semibold",
        LEAD_STATUS_CLASSES[label] ?? LEAD_STATUS_CLASSES.Novo
      )}
    >
      {label}
    </span>
  );
}

const URGENCY_CLASSES: Record<string, string> = {
  Baixo: "bg-status-ativo/10 text-status-ativo",
  Médio: "bg-status-warning/10 text-status-warning",
  Alto: "bg-status-orange/10 text-status-orange",
  Crítico: "bg-status-perdido/10 text-status-perdido",
};

export function UrgencyBadge({ urgency }: { urgency: string | null }) {
  if (!urgency) return null;
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center rounded-full px-2.5 py-1 text-xs font-semibold",
        URGENCY_CLASSES[urgency] ?? "bg-navy-100 text-navy-500"
      )}
    >
      {urgency}
    </span>
  );
}

export function ScoreBadge({ score }: { score: number | null }) {
  if (score === null) return null;
  return (
    <span className="inline-flex w-fit items-center rounded-full bg-status-perdido/10 px-2.5 py-1 text-xs font-semibold text-status-perdido">
      Score {score}
    </span>
  );
}
