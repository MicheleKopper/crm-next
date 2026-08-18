import { Anchor } from "lucide-react";

import { DetailField } from "@/components/ui/detail-field";
import type { FlexitankDetail } from "@/server/modules/flexitanks/flexitank.mapper";

function formatDate(value: Date | string | null) {
  if (!value) return null;
  return new Date(value).toLocaleDateString("pt-BR");
}

export function PortsDatesCard({ flexitank }: { flexitank: FlexitankDetail }) {
  return (
    <section className="rounded-xl bg-white p-6 shadow-sm dark:bg-navy-900">
      <div className="mb-4 flex items-center gap-2 border-l-4 border-navy-900 pl-3 dark:border-navy-100">
        <Anchor size={16} className="text-navy-900 dark:text-navy-100" />
        <h2 className="text-base font-bold text-navy-900 dark:text-navy-100">Portos e datas</h2>
      </div>

      <div className="grid grid-cols-1 gap-x-8 gap-y-2.5 sm:grid-cols-3">
        <DetailField label="POL" value={flexitank.portLoadName} />
        <DetailField label="POD" value={flexitank.portDischargeName} />
        <DetailField label="ETD" value={formatDate(flexitank.etd)} />
        <DetailField label="ETA" value={formatDate(flexitank.eta)} />
        <DetailField label="ATD" value={formatDate(flexitank.atd)} />
        <DetailField label="ATA" value={formatDate(flexitank.ata)} />
      </div>
    </section>
  );
}
