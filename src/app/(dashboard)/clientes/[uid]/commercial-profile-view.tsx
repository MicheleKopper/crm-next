import { DetailField, DetailTextBlock } from "@/components/ui/detail-field";
import type { CustomerDetail } from "@/server/modules/customers/customer.mapper";

export function CommercialProfileView({
  customer,
}: {
  customer: CustomerDetail;
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-x-8 gap-y-2.5 sm:grid-cols-2">
        <DetailField label="Origem" value={customer.source} />
        <DetailField label="Especifique a origem" value={customer.sourceSpecify} />
        <DetailField label="Status" value={customer.status} />
        <DetailField label="Segmento" value={customer.segment} />
        <DetailField label="Porte" value={customer.size} />
        <DetailField label="Potencial da conta" value={customer.accountPotential} />
        <DetailField label="Tipo de carga" value={customer.cargoType} />
        <DetailField label="Incoterms" value={customer.incoterms} />
        <DetailField label="Volume estimado" value={customer.estimatedVolume} />
        <DetailField label="Unidade" value={customer.volumeUnit} />
        <DetailField label="Moeda" value={customer.currency} />
      </div>

      <div className="space-y-2.5">
        <DetailTextBlock label="Rotas principais" value={customer.mainRoutes} />
        <DetailTextBlock
          label="Restrições operacionais"
          value={customer.restrictions}
        />
        <DetailTextBlock label="Observações" value={customer.notes} />
      </div>
    </div>
  );
}
