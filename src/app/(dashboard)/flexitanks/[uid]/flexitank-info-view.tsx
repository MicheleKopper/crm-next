import { DetailField } from "@/components/ui/detail-field";
import type { FlexitankDetail } from "@/server/modules/flexitanks/flexitank.mapper";

export function FlexitankInfoView({ flexitank }: { flexitank: FlexitankDetail }) {
  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-2.5 sm:grid-cols-2">
      <DetailField label="FHB stock ref" value={flexitank.fhbStock} />
      <DetailField label="Serial number" value={flexitank.serialNumber} copyable />
      <DetailField label="Purchase order" value={flexitank.poNumber} />
      <DetailField label="Booking" value={flexitank.booking} />
      <DetailField label="SSL booking" value={flexitank.sslBookingNumber} />
    </div>
  );
}
