import { DetailField, DetailTextBlock } from "@/components/ui/detail-field";
import type { PurchaseOrderDetail } from "@/server/modules/purchase-orders/purchase-order.mapper";

function formatDate(value: Date | string | null) {
  return value ? new Date(value).toLocaleDateString("pt-BR", { timeZone: "UTC" }) : null;
}

export function GeneralInfoView({ po }: { po: PurchaseOrderDetail }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-x-8 gap-y-2.5 sm:grid-cols-2">
        <DetailField label="Data da PO" value={formatDate(po.poDate)} />
        <DetailField label="Data de chegada" value={formatDate(po.arrivalDate)} />
        <DetailField
          label="Admissão temporária (nº)"
          value={po.tempAdmissionNumber}
          copyable
        />
        <DetailField
          label="Admissão temporária (data)"
          value={formatDate(po.tempAdmissionDate)}
        />
        <DetailField label="Data de liberação" value={formatDate(po.clearenceDate)} />
      </div>
      <DetailTextBlock label="Observações" value={po.observations} />
    </div>
  );
}
