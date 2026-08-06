import Link from "next/link";
import { notFound } from "next/navigation";

import { StatusBadge } from "@/components/ui/badge";
import { getSession } from "@/server/auth/session";
import { getCustomerByUid, listOwners } from "@/server/modules/customers/customer.service";
import { NotFoundError } from "@/server/shared/errors";

import { CommercialProfileForm } from "./commercial-profile-form";
import { CompanyInfoForm } from "./company-info-form";
import { DeleteCustomerButton } from "./delete-customer-button";

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
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-navy-500">
            <Link href="/clientes" className="hover:underline">
              Clientes
            </Link>{" "}
            &gt; {customer.displayName}
          </p>
          <div className="mt-1 flex items-center gap-3">
            <h1 className="text-2xl font-bold text-navy-900">
              {customer.displayName}
            </h1>
            <StatusBadge status={customer.status} />
          </div>
        </div>
        {canDelete && (
          <DeleteCustomerButton uid={customer.uid} displayName={customer.displayName} />
        )}
      </div>

      <section className="rounded-xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-base font-bold text-navy-900">
          Identificação e Localização
        </h2>
        <CompanyInfoForm customer={customer} owners={owners} canEdit={canEdit} />
      </section>

      <section className="rounded-xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-base font-bold text-navy-900">
          Perfil Comercial e Observações
        </h2>
        <CommercialProfileForm customer={customer} canEdit={canEdit} />
      </section>
    </div>
  );
}
