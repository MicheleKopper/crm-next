import Link from "next/link";

import { ExportModal } from "@/components/list/export-modal";
import { SearchBar } from "@/components/list/search-bar";
import { SortMenu } from "@/components/list/sort-menu";
import { ViewModeProvider, ViewToggle } from "@/components/list/view-mode";
import { Pagination } from "@/components/ui/pagination";
import { getSession } from "@/server/auth/session";
import {
  PO_SORT_FIELDS,
  listPurchaseOrdersQuerySchema,
} from "@/server/modules/purchase-orders/purchase-order.dto";
import { getPurchaseOrderList } from "@/server/modules/purchase-orders/purchase-order.service";

import { CreatePoDrawer } from "./_components/create-po-drawer";
import { FilterModal } from "./_components/filter-modal";
import { PurchaseOrderListBody } from "./_components/purchase-order-list-body";

const SORT_OPTIONS = [
  { value: "poNumber", label: "Nº da PO" },
  { value: "poDate", label: "Data da PO" },
  { value: "arrivalDate", label: "Chegada" },
  { value: "clearenceDate", label: "Liberação" },
  { value: "createdAt", label: "Data de criação" },
] satisfies { value: (typeof PO_SORT_FIELDS)[number]; label: string }[];

export default async function PurchaseOrdersPage({
  searchParams,
}: PageProps<"/purchase-orders">) {
  const rawParams = await searchParams;
  const query = listPurchaseOrdersQuerySchema.parse(rawParams);

  const [{ items, totalCount }, session] = await Promise.all([
    getPurchaseOrderList(query),
    getSession(),
  ]);

  const canCreate = Boolean(session?.permissions?.purchase_orders_create);

  return (
    <ViewModeProvider storageKey="purchase-orders:view-mode">
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-navy-900 dark:text-navy-100">
              Purchase Orders
            </h1>
            <p className="text-sm text-navy-500 dark:text-navy-100/70">
              <Link href="/purchase-orders" className="hover:underline">
                Home
              </Link>{" "}
              &gt; Purchase Orders
            </p>
          </div>

          <div className="flex items-center gap-2">
            <SearchBar
              basePath="/purchase-orders"
              placeholder="Busque por número, BL, proforma…"
              ariaLabel="Buscar purchase orders"
            />
            <SortMenu
              basePath="/purchase-orders"
              options={SORT_OPTIONS}
              defaultSortBy="createdAt"
              ariaLabel="Ordenar purchase orders"
            />
            <FilterModal />
            <ExportModal
              exportUrl="/api/purchase-orders/export"
              filenamePrefix="purchase-orders"
              modalTitle="Exportar purchase orders"
              triggerAriaLabel="Exportar purchase orders"
              successMessage="Purchase orders exportadas com sucesso!"
              errorMessage="Erro ao exportar purchase orders."
            />
            <ViewToggle />
            {canCreate && <CreatePoDrawer />}
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-navy-900">
          <PurchaseOrderListBody items={items} />

          {items.length > 0 && !query.search && (
            <div className="mt-4">
              <Pagination
                basePath="/purchase-orders"
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
