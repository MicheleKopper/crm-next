import { Box } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getSession } from "@/server/auth/session";
import { getFlexitankByUid } from "@/server/modules/flexitanks/flexitank.service";
import { NotFoundError } from "@/server/shared/errors";

import { ContainerSection } from "./container-section";
import { CustomerProductCard } from "./customer-product-card";
import { DocumentationCard } from "./documentation-card";
import { FlexitankInfoSection } from "./flexitank-info-section";
import { FlexitankStatusPicker } from "./flexitank-status-picker";
import { LogisticsCard } from "./logistics-card";
import { PortsDatesCard } from "./ports-dates-card";

export default async function FlexitankDetailPage({
  params,
}: PageProps<"/flexitanks/[uid]">) {
  const { uid } = await params;

  const [flexitank, session] = await Promise.all([
    getFlexitankByUid(uid).catch((error) => {
      if (error instanceof NotFoundError) return null;
      throw error;
    }),
    getSession(),
  ]);

  if (!flexitank || !session) {
    notFound();
  }

  const canEdit = Boolean(session.permissions?.flexitanks_edit);
  const subtitle = [flexitank.locationName, flexitank.customerName]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="space-y-6">
      <p className="text-sm text-navy-500 dark:text-navy-100/70">
        <Link href="/flexitanks" className="hover:underline">
          Flexitanks
        </Link>{" "}
        &gt; Detalhes
      </p>

      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-navy-900 text-white">
            <Box size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-navy-900 dark:text-navy-100">
              {flexitank.serialNumber}
            </h1>
            {subtitle && (
              <p className="mt-1 text-sm text-navy-500 dark:text-navy-100/70">{subtitle}</p>
            )}
            <div className="mt-1">
              <FlexitankStatusPicker
                uid={flexitank.uid}
                status={flexitank.status}
                canEdit={canEdit}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <FlexitankInfoSection flexitank={flexitank} canEdit={canEdit} />
        <CustomerProductCard flexitank={flexitank} />
        <DocumentationCard flexitank={flexitank} />
        <ContainerSection flexitank={flexitank} canEdit={canEdit} />
        <LogisticsCard flexitank={flexitank} />
        <PortsDatesCard flexitank={flexitank} />
      </div>

      <Link
        href="/flexitanks"
        className="inline-block text-sm font-medium text-navy-500 hover:text-navy-900 hover:underline dark:text-navy-100/70 dark:hover:text-navy-100"
      >
        ← Voltar para a lista
      </Link>
    </div>
  );
}
