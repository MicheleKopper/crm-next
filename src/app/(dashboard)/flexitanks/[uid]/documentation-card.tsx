import { FileText } from "lucide-react";

import { DetailField } from "@/components/ui/detail-field";
import type { FlexitankDetail } from "@/server/modules/flexitanks/flexitank.mapper";

function formatDate(value: Date | string | null) {
  if (!value) return null;
  return new Date(value).toLocaleDateString("pt-BR");
}

export function DocumentationCard({
  flexitank,
}: {
  flexitank: FlexitankDetail;
}) {
  return (
    <section className="rounded-xl bg-white p-6 shadow-sm dark:bg-navy-900">
      <div className="mb-4 flex items-center gap-2 border-l-4 border-navy-900 pl-3 dark:border-navy-100">
        <FileText size={16} className="text-navy-900 dark:text-navy-100" />
        <h2 className="text-base font-bold text-navy-900 dark:text-navy-100">
          Documentação e aduana
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-x-8 gap-y-2.5 sm:grid-cols-2">
        <DetailField
          label="Número Adm. Temp."
          value={flexitank.tempAdmissionNumber}
        />
        <DetailField
          label="Data Adm. Temp."
          value={formatDate(flexitank.tempAdmissionDate)}
        />
        <DetailField
          label="Despacho Adm. Temp."
          value={formatDate(flexitank.clearenceDate)}
        />
        <DetailField
          label="MBL | HBL"
          value={
            flexitank.mblNumber || flexitank.hblNumber
              ? `${flexitank.mblNumber ?? "—"} | ${flexitank.hblNumber ?? "—"}`
              : null
          }
        />
      </div>
    </section>
  );
}
