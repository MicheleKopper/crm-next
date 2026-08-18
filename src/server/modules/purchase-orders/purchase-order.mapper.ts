import type { Accessory, Flexitank, ProductPo, PurchaseOrder } from "@/generated/prisma/client";
import { ACCESSORY_TYPE_LABELS, type ACCESSORY_TYPES } from "./purchase-order.dto";

export type PurchaseOrderWithRelations = PurchaseOrder & {
  products: ProductPo[];
  flexitanks: Flexitank[];
  accessories: Accessory[];
};

export function toPurchaseOrderDetail(po: PurchaseOrderWithRelations) {
  return {
    uid: po.id,
    poNumber: po.poNumber,
    status: po.clearenceDate ? ("Completed" as const) : ("Expected" as const),
    poDate: po.poDate,
    tempAdmissionNumber: po.tempAdmissionNumber,
    tempAdmissionDate: po.tempAdmissionDate,
    arrivalDate: po.arrivalDate,
    clearenceDate: po.clearenceDate,
    observations: po.observations,
    proformaNumber: po.proformaNumber,
    proformaDate: po.proformaDate,
    packingListNumber: po.packingListNumber,
    packingListDate: po.packingListDate,
    blNumber: po.blNumber,
    blDate: po.blDate,
    createdAt: po.createdAt,

    products: po.products.map((product) => ({
      uid: product.id,
      description: product.description,
      quantity: product.quantity,
      price: product.price,
      size: product.size,
      comments: product.comments,
      isFlexitank: product.isFlexitank,
    })),

    flexitanks: po.flexitanks.map((flexitank) => ({
      uid: flexitank.id,
      serialNumber: flexitank.serialNumber,
      fhbStock: flexitank.fhbStock,
      size: flexitank.size,
      price: flexitank.price,
      status: flexitank.status,
      comment: flexitank.comment,
    })),

    accessories: po.accessories.map((accessory) => ({
      uid: accessory.id,
      type: accessory.type,
      typeLabel:
        ACCESSORY_TYPE_LABELS[accessory.type as (typeof ACCESSORY_TYPES)[number]] ??
        accessory.type,
      code: accessory.code,
      quantityKit: accessory.quantityKit,
      status: accessory.status,
    })),
  };
}

export type PurchaseOrderDetail = ReturnType<typeof toPurchaseOrderDetail>;
