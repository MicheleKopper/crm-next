import type { Company, Contact, Lead, User } from "@/generated/prisma/client";

export type LeadWithRelations = Lead & {
  customer: Company;
  operator: User | null;
  contact: Contact | null;
};

export function toLeadDetail(lead: LeadWithRelations) {
  return {
    uid: lead.id,
    status: lead.status,
    source: lead.source,
    campaign: lead.campaign,
    urgency: lead.urgency,
    score: lead.score,
    currency: lead.currency,
    modal: lead.modal,
    estimatedVolume: lead.estimatedVolume,
    volumeUnit: lead.volumeUnit,
    painIdentified: lead.painIdentified,
    interest: lead.interest,
    disqualificationReason: lead.disqualificationReason,
    lastInteractionAt: lead.lastInteractionAt,
    convertedAt: lead.convertedAt,
    createdAt: lead.createdAt,
    operatorId: lead.operatorId,
    operatorFullName: lead.operator?.fullName ?? null,

    companyUid: lead.customer.id,
    displayName: lead.customer.displayName,
    legalName: lead.customer.legalName,
    taxId: lead.customer.taxId,
    country: lead.customer.country,
    isForeignCompany: lead.customer.foreignValue,

    contact: lead.contact
      ? {
          uid: lead.contact.id,
          name: lead.contact.firstName,
          lastName: lead.contact.lastName,
          fullName: lead.contact.fullName,
          email: lead.contact.email,
          phone: lead.contact.phoneNumber,
          workPhone: lead.contact.workPhone,
          extension: lead.contact.extension,
          jobTitle: lead.contact.jobTitle,
          birthday: lead.contact.birthday,
          language: lead.contact.language,
          pronoun: lead.contact.pronoun,
        }
      : null,
  };
}

export type LeadDetail = ReturnType<typeof toLeadDetail>;
