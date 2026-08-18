import { ChevronRight } from "lucide-react";
import Link from "next/link";

import { StatusBadge } from "@/components/ui/badge";
import type { CustomerListRow } from "@/server/modules/customers/customer.repository";

function MetaField({ label, value }: { label: string; value: string | null }) {
  return (
    <>
      <span className="font-semibold text-navy-500 dark:text-navy-100/70">{label}</span>
      <span className="truncate text-navy-800 dark:text-navy-100" title={value ?? undefined}>
        {value || "—"}
      </span>
    </>
  );
}

export function CustomerRow({ customer }: { customer: CustomerListRow }) {
  return (
    <div className="grid grid-cols-[104px_2fr_1.5fr_1.5fr_auto] items-start gap-4 rounded-lg border-b border-navy-100 py-4 px-2 -mx-2 last:border-b-0 hover:bg-navy-50 dark:border-navy-700 dark:hover:bg-navy-800">
      <StatusBadge status={customer.status} />

      <div className="min-w-0 space-y-1 text-sm">
        <p className="truncate font-semibold text-navy-900 dark:text-navy-100" title={customer.displayName}>
          {customer.displayName}
        </p>
        <p className="truncate text-navy-500 dark:text-navy-100/70" title={customer.legalName}>
          {customer.legalName}
        </p>
        <p className="truncate text-navy-400 dark:text-navy-100/40">{customer.taxId}</p>
      </div>

      <div className="grid min-w-0 grid-cols-[auto_1fr] gap-x-2 gap-y-1 text-sm">
        <MetaField label="Segmento" value={customer.segment} />
        <MetaField label="Porte" value={customer.size} />
        <MetaField label="Potencial" value={customer.accountPotential} />
      </div>

      <div className="grid min-w-0 grid-cols-[auto_1fr] gap-x-2 gap-y-1 text-sm">
        <MetaField label="Carga" value={customer.cargoType} />
        <MetaField label="País" value={customer.country} />
        <MetaField label="Responsável" value={customer.ownerFullName} />
      </div>

      <Link
        href={`/clientes/${customer.uid}`}
        aria-label={`Ver detalhes de ${customer.displayName}`}
        className="rounded-full p-2 text-navy-700 hover:bg-navy-100 dark:text-navy-100 dark:hover:bg-navy-800"
      >
        <ChevronRight size={20} />
      </Link>
    </div>
  );
}
