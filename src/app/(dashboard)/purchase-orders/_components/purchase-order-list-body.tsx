"use client";

import { useViewMode } from "@/components/list/view-mode";
import type { PurchaseOrderListRow } from "@/server/modules/purchase-orders/purchase-order.repository";

import { PurchaseOrderRow } from "./purchase-order-row";
import { PurchaseOrderTableView } from "./purchase-order-table-view";

export function PurchaseOrderListBody({ items }: { items: PurchaseOrderListRow[] }) {
  const { view } = useViewMode();

  if (items.length === 0) {
    return (
      <p className="py-12 text-center text-navy-500 dark:text-navy-100/70">
        Nenhuma purchase order cadastrada.
      </p>
    );
  }

  if (view === "list") {
    return <PurchaseOrderTableView items={items} />;
  }

  return (
    <div>
      {items.map((po) => (
        <PurchaseOrderRow key={po.uid} po={po} />
      ))}
    </div>
  );
}
