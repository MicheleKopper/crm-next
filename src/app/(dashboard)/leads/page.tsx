import Link from "next/link";

import { ExportModal } from "@/components/list/export-modal";
import { SearchBar } from "@/components/list/search-bar";
import { SortMenu } from "@/components/list/sort-menu";
import { ViewModeProvider, ViewToggle } from "@/components/list/view-mode";
import { Pagination } from "@/components/ui/pagination";
import { getSession } from "@/server/auth/session";
import { LEAD_SORT_FIELDS, listLeadsQuerySchema } from "@/server/modules/leads/lead.dto";
import { getLeadList } from "@/server/modules/leads/lead.service";

import { CreateLeadDrawer } from "./_components/create-lead-drawer";
import { LeadFilterModal } from "./_components/lead-filter-modal";
import { LeadListBody } from "./_components/lead-list-body";

const SORT_OPTIONS = [
  { value: "contactName", label: "Lead" },
  { value: "createdAt", label: "Data de criação" },
  { value: "status", label: "Status" },
  { value: "operatorFullName", label: "Responsável" },
  { value: "urgency", label: "Urgência" },
] satisfies { value: (typeof LEAD_SORT_FIELDS)[number]; label: string }[];

export default async function LeadsPage({
  searchParams,
}: PageProps<"/leads">) {
  const rawParams = await searchParams;
  const query = listLeadsQuerySchema.parse(rawParams);

  const [{ items, totalCount, operators }, session] = await Promise.all([
    getLeadList(query),
    getSession(),
  ]);

  return (
    <ViewModeProvider storageKey="leads:view-mode">
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-navy-900 dark:text-navy-100">Leads</h1>
            <p className="text-sm text-navy-500 dark:text-navy-100/70">
              <Link href="/leads" className="hover:underline">
                Home
              </Link>{" "}
              &gt; Leads
            </p>
          </div>

          <div className="flex items-center gap-2">
            <SearchBar
              basePath="/leads"
              placeholder="Busque por lead ou empresa…"
              ariaLabel="Buscar leads"
            />
            <SortMenu
              basePath="/leads"
              options={SORT_OPTIONS}
              defaultSortBy="createdAt"
              ariaLabel="Ordenar leads"
            />
            <LeadFilterModal operators={operators} />
            <ExportModal
              exportUrl="/api/leads/export"
              filenamePrefix="leads"
              modalTitle="Exportar leads"
              triggerAriaLabel="Exportar leads"
              successMessage="Leads exportados com sucesso!"
              errorMessage="Erro ao exportar leads."
            />
            <ViewToggle />
            <CreateLeadDrawer operators={operators} currentUserId={session!.sub} />
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-navy-900">
          <LeadListBody items={items} />

          {items.length > 0 && !query.search && (
            <div className="mt-4">
              <Pagination
                basePath="/leads"
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
