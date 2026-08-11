import { DetailField } from "@/components/ui/detail-field";
import type { LeadDetail } from "@/server/modules/leads/lead.mapper";

function formatDate(value: Date | string | null) {
  if (!value) return null;
  return new Date(value).toLocaleDateString("pt-BR");
}

export function LeadInfoView({ lead }: { lead: LeadDetail }) {
  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-2.5 sm:grid-cols-2">
      <DetailField label="Status" value={lead.status} />
      <DetailField label="Responsável" value={lead.operatorFullName} />
      <DetailField label="Razão social" value={lead.legalName} />
      <DetailField label="Origem" value={lead.source} />
      <DetailField label="Campanha" value={lead.campaign} />
      <DetailField label="Urgência" value={lead.urgency} />
      <DetailField label="Score" value={lead.score} />
      <DetailField label="Data de entrada" value={formatDate(lead.createdAt)} />
      <DetailField
        label="Última interação"
        value={formatDate(lead.lastInteractionAt)}
      />
      <DetailField label="Convertido em" value={formatDate(lead.convertedAt)} />
    </div>
  );
}
