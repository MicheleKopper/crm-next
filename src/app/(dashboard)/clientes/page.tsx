import Link from "next/link";

import { Pagination } from "@/components/ui/pagination";
import { getSession } from "@/server/auth/session";
import { listCustomersQuerySchema } from "@/server/modules/customers/customer.dto";
import { getCustomerList } from "@/server/modules/customers/customer.service";

import { CreateCustomerDrawer } from "./_components/create-customer-drawer";
import { CustomerListBody } from "./_components/customer-list-body";
import { ExportModal } from "./_components/export-modal";
import { FilterModal } from "./_components/filter-modal";
import { SearchBar } from "./_components/search-bar";
import { SortMenu } from "./_components/sort-menu";
import { ViewModeProvider } from "./_components/view-mode-context";
import { ViewToggle } from "./_components/view-toggle";

export default async function CustomersPage({
  searchParams,
}: PageProps<"/clientes">) {
  const rawParams = await searchParams;
  const query = listCustomersQuerySchema.parse(rawParams);

  const [{ items, totalCount, owners }, session] = await Promise.all([
    getCustomerList(query),
    getSession(),
  ]);

  return (
    <ViewModeProvider>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-navy-900">Clientes</h1>
            <p className="text-sm text-navy-500">
              <Link href="/clientes" className="hover:underline">
                Home
              </Link>{" "}
              &gt; Clientes
            </p>
          </div>

          <div className="flex items-center gap-2">
            <SearchBar />
            <SortMenu />
            <FilterModal owners={owners} />
            <ExportModal />
            <ViewToggle />
            <CreateCustomerDrawer owners={owners} currentUserId={session!.sub} />
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <CustomerListBody items={items} />

          {items.length > 0 && !query.search && (
            <div className="mt-4">
              <Pagination
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
