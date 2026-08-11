import { ChevronRight } from "lucide-react";
import Link from "next/link";

import { FlexitankSizeBadge, FlexitankStatusBadge } from "@/components/ui/badge";
import type { FlexitankListRow } from "@/server/modules/flexitanks/flexitank.repository";

function formatPrice(price: number) {
  return price.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function FlexitankRow({ flexitank }: { flexitank: FlexitankListRow }) {
  return (
    <div className="grid grid-cols-[auto_1fr_auto_auto_auto] items-center gap-4 rounded-lg border-b border-navy-100 py-4 px-2 -mx-2 last:border-b-0 hover:bg-navy-50">
      <FlexitankStatusBadge status={flexitank.status} />

      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-navy-900">
          {flexitank.serialNumber}
        </p>
        <p className="mt-0.5 truncate text-xs text-navy-500">
          {flexitank.poNumber ?? "—"} · {flexitank.locationName ?? "—"}
        </p>
      </div>

      <FlexitankSizeBadge size={flexitank.size} />

      <span className="hidden text-sm font-semibold text-navy-900 sm:inline">
        {formatPrice(flexitank.price)}
      </span>

      <Link
        href={`/flexitanks/${flexitank.uid}`}
        aria-label={`Ver detalhes de ${flexitank.serialNumber}`}
        className="rounded-full p-2 text-navy-700 hover:bg-navy-100"
      >
        <ChevronRight size={20} />
      </Link>
    </div>
  );
}
