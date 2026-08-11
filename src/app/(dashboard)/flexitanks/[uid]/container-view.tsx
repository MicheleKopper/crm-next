import { DetailField } from "@/components/ui/detail-field";
import type { FlexitankDetail } from "@/server/modules/flexitanks/flexitank.mapper";

function formatPrice(price: number) {
  return price.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function ContainerView({ flexitank }: { flexitank: FlexitankDetail }) {
  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-2.5 sm:grid-cols-3">
      <DetailField label="Container" value={flexitank.container} copyable />
      <DetailField label="Tara" value={flexitank.tare} />
      <DetailField label="Tamanho" value={flexitank.size} />
      <DetailField label="Peso" value={flexitank.netWeight} />
      <DetailField label="Preço" value={formatPrice(flexitank.price)} />
    </div>
  );
}
