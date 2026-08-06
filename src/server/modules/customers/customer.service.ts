import "server-only";

import { requirePermission, requireSession } from "@/server/auth/permissions";
import { ConflictError, NotFoundError } from "@/server/shared/errors";
import type {
  CreateCustomerInput,
  ExportCustomersQuery,
  ListCustomersQuery,
  UpdateCompanyInput,
  UpdateProfileInput,
} from "./customer.dto";
import { toCustomerDetail } from "./customer.mapper";
import * as customerRepository from "./customer.repository";

export async function getCustomerList(query: ListCustomersQuery) {
  await requireSession();
  const [{ items, totalCount }, owners] = await Promise.all([
    customerRepository.listCustomers(query),
    customerRepository.listOwnerOptions(),
  ]);
  return {
    items: items.map((item) => ({
      ...item,
      status: item.status ?? "Incompleto",
    })),
    totalCount,
    owners,
  };
}

export async function listOwners() {
  await requireSession();
  return customerRepository.listOwnerOptions();
}

export async function getCustomerByUid(uid: string) {
  await requireSession();
  const company = await customerRepository.findCustomerByUid(uid);
  if (!company) {
    throw new NotFoundError("Cliente não encontrado!");
  }
  return toCustomerDetail(company);
}

export async function createCustomer(input: CreateCustomerInput) {
  const session = await requireSession();
  requirePermission(session, "customers_create");

  if (await customerRepository.existsCompanyWithTaxId(input.taxId)) {
    throw new ConflictError(
      input.isForeignCompany ? "Tax Id já cadastrado" : "CNPJ já cadastrado"
    );
  }
  if (await customerRepository.existsCompanyWithPhone(input.phone)) {
    throw new ConflictError("Telefone já cadastrado");
  }

  const { company } = await customerRepository.createCustomer(input);
  return { uid: company.id };
}

export async function updateCustomerCompany(
  uid: string,
  input: UpdateCompanyInput
) {
  const session = await requireSession();
  requirePermission(session, "customers_edit");

  const existing = await customerRepository.findCustomerByUid(uid);
  if (!existing) {
    throw new NotFoundError("Cliente não encontrado!");
  }

  if (await customerRepository.existsCompanyWithTaxId(input.taxId, uid)) {
    throw new ConflictError(
      input.isForeignCompany ? "Tax Id já cadastrado" : "CNPJ já cadastrado"
    );
  }
  if (await customerRepository.existsCompanyWithPhone(input.phone, uid)) {
    throw new ConflictError("Telefone já cadastrado");
  }

  await customerRepository.updateCompany(uid, input);
  return { uid };
}

export async function updateCustomerProfile(
  uid: string,
  input: UpdateProfileInput
) {
  const session = await requireSession();
  requirePermission(session, "customers_edit");

  const existing = await customerRepository.findCustomerByUid(uid);
  if (!existing) {
    throw new NotFoundError("Cliente não encontrado!");
  }

  await customerRepository.upsertCustomerProfile(uid, input);
  return { uid };
}

export async function deleteCustomer(uid: string) {
  const session = await requireSession();
  requirePermission(session, "customers_delete");

  const existing = await customerRepository.findCustomerByUid(uid);
  if (!existing) {
    throw new NotFoundError("Cliente não encontrado!");
  }

  await customerRepository.deleteCustomer(uid);
}

export async function exportCustomersCsv(query: ExportCustomersQuery) {
  await requireSession();
  const rows = await customerRepository.findCustomersForExport(query);
  if (rows.length === 0) {
    throw new NotFoundError("Nenhum contato para exportação foi localizado.");
  }
  return rows;
}
