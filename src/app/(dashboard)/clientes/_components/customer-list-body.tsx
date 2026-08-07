"use client";

import type { CustomerListRow } from "@/server/modules/customers/customer.repository";

import { CustomerRow } from "./customer-row";
import { CustomerTableView } from "./customer-table-view";
import { useViewMode } from "./view-mode-context";

export function CustomerListBody({ items }: { items: CustomerListRow[] }) {
  const { view } = useViewMode();

  if (items.length === 0) {
    return (
      <p className="py-12 text-center text-navy-500">
        Nenhum cliente cadastrado.
      </p>
    );
  }

  if (view === "list") {
    return <CustomerTableView items={items} />;
  }

  return (
    <div>
      {items.map((customer) => (
        <CustomerRow key={customer.uid} customer={customer} />
      ))}
    </div>
  );
}
