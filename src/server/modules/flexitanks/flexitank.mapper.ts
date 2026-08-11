import type {
  Company,
  Container,
  Flexitank,
  Port,
  Product,
  PurchaseOrder,
  Shipment,
} from "@/generated/prisma/client";

export type FlexitankWithRelations = Flexitank & {
  location: Company | null;
  purchaseOrder: PurchaseOrder | null;
  shipment:
    | (Shipment & {
        customer: Company | null;
        shipper: Company | null;
        consignee: Company | null;
        shippingLine: Company | null;
        product: Product | null;
        portLoad: Port | null;
        portDischarge: Port | null;
      })
    | null;
  containers: Container[];
};

export function toFlexitankDetail(flexitank: FlexitankWithRelations) {
  const container = flexitank.containers[0] ?? null;
  const shipment = flexitank.shipment;

  return {
    uid: flexitank.id,
    serialNumber: flexitank.serialNumber,
    fhbStock: flexitank.fhbStock,
    size: flexitank.size,
    price: flexitank.price,
    status: flexitank.status,
    comment: flexitank.comment,
    createdAt: flexitank.createdAt,

    locationId: flexitank.locationId,
    locationName: flexitank.location?.displayName ?? null,

    poNumber: flexitank.purchaseOrder?.poNumber ?? null,
    tempAdmissionNumber: flexitank.purchaseOrder?.tempAdmissionNumber ?? null,
    tempAdmissionDate: flexitank.purchaseOrder?.tempAdmissionDate ?? null,
    clearenceDate: flexitank.purchaseOrder?.clearenceDate ?? null,

    booking: shipment?.booking ?? null,
    sslBookingNumber: shipment?.sslBookingNumber ?? null,
    customerName: shipment?.customer?.displayName ?? null,
    productName: shipment?.product?.productName ?? null,
    shipperName: shipment?.shipper?.displayName ?? null,
    shippingLineName: shipment?.shippingLine?.displayName ?? null,
    consigneeName: shipment?.consignee?.displayName ?? null,
    vessel: shipment?.vessel ?? null,
    voyage: shipment?.voyage ?? null,
    portLoadName: shipment?.portLoad?.portName ?? null,
    portDischargeName: shipment?.portDischarge?.portName ?? null,
    etd: shipment?.etd ?? null,
    atd: shipment?.atd ?? null,
    eta: shipment?.eta ?? null,
    ata: shipment?.ata ?? null,
    mblNumber: shipment?.mblNumber ?? null,
    hblNumber: shipment?.hblNumber ?? null,

    container: container?.containerNumber ?? null,
    tare: container?.tare ?? null,
    seal: container?.seal ?? null,
    fitting: container?.fitting ?? null,
    loading: container?.loading ?? null,
    netWeight: container?.netWeight ?? null,
  };
}

export type FlexitankDetail = ReturnType<typeof toFlexitankDetail>;
