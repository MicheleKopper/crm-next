import Link from "next/link";
import { notFound } from "next/navigation";

import { LeadStatusBadge, ScoreBadge, UrgencyBadge } from "@/components/ui/badge";
import { getSession } from "@/server/auth/session";
import { getLeadByUid, listOperators } from "@/server/modules/leads/lead.service";
import { NotFoundError } from "@/server/shared/errors";

import { ActivitiesTab } from "./activities-tab";
import { ContactSection } from "./contact-section";
import { DeleteLeadTrigger } from "./delete-lead-trigger";
import { LeadDetailTabs } from "./lead-detail-tabs";
import { LeadInfoSection } from "./lead-info-section";
import { OpportunitiesTab } from "./opportunities-tab";
import { QualificationSection } from "./qualification-section";

function getInitials(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean);
  const initials = words.slice(0, 2).map((word) => word[0]);
  return initials.join("").toUpperCase();
}

export default async function LeadDetailPage({
  params,
}: PageProps<"/leads/[uid]">) {
  const { uid } = await params;

  const [lead, operators, session] = await Promise.all([
    getLeadByUid(uid).catch((error) => {
      if (error instanceof NotFoundError) return null;
      throw error;
    }),
    listOperators(),
    getSession(),
  ]);

  if (!lead || !session) {
    notFound();
  }

  const canEdit = Boolean(session.permissions?.leads_edit);
  const canDelete = Boolean(session.permissions?.leads_delete);
  const leadFullName = lead.contact?.fullName || lead.displayName;

  return (
    <div className="space-y-6">
      <p className="text-sm text-navy-500">
        <Link href="/leads" className="hover:underline">
          Leads
        </Link>{" "}
        &gt; {leadFullName}
      </p>

      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-navy-900 text-lg font-bold text-white">
            {getInitials(leadFullName)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-navy-900">
                {leadFullName}
              </h1>
              <LeadStatusBadge status={lead.status} />
            </div>
            <p className="mt-1 text-sm text-navy-500">
              {lead.displayName}
              {lead.legalName && lead.legalName !== lead.displayName
                ? ` · ${lead.legalName}`
                : ""}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ScoreBadge score={lead.score} />
          <UrgencyBadge urgency={lead.urgency} />
          {canDelete && (
            <DeleteLeadTrigger uid={lead.uid} displayName={leadFullName} />
          )}
        </div>
      </div>

      <LeadDetailTabs
        detailsPanel={
          <div>
            <LeadInfoSection lead={lead} operators={operators} canEdit={canEdit} />
            <QualificationSection lead={lead} canEdit={canEdit} />
            <ContactSection lead={lead} canEdit={canEdit} />
          </div>
        }
        opportunitiesPanel={<OpportunitiesTab />}
        activitiesPanel={<ActivitiesTab leadFullName={leadFullName} />}
      />

      <Link
        href="/leads"
        className="inline-block text-sm font-medium text-navy-500 hover:text-navy-900 hover:underline"
      >
        ← Voltar para a lista
      </Link>
    </div>
  );
}
