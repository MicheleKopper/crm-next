import { DetailField, DetailTextBlock } from "@/components/ui/detail-field";
import type { LeadDetail } from "@/server/modules/leads/lead.mapper";

export function QualificationView({ lead }: { lead: LeadDetail }) {
  const volume = lead.estimatedVolume
    ? `${lead.estimatedVolume} ${lead.volumeUnit}`
    : null;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-x-8 gap-y-2.5 sm:grid-cols-3">
        <DetailField label="Modal" value={lead.modal} />
        <DetailField label="Volume estimado" value={volume} />
        <DetailField label="Moeda" value={lead.currency} />
      </div>

      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
        <DetailTextBlock label="Desafio atual" value={lead.painIdentified} />
        <DetailTextBlock label="Interesse" value={lead.interest} />
        <DetailTextBlock
          label="Motivo de desqualificação"
          value={lead.disqualificationReason}
        />
      </div>
    </div>
  );
}
