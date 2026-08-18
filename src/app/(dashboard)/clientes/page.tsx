import Link from "next/link";

import { ExportModal } from "@/components/list/export-modal";
import { SearchBar } from "@/components/list/search-bar";
import { SortMenu } from "@/components/list/sort-menu";
import { ViewModeProvider, ViewToggle } from "@/components/list/view-mode";
import { Pagination } from "@/components/ui/pagination";
import { getSession } from "@/server/auth/session";
import {
  CUSTOMER_SORT_FIELDS,
  listCustomersQuerySchema,
} from "@/server/modules/customers/customer.dto";
import { getCustomerList } from "@/server/modules/customers/customer.service";

import { CreateCustomerDrawer } from "./_components/create-customer-drawer";
import { CustomerListBody } from "./_components/customer-list-body";
import { FilterModal } from "./_components/filter-modal";

const SORT_OPTIONS = [
  { value: "displayName", label: "Nome" },
  { value: "createdAt", label: "Data de criação" },
  { value: "status", label: "Status" },
  { value: "ownerFullName", label: "Responsável" },
  { value: "country", label: "País" },
] satisfies { value: (typeof CUSTOMER_SORT_FIELDS)[number]; label: string }[];

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
    <ViewModeProvider storageKey="clientes:view-mode">
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-navy-900 dark:text-navy-100">Clientes</h1>
            <p className="text-sm text-navy-500 dark:text-navy-100/70">
              <Link href="/clientes" className="hover:underline">
                Home
              </Link>{" "}
              &gt; Clientes
            </p>
          </div>

          <div className="flex items-center gap-2">
            <SearchBar
              basePath="/clientes"
              placeholder="Busque por nome ou país…"
              ariaLabel="Buscar clientes"
            />
            <SortMenu
              basePath="/clientes"
              options={SORT_OPTIONS}
              defaultSortBy="displayName"
              ariaLabel="Ordenar clientes"
            />
            <FilterModal owners={owners} />
            <ExportModal
              exportUrl="/api/customers/export"
              filenamePrefix="clientes"
              modalTitle="Exportar clientes"
              triggerAriaLabel="Exportar clientes"
              successMessage="Clientes exportados com sucesso!"
              errorMessage="Erro ao exportar clientes."
            />
            <ViewToggle />
            <CreateCustomerDrawer owners={owners} currentUserId={session!.sub} />
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-navy-900">
          <CustomerListBody items={items} />

          {items.length > 0 && !query.search && (
            <div className="mt-4">
              <Pagination
                basePath="/clientes"
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
