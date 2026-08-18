import { ChevronRight } from "lucide-react";
import Link from "next/link";

import { FlexitankSizeBadge, FlexitankStatusBadge } from "@/components/ui/badge";
import { CopyButton } from "@/components/ui/copy-button";
import type { FlexitankListRow } from "@/server/modules/flexitanks/flexitank.repository";

function formatPrice(price: number) {
  return price.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function FlexitankRow({ flexitank }: { flexitank: FlexitankListRow }) {
  return (
    <div className="grid grid-cols-[auto_1fr_auto_auto_auto] items-center gap-4 rounded-lg border-b border-navy-100 py-4 px-2 -mx-2 last:border-b-0 hover:bg-navy-50 dark:border-navy-700 dark:hover:bg-navy-800">
      <FlexitankStatusBadge status={flexitank.status} />

      <div className="min-w-0">
        <div className="group flex items-center gap-1">
          <p className="truncate text-sm font-semibold text-navy-900 dark:text-navy-100">
            {flexitank.serialNumber}
          </p>
          <CopyButton value={flexitank.serialNumber} label="número de série" />
        </div>
        <div className="mt-0.5 flex items-center gap-1 truncate text-xs text-navy-500 dark:text-navy-100/70">
          {flexitank.poNumber ? (
            <span className="group flex min-w-0 items-center gap-1">
              <span className="truncate">{flexitank.poNumber}</span>
              <CopyButton value={flexitank.poNumber} label="PO" />
            </span>
          ) : (
            <span>—</span>
          )}
          <span className="shrink-0">· {flexitank.locationName ?? "—"}</span>
        </div>
      </div>

      <FlexitankSizeBadge size={flexitank.size} />

      <span className="hidden text-sm font-semibold text-navy-900 dark:text-navy-100 sm:inline">
        {formatPrice(flexitank.price)}
      </span>

      <Link
        href={`/flexitanks/${flexitank.uid}`}
        aria-label={`Ver detalhes de ${flexitank.serialNumber}`}
        className="rounded-full p-2 text-navy-700 hover:bg-navy-100 dark:text-navy-100 dark:hover:bg-navy-800"
      >
        <ChevronRight size={20} />
      </Link>
    </div>
  );
}
