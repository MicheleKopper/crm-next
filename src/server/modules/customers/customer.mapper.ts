import type { Company, CustomerProfile, User } from "@/generated/prisma/client";

export type CompanyWithProfile = Company & {
  customerProfile: CustomerProfile | null;
  owner: User | null;
};

export function toCustomerDetail(company: CompanyWithProfile) {
  const profile = company.customerProfile;
  return {
    uid: company.id,
    displayName: company.displayName,
    legalName: company.legalName,
    taxId: company.taxId,
    isForeignCompany: company.foreignValue,
    phone: company.phone,
    website: company.website,
    address: company.address1,
    number: company.number,
    complement: company.address2,
    city: company.city,
    state: company.state,
    country: company.country,
    postalCode: company.postalCode,
    ownerId: company.ownerId,
    ownerFullName: company.owner?.fullName ?? null,
    createdAt: company.createdAt,

    status: profile?.status ?? null,
    segment: profile?.segment ?? null,
    size: profile?.size ?? null,
    source: profile?.source ?? null,
    sourceSpecify: profile?.sourceSpecify ?? null,
    accountPotential: profile?.accountPotential ?? null,
    estimatedVolume: profile?.estimatedVolume ?? null,
    volumeUnit: profile?.volumeUnit ?? null,
    currency: profile?.currency ?? null,
    incoterms: profile?.incoterms ?? null,
    mainRoutes: profile?.mainRoutes ?? null,
    cargoType: profile?.cargoType ?? null,
    restrictions: profile?.restrictions ?? null,
    notes: profile?.notes ?? null,
  };
}

export type CustomerDetail = ReturnType<typeof toCustomerDetail>;
