import "server-only";

import { NextRequest, NextResponse } from "next/server";

import { toCsv } from "@/lib/csv";
import { toErrorResponse } from "@/server/shared/errors";
import {
  createFlexitanksBatchSchema,
  createFlexitanksUniqueSchema,
  deleteFlexitanksQuerySchema,
  exportFlexitanksQuerySchema,
  listFlexitanksQuerySchema,
  markFlexitankDamagedSchema,
  searchTransferQuerySchema,
  setFlexitanksAvailableSchema,
  transferFlexitanksSchema,
  updateFlexitankSchema,
} from "./flexitank.dto";
import * as flexitankService from "./flexitank.service";

const AVAILABLE_EXPORT_COLUMNS = [
  { key: "status", label: "Status" },
  { key: "serialNumber", label: "Série" },
  { key: "size", label: "Tamanho" },
  { key: "locationName", label: "Localização" },
];

const CURRENT_EXPORT_COLUMNS = [
  { key: "status", label: "Status" },
  { key: "serialNumber", label: "Série" },
  { key: "poNumber", label: "PO" },
  { key: "locationName", label: "Localização" },
  { key: "size", label: "Tamanho" },
  { key: "price", label: "Preço" },
];

function queryToObject(request: NextRequest) {
  return Object.fromEntries(request.nextUrl.searchParams.entries());
}

export async function listFlexitanks(request: NextRequest) {
  try {
    const query = listFlexitanksQuerySchema.parse(queryToObject(request));
    const result = await flexitankService.getFlexitankList(query);
    return NextResponse.json(result);
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function getFlexitankCounter() {
  try {
    const rows = await flexitankService.getFlexitankCounter();
    return NextResponse.json({ rows });
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function listLocations() {
  try {
    const locations = await flexitankService.listLocations();
    return NextResponse.json({ locations });
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function searchForTransfer(request: NextRequest) {
  try {
    const query = searchTransferQuerySchema.parse(queryToObject(request));
    const results = await flexitankService.searchForTransfer(query.search);
    return NextResponse.json({ results });
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function getFlexitank(uid: string) {
  try {
    const result = await flexitankService.getFlexitankByUid(uid);
    return NextResponse.json(result);
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function updateFlexitank(request: NextRequest, uid: string) {
  try {
    const input = updateFlexitankSchema.parse(await request.json());
    const result = await flexitankService.updateFlexitank(uid, input);
    return NextResponse.json(result);
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function markFlexitankDamaged(request: NextRequest, uid: string) {
  try {
    const input = markFlexitankDamagedSchema.parse(await request.json());
    const result = await flexitankService.markFlexitankDamaged(uid, input);
    return NextResponse.json(result);
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function transferFlexitanks(request: NextRequest) {
  try {
    const input = transferFlexitanksSchema.parse(await request.json());
    const result = await flexitankService.transferFlexitanks(input);
    return NextResponse.json(result);
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function createFlexitanksBatch(request: NextRequest) {
  try {
    const input = createFlexitanksBatchSchema.parse(await request.json());
    const result = await flexitankService.createFlexitanksBatch(input);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function createFlexitanksUnique(request: NextRequest) {
  try {
    const input = createFlexitanksUniqueSchema.parse(await request.json());
    const result = await flexitankService.createFlexitanksUnique(input);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function deleteFlexitanksBatch(request: NextRequest) {
  try {
    const query = deleteFlexitanksQuerySchema.parse(queryToObject(request));
    const result = await flexitankService.deleteFlexitanksBatch(query.uids);
    return NextResponse.json(result);
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function setFlexitanksAvailable(request: NextRequest) {
  try {
    const input = setFlexitanksAvailableSchema.parse(await request.json());
    const result = await flexitankService.setFlexitanksAvailable(
      input.purchaseOrderId
    );
    return NextResponse.json(result);
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function exportFlexitanks(request: NextRequest) {
  try {
    const query = exportFlexitanksQuerySchema.parse(queryToObject(request));
    const rows = await flexitankService.exportFlexitanksCsv(query);
    const columns =
      query.mode === "available" ? AVAILABLE_EXPORT_COLUMNS : CURRENT_EXPORT_COLUMNS;
    const csv = toCsv(rows, columns);
    const suffix = query.mode === "available" ? "disponiveis" : "listagem-atual";
    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="flexitanks-${suffix}-${Date.now()}.csv"`,
      },
    });
  } catch (error) {
    return toErrorResponse(error);
  }
}
