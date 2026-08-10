import "server-only";

import { NextRequest, NextResponse } from "next/server";

import { toCsv } from "@/lib/csv";
import { toErrorResponse } from "@/server/shared/errors";
import {
  checkCnpjQuerySchema,
  createLeadSchema,
  exportLeadsQuerySchema,
  listLeadsQuerySchema,
  updateLeadContactSchema,
  updateLeadSchema,
} from "./lead.dto";
import * as leadService from "./lead.service";

const EXPORT_COLUMNS = [
  { key: "contactName", label: "Lead" },
  { key: "email", label: "E-mail" },
  { key: "phone", label: "Celular" },
  { key: "jobTitle", label: "Cargo" },
  { key: "displayName", label: "Empresa" },
  { key: "legalName", label: "Razão Social" },
  { key: "status", label: "Status" },
  { key: "source", label: "Origem" },
  { key: "campaign", label: "Campanha" },
  { key: "urgency", label: "Urgência" },
  { key: "score", label: "Score" },
  { key: "modal", label: "Modal" },
  { key: "estimatedVolume", label: "Volume Estimado" },
  { key: "volumeUnit", label: "Unidade" },
  { key: "currency", label: "Moeda" },
  { key: "operatorFullName", label: "Responsável" },
  { key: "createdAt", label: "Criado em" },
];

function queryToObject(request: NextRequest) {
  return Object.fromEntries(request.nextUrl.searchParams.entries());
}

export async function listLeads(request: NextRequest) {
  try {
    const query = listLeadsQuerySchema.parse(queryToObject(request));
    const result = await leadService.getLeadList(query);
    return NextResponse.json(result);
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function listLeadsWithDetails(request: NextRequest) {
  try {
    const query = listLeadsQuerySchema.parse(queryToObject(request));
    const result = await leadService.getLeadListWithDetails(query);
    return NextResponse.json(result);
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function createLead(request: NextRequest) {
  try {
    const input = createLeadSchema.parse(await request.json());
    const result = await leadService.createLead(input);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function checkCnpj(request: NextRequest) {
  try {
    const query = checkCnpjQuerySchema.parse(queryToObject(request));
    const result = await leadService.checkCnpj(query.cnpj);
    return NextResponse.json(result);
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function getLead(uid: string) {
  try {
    const result = await leadService.getLeadByUid(uid);
    return NextResponse.json(result);
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function updateLead(request: NextRequest, uid: string) {
  try {
    const input = updateLeadSchema.parse(await request.json());
    const result = await leadService.updateLead(uid, input);
    return NextResponse.json(result);
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function updateLeadContact(request: NextRequest, uid: string) {
  try {
    const input = updateLeadContactSchema.parse(await request.json());
    const result = await leadService.updateLeadContact(uid, input);
    return NextResponse.json(result);
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function deleteLead(uid: string) {
  try {
    await leadService.deleteLead(uid);
    return NextResponse.json({ message: "Lead deletado com sucesso." });
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function exportLeads(request: NextRequest) {
  try {
    const query = exportLeadsQuerySchema.parse(queryToObject(request));
    const rows = await leadService.exportLeadsCsv(query);
    const csv = toCsv(rows, EXPORT_COLUMNS);
    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="leads-${Date.now()}.csv"`,
      },
    });
  } catch (error) {
    return toErrorResponse(error);
  }
}
