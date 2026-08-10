import "server-only";

import { requirePermission, requireSession } from "@/server/auth/permissions";
import { NotFoundError } from "@/server/shared/errors";
import type {
  CreateLeadInput,
  ExportLeadsQuery,
  ListLeadsQuery,
  UpdateLeadContactInput,
  UpdateLeadInput,
} from "./lead.dto";
import * as leadRepository from "./lead.repository";
import { toLeadDetail } from "./lead.mapper";

export async function getLeadList(query: ListLeadsQuery) {
  await requireSession();
  const [{ items, totalCount }, operators] = await Promise.all([
    leadRepository.listLeads(query),
    leadRepository.listOperatorOptions(),
  ]);
  return { items, totalCount, operators };
}

export async function getLeadListWithDetails(query: ListLeadsQuery) {
  await requireSession();
  return leadRepository.listLeadsWithDetails(query);
}

export async function listOperators() {
  await requireSession();
  return leadRepository.listOperatorOptions();
}

export async function checkCnpj(taxId: string) {
  await requireSession();
  const company = await leadRepository.findCompanyByTaxId(taxId);
  return {
    company: company
      ? {
          uid: company.id,
          legalName: company.legalName,
          displayName: company.displayName,
        }
      : null,
  };
}

export async function getLeadByUid(uid: string) {
  await requireSession();
  const lead = await leadRepository.findLeadByUid(uid);
  if (!lead) {
    throw new NotFoundError("Lead não encontrado!");
  }
  return toLeadDetail(lead);
}

export async function createLead(input: CreateLeadInput) {
  const session = await requireSession();
  requirePermission(session, "leads_create");

  const { lead } = await leadRepository.createLead(input);
  return { uid: lead.id };
}

export async function updateLead(uid: string, input: UpdateLeadInput) {
  const session = await requireSession();
  requirePermission(session, "leads_edit");

  const existing = await leadRepository.findLeadByUid(uid);
  if (!existing) {
    throw new NotFoundError("Lead não encontrado!");
  }

  await leadRepository.updateLead(uid, input);
  return { uid };
}

export async function updateLeadContact(
  uid: string,
  input: UpdateLeadContactInput
) {
  const session = await requireSession();
  requirePermission(session, "leads_edit");

  const existing = await leadRepository.findLeadByUid(uid);
  if (!existing) {
    throw new NotFoundError("Lead não encontrado!");
  }
  if (!existing.contactId) {
    throw new NotFoundError("Este lead não possui um contato associado.");
  }

  await leadRepository.updateContact(existing.contactId, input);
  return { uid };
}

export async function deleteLead(uid: string) {
  const session = await requireSession();
  requirePermission(session, "leads_delete");

  const existing = await leadRepository.findLeadByUid(uid);
  if (!existing) {
    throw new NotFoundError("Lead não encontrado!");
  }

  await leadRepository.deleteLead(uid);
}

export async function exportLeadsCsv(query: ExportLeadsQuery) {
  await requireSession();
  const rows = await leadRepository.findLeadsForExport(query);
  if (rows.length === 0) {
    throw new NotFoundError("Nenhum lead para exportação foi localizado.");
  }
  return rows;
}
