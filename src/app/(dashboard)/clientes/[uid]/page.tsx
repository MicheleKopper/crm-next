import Link from "next/link";
import { notFound } from "next/navigation";

import { getSession } from "@/server/auth/session";
import { getCustomerByUid, listOwners } from "@/server/modules/customers/customer.service";
import { NotFoundError } from "@/server/shared/errors";

import { CommercialProfileSection } from "./commercial-profile-section";
import { CompanyInfoSection } from "./company-info-section";
import { DeleteCustomerTrigger } from "./delete-customer-trigger";
import { StatusPicker } from "./status-picker";

function getInitials(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean);
  const initials = words.slice(0, 2).map((word) => word[0]);
  return initials.join("").toUpperCase();
}

export default async function CustomerDetailPage({
  params,
}: PageProps<"/clientes/[uid]">) {
  const { uid } = await params;

  const [customer, owners, session] = await Promise.all([
    getCustomerByUid(uid).catch((error) => {
      if (error instanceof NotFoundError) return null;
      throw error;
    }),
    listOwners(),
    getSession(),
  ]);

  if (!customer || !session) {
    notFound();
  }

  const canEdit = Boolean(session.permissions?.customers_edit);
  const canDelete = Boolean(session.permissions?.customers_delete);

  return (
    <div className="space-y-6">
      <p className="text-sm text-navy-500">
        <Link href="/clientes" className="hover:underline">
          Clientes
        </Link>{" "}
        &gt; {customer.displayName}
      </p>

      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-navy-900 text-lg font-bold text-white">
            {getInitials(customer.displayName)}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-navy-900">
              {customer.displayName}
            </h1>
            <div className="mt-1">
              <StatusPicker
                uid={customer.uid}
                status={customer.status}
                canEdit={canEdit}
              />
            </div>
          </div>
        </div>

        {canDelete && (
          <DeleteCustomerTrigger
            uid={customer.uid}
            displayName={customer.displayName}
          />
        )}
      </div>

      <CompanyInfoSection customer={customer} owners={owners} canEdit={canEdit} />

      <CommercialProfileSection customer={customer} canEdit={canEdit} />

      <Link
        href="/clientes"
        className="inline-block text-sm font-medium text-navy-500 hover:text-navy-900 hover:underline"
      >
        ← Voltar para a lista
      </Link>
    </div>
  );
}
