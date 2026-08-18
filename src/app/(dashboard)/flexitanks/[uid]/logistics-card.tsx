import { Ship } from "lucide-react";

import { DetailField } from "@/components/ui/detail-field";
import type { FlexitankDetail } from "@/server/modules/flexitanks/flexitank.mapper";

export function LogisticsCard({ flexitank }: { flexitank: FlexitankDetail }) {
  return (
    <section className="rounded-xl bg-white p-6 shadow-sm dark:bg-navy-900">
      <div className="mb-4 flex items-center gap-2 border-l-4 border-navy-900 pl-3 dark:border-navy-100">
        <Ship size={16} className="text-navy-900 dark:text-navy-100" />
        <h2 className="text-base font-bold text-navy-900 dark:text-navy-100">Logística</h2>
      </div>

      <div className="grid grid-cols-1 gap-x-8 gap-y-2.5 sm:grid-cols-3">
        <DetailField label="Shipper" value={flexitank.shipperName} />
        <DetailField label="Armador" value={flexitank.shippingLineName} />
        <DetailField
          label="Navio | Viagem"
          value={
            flexitank.vessel || flexitank.voyage
              ? `${flexitank.vessel ?? "—"} | ${flexitank.voyage ?? "—"}`
              : null
          }
        />
        <DetailField label="Localização" value={flexitank.locationName} />
        <DetailField label="Consignee" value={flexitank.consigneeName} />
        <DetailField label="Fitting" value={flexitank.fitting} />
        <DetailField label="Loading" value={flexitank.loading} />
      </div>
    </section>
  );
}
