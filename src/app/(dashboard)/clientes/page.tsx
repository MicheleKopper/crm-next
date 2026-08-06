import Link from "next/link";

import { Pagination } from "@/components/ui/pagination";
import { getSession } from "@/server/auth/session";
import { listCustomersQuerySchema } from "@/server/modules/customers/customer.dto";
import { getCustomerList } from "@/server/modules/customers/customer.service";

import { CreateCustomerDrawer } from "./_components/create-customer-drawer";
import { CustomerRow } from "./_components/customer-row";
import { ExportModal } from "./_components/export-modal";
import { FilterModal } from "./_components/filter-modal";
import { SearchBar } from "./_components/search-bar";

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
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Clientes</h1>
          <p className="text-sm text-navy-500">
            <Link href="/clientes" className="hover:underline">
              Home
            </Link>{" "}
            &gt; Clientes
          </p>
        </div>
        <CreateCustomerDrawer owners={owners} currentUserId={session!.sub} />
      </div>

      <div className="rounded-xl bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-base font-bold text-navy-900">
            Todas informações
          </h2>
          <div className="flex flex-1 items-center justify-end gap-2">
            <div className="w-full max-w-md">
              <SearchBar />
            </div>
            <FilterModal owners={owners} />
            <ExportModal />
          </div>
        </div>

        <div className="mt-4">
          {items.length === 0 ? (
            <p className="py-12 text-center text-navy-500">
              Nenhum cliente cadastrado.
            </p>
          ) : (
            items.map((customer) => (
              <CustomerRow key={customer.uid} customer={customer} />
            ))
          )}
        </div>

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
  );
}
