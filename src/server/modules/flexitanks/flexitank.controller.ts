import "server-only";

import { NextRequest, NextResponse } from "next/server";

import { toCsv } from "@/lib/csv";
import { toErrorResponse } from "@/server/shared/errors";
import {
  exportFlexitanksQuerySchema,
  listFlexitanksQuerySchema,
  markFlexitankDamagedSchema,
  searchTransferQuerySchema,
  transferFlexitanksSchema,
  updateFlexitankSchema,
} from "./flexitank.dto";
import * as flexitankService from "./flexitank.service";

const EXPORT_COLUMNS = [
  { key: "serialNumber", label: "Série" },
  { key: "status", label: "Status" },
  { key: "size", label: "Tamanho" },
  { key: "price", label: "Preço" },
  { key: "locationName", label: "Localização" },
  { key: "poNumber", label: "Purchase order" },
  { key: "booking", label: "Booking" },
  { key: "createdAt", label: "Criado em" },
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

export async function exportFlexitanks(request: NextRequest) {
  try {
    const query = exportFlexitanksQuerySchema.parse(queryToObject(request));
    const rows = await flexitankService.exportFlexitanksCsv(query);
    const csv = toCsv(rows, EXPORT_COLUMNS);
    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="flexitanks-${Date.now()}.csv"`,
      },
    });
  } catch (error) {
    return toErrorResponse(error);
  }
}
