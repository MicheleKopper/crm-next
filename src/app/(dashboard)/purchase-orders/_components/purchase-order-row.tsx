import { ChevronRight } from "lucide-react";
import Link from "next/link";

import { PurchaseOrderStatusBadge } from "@/components/ui/badge";
import type { PurchaseOrderListRow } from "@/server/modules/purchase-orders/purchase-order.repository";

function formatDate(value: Date | null) {
  return value ? new Date(value).toLocaleDateString("pt-BR", { timeZone: "UTC" }) : "—";
}

function MetaField({ label, value }: { label: string; value: string }) {
  return (
    <>
      <span className="font-semibold text-navy-500 dark:text-navy-100/70">{label}</span>
      <span className="truncate text-navy-800 dark:text-navy-100">{value}</span>
    </>
  );
}

export function PurchaseOrderRow({ po }: { po: PurchaseOrderListRow }) {
  const status = po.clearenceDate ? "Completed" : "Expected";

  return (
    <div className="grid grid-cols-[110px_1.5fr_1.5fr_auto] items-start gap-4 rounded-lg border-b border-navy-100 py-4 px-2 -mx-2 last:border-b-0 hover:bg-navy-50 dark:border-navy-700 dark:hover:bg-navy-800">
      <PurchaseOrderStatusBadge status={status} />

      <div className="min-w-0 space-y-1 text-sm">
        <p className="truncate font-semibold text-navy-900 dark:text-navy-100">
          {po.poNumber ?? "—"}
        </p>
        <p className="truncate text-navy-500 dark:text-navy-100/70">
          {po.flexitankCount} flexitank(s)
        </p>
      </div>

      <div className="grid min-w-0 grid-cols-[auto_1fr] gap-x-2 gap-y-1 text-sm">
        <MetaField label="Data da PO" value={formatDate(po.poDate)} />
        <MetaField label="Chegada" value={formatDate(po.arrivalDate)} />
        <MetaField label="Liberação" value={formatDate(po.clearenceDate)} />
      </div>

      <Link
        href={`/purchase-orders/${po.uid}`}
        aria-label={`Ver detalhes da PO ${po.poNumber}`}
        className="rounded-full p-2 text-navy-700 hover:bg-navy-100 dark:text-navy-100 dark:hover:bg-navy-800"
      >
        <ChevronRight size={20} />
      </Link>
    </div>
  );
}
