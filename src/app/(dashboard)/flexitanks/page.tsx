import Link from "next/link";

import { SearchBar } from "@/components/list/search-bar";
import { ViewModeProvider, ViewToggle } from "@/components/list/view-mode";
import { Pagination } from "@/components/ui/pagination";
import { listFlexitanksQuerySchema } from "@/server/modules/flexitanks/flexitank.dto";
import {
  getFlexitankCounter,
  getFlexitankList,
  listLocations,
} from "@/server/modules/flexitanks/flexitank.service";

import { FilterModal } from "./_components/filter-modal";
import { FlexitankExportMenu } from "./_components/flexitank-export-menu";
import { FlexitankListBody } from "./_components/flexitank-list-body";
import { SummarySection } from "./_components/summary-section";
import { TransferDrawer } from "./_components/transfer-drawer";

export default async function FlexitanksPage({
  searchParams,
}: PageProps<"/flexitanks">) {
  const rawParams = await searchParams;
  const query = listFlexitanksQuerySchema.parse(rawParams);
  const hasActiveFilters = Boolean(
    query.search ||
      query.status ||
      query.size ||
      query.locationId ||
      query.poNumber ||
      query.booking
  );

  const [{ items, totalCount }, counterRows, locations] = await Promise.all([
    getFlexitankList(query),
    hasActiveFilters ? Promise.resolve([]) : getFlexitankCounter(),
    listLocations(),
  ]);

  return (
    <ViewModeProvider storageKey="flexitanks:view-mode">
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-navy-900">Flexitanks</h1>
            <p className="text-sm text-navy-500">
              <Link href="/flexitanks" className="hover:underline">
                Home
              </Link>{" "}
              &gt; Flexitanks
            </p>
          </div>

          <div className="flex items-center gap-2">
            <SearchBar
              basePath="/flexitanks"
              placeholder="Busque pelo número de série…"
              ariaLabel="Buscar flexitanks"
            />
            <FilterModal locations={locations} />
            <FlexitankExportMenu />
            <ViewToggle />
            <TransferDrawer locations={locations} />
          </div>
        </div>

        {!hasActiveFilters && <SummarySection counterRows={counterRows} />}

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <FlexitankListBody items={items} />

          {items.length > 0 && !query.search && (
            <div className="mt-4">
              <Pagination
                basePath="/flexitanks"
                limit={query.limit}
                offset={query.offset}
                currentCount={items.length}
                totalCount={totalCount}
              />
            </div>
          )}
        </div>
      </div>
    </ViewModeProvider>
  );
}
