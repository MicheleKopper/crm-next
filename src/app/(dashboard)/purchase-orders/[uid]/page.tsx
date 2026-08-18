import { FileText } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PurchaseOrderStatusBadge } from "@/components/ui/badge";
import { getSession } from "@/server/auth/session";
import { getPurchaseOrderByUid } from "@/server/modules/purchase-orders/purchase-order.service";
import { NotFoundError } from "@/server/shared/errors";

import { AccessoriesSection } from "./accessories-section";
import { DeletePoTrigger } from "./delete-po-trigger";
import { DocumentationSection } from "./documentation-section";
import { FlexitanksSection } from "./flexitanks-section";
import { GeneralInfoSection } from "./general-info-section";
import { ProductsSection } from "./products-section";

export default async function PurchaseOrderDetailPage({
  params,
}: PageProps<"/purchase-orders/[uid]">) {
  const { uid } = await params;

  const [po, session] = await Promise.all([
    getPurchaseOrderByUid(uid).catch((error) => {
      if (error instanceof NotFoundError) return null;
      throw error;
    }),
    getSession(),
  ]);

  if (!po || !session) {
    notFound();
  }

  const canEdit = Boolean(session.permissions?.purchase_orders_edit);
  const canDelete = Boolean(session.permissions?.purchase_orders_delete);
  const canCreateFlexitanks = Boolean(session.permissions?.flexitanks_create);
  const canDeleteFlexitanks = Boolean(session.permissions?.flexitanks_delete);
  const canCreateAccessories = Boolean(session.permissions?.accessories_create);
  const canDeleteAccessories = Boolean(session.permissions?.accessories_delete);

  return (
    <div className="space-y-6">
      <p className="text-sm text-navy-500 dark:text-navy-100/70">
        <Link href="/purchase-orders" className="hover:underline">
          Purchase Orders
        </Link>{" "}
        &gt; Detalhes
      </p>

      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-navy-900 text-white">
            <FileText size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-navy-900 dark:text-navy-100">
              {po.poNumber}
            </h1>
            <div className="mt-1">
              <PurchaseOrderStatusBadge status={po.status} />
            </div>
          </div>
        </div>

        {canDelete && <DeletePoTrigger uid={po.uid} poNumber={po.poNumber ?? ""} />}
      </div>

      <GeneralInfoSection po={po} canEdit={canEdit} />
      <DocumentationSection po={po} canEdit={canEdit} />
      <ProductsSection po={po} canEdit={canEdit} />
      <FlexitanksSection
        po={po}
        canCreate={canCreateFlexitanks}
        canDelete={canDeleteFlexitanks}
        canSetAvailable={canEdit}
      />
      <AccessoriesSection
        po={po}
        canCreate={canCreateAccessories}
        canDelete={canDeleteAccessories}
      />

      <Link
        href="/purchase-orders"
        className="inline-block text-sm font-medium text-navy-500 hover:text-navy-900 hover:underline dark:text-navy-100/70 dark:hover:text-navy-100"
      >
        ← Voltar para a lista
      </Link>
    </div>
  );
}
