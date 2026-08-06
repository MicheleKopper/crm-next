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
