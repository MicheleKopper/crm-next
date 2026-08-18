"use client";

import { useViewMode } from "@/components/list/view-mode";
import type { FlexitankListRow } from "@/server/modules/flexitanks/flexitank.repository";

import { FlexitankRow } from "./flexitank-row";
import { FlexitankTableView } from "./flexitank-table-view";

export function FlexitankListBody({ items }: { items: FlexitankListRow[] }) {
  const { view } = useViewMode();

  if (items.length === 0) {
    return (
      <p className="py-12 text-center text-navy-500 dark:text-navy-100/70">
        Nenhum flexitank localizado.
      </p>
    );
  }

  if (view === "list") {
    return <FlexitankTableView items={items} />;
  }

  return (
    <div>
      {items.map((flexitank) => (
        <FlexitankRow key={flexitank.uid} flexitank={flexitank} />
      ))}
    </div>
  );
}
