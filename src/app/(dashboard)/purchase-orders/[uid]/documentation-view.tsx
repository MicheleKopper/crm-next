import { DetailField } from "@/components/ui/detail-field";
import type { PurchaseOrderDetail } from "@/server/modules/purchase-orders/purchase-order.mapper";

function formatDate(value: Date | string | null) {
  return value ? new Date(value).toLocaleDateString("pt-BR", { timeZone: "UTC" }) : null;
}

export function DocumentationView({ po }: { po: PurchaseOrderDetail }) {
  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-2.5 sm:grid-cols-2">
      <DetailField label="Proforma (nº)" value={po.proformaNumber} copyable />
      <DetailField label="Proforma (data)" value={formatDate(po.proformaDate)} />
      <DetailField label="Packing List (nº)" value={po.packingListNumber} copyable />
      <DetailField label="Packing List (data)" value={formatDate(po.packingListDate)} />
      <DetailField label="BL (nº)" value={po.blNumber} copyable />
      <DetailField label="BL (data)" value={formatDate(po.blDate)} />
    </div>
  );
}
