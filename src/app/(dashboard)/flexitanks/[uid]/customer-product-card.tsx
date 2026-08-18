import { User } from "lucide-react";

import { DetailField } from "@/components/ui/detail-field";
import type { FlexitankDetail } from "@/server/modules/flexitanks/flexitank.mapper";

export function CustomerProductCard({
  flexitank,
}: {
  flexitank: FlexitankDetail;
}) {
  return (
    <section className="rounded-xl bg-white p-6 shadow-sm dark:bg-navy-900">
      <div className="mb-4 flex items-center gap-2 border-l-4 border-navy-900 pl-3 dark:border-navy-100">
        <User size={16} className="text-navy-900 dark:text-navy-100" />
        <h2 className="text-base font-bold text-navy-900 dark:text-navy-100">Cliente e produto</h2>
      </div>

      <div className="grid grid-cols-1 gap-x-8 gap-y-2.5 sm:grid-cols-3">
        <DetailField label="Cliente" value={flexitank.customerName} />
        <DetailField label="Produto" value={flexitank.productName} />
        <DetailField label="Lacre" value={flexitank.seal} copyable />
      </div>
    </section>
  );
}
