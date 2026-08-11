import "server-only";

import { NextRequest, NextResponse } from "next/server";

import { toCsv } from "@/lib/csv";
import { toErrorResponse } from "@/server/shared/errors";
import {
  createCustomerSchema,
  exportCustomersQuerySchema,
  listCustomersQuerySchema,
  updateCompanySchema,
  updateProfileSchema,
} from "./customer.dto";
import * as customerService from "./customer.service";

const EXPORT_COLUMNS = [
  { key: "displayName", label: "Nome" },
  { key: "legalName", label: "Razão social" },
  { key: "taxId", label: "CNPJ/Tax ID" },
  { key: "country", label: "País" },
  { key: "city", label: "Cidade" },
  { key: "state", label: "Estado" },
  { key: "phone", label: "Telefone" },
  { key: "website", label: "Website" },
  { key: "segment", label: "Segmento" },
  { key: "size", label: "Porte" },
  { key: "status", label: "Status" },
  { key: "accountPotential", label: "Potencial" },
  { key: "cargoType", label: "Tipo de carga" },
  { key: "estimatedVolume", label: "Volume estimado" },
  { key: "volumeUnit", label: "Unidade" },
  { key: "currency", label: "Moeda" },
  { key: "ownerFullName", label: "Responsável" },
  { key: "createdAt", label: "Criado em" },
];

function queryToObject(request: NextRequest) {
  return Object.fromEntries(request.nextUrl.searchParams.entries());
}

export async function listCustomers(request: NextRequest) {
  try {
    const query = listCustomersQuerySchema.parse(queryToObject(request));
    const result = await customerService.getCustomerList(query);
    return NextResponse.json(result);
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function createCustomer(request: NextRequest) {
  try {
    const input = createCustomerSchema.parse(await request.json());
    const result = await customerService.createCustomer(input);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function getCustomer(uid: string) {
  try {
    const result = await customerService.getCustomerByUid(uid);
    return NextResponse.json(result);
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function updateCustomerCompany(request: NextRequest, uid: string) {
  try {
    const input = updateCompanySchema.parse(await request.json());
    const result = await customerService.updateCustomerCompany(uid, input);
    return NextResponse.json(result);
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function updateCustomerProfile(request: NextRequest, uid: string) {
  try {
    const input = updateProfileSchema.parse(await request.json());
    const result = await customerService.updateCustomerProfile(uid, input);
    return NextResponse.json(result);
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function deleteCustomer(uid: string) {
  try {
    await customerService.deleteCustomer(uid);
    return NextResponse.json({ message: "Cliente deletado com sucesso." });
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function exportCustomers(request: NextRequest) {
  try {
    const query = exportCustomersQuerySchema.parse(queryToObject(request));
    const rows = await customerService.exportCustomersCsv(query);
    const csv = toCsv(rows, EXPORT_COLUMNS);
    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="clientes-${Date.now()}.csv"`,
      },
    });
  } catch (error) {
    return toErrorResponse(error);
  }
}
