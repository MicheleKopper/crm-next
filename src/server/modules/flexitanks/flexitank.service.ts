import "server-only";

import { requirePermission, requireSession } from "@/server/auth/permissions";
import { ConflictError, NotFoundError } from "@/server/shared/errors";
import type {
  CreateFlexitanksBatchInput,
  CreateFlexitanksUniqueInput,
  ExportFlexitanksQuery,
  ListFlexitanksQuery,
  MarkFlexitankDamagedInput,
  TransferFlexitanksInput,
  UpdateFlexitankInput,
} from "./flexitank.dto";
import * as flexitankRepository from "./flexitank.repository";
import { toFlexitankDetail } from "./flexitank.mapper";

export async function getFlexitankList(query: ListFlexitanksQuery) {
  await requireSession();
  return flexitankRepository.listFlexitanks(query);
}

export async function getFlexitankCounter() {
  await requireSession();
  return flexitankRepository.getFlexitankCounter();
}

export async function listLocations() {
  await requireSession();
  return flexitankRepository.listLocationOptions();
}

export async function searchForTransfer(search: string) {
  await requireSession();
  return flexitankRepository.searchFlexitanksForTransfer(search);
}

export async function getFlexitankByUid(uid: string) {
  await requireSession();
  const flexitank = await flexitankRepository.findFlexitankByUid(uid);
  if (!flexitank) {
    throw new NotFoundError("Flexitank não encontrado!");
  }
  return toFlexitankDetail(flexitank);
}

export async function updateFlexitank(uid: string, input: UpdateFlexitankInput) {
  const session = await requireSession();
  requirePermission(session, "flexitanks_edit");

  const existing = await flexitankRepository.findFlexitankByUid(uid);
  if (!existing) {
    throw new NotFoundError("Flexitank não encontrado!");
  }

  await flexitankRepository.updateFlexitank(uid, input);
  return { uid };
}

export async function markFlexitankDamaged(
  uid: string,
  input: MarkFlexitankDamagedInput
) {
  const session = await requireSession();
  requirePermission(session, "flexitanks_edit");

  const existing = await flexitankRepository.findFlexitankByUid(uid);
  if (!existing) {
    throw new NotFoundError("Flexitank não encontrado!");
  }

  await flexitankRepository.updateFlexitank(uid, {
    status: "Damaged",
    comment: input.comment,
  });
  return { uid };
}

export async function transferFlexitanks(input: TransferFlexitanksInput) {
  const session = await requireSession();
  requirePermission(session, "flexitanks_edit");

  await flexitankRepository.transferFlexitanks(input);
  return { count: input.uids.length };
}

function countRequestedRange(items: { start: number; end: number }[]) {
  return items.reduce((total, item) => total + (item.end - item.start + 1), 0);
}

async function assertWithinQuota(purchaseOrderId: string, requested: number) {
  const { contracted, existing } = await flexitankRepository.getFlexitankQuota(
    purchaseOrderId
  );
  if (existing + requested > contracted) {
    throw new ConflictError("Limite de flexitanks excedido.");
  }
}

export async function createFlexitanksBatch(input: CreateFlexitanksBatchInput) {
  const session = await requireSession();
  requirePermission(session, "flexitanks_create");

  await assertWithinQuota(input.purchaseOrderId, countRequestedRange(input.items));
  const count = await flexitankRepository.createFlexitanksBatch(input);
  return { count };
}

export async function createFlexitanksUnique(input: CreateFlexitanksUniqueInput) {
  const session = await requireSession();
  requirePermission(session, "flexitanks_create");

  await assertWithinQuota(input.purchaseOrderId, input.items.length);
  const count = await flexitankRepository.createFlexitanksUnique(input);
  return { count };
}

export async function deleteFlexitanksBatch(uids: string[]) {
  const session = await requireSession();
  requirePermission(session, "flexitanks_delete");

  await flexitankRepository.deleteFlexitanksBatch(uids);
  return { count: uids.length };
}

export async function setFlexitanksAvailable(purchaseOrderId: string) {
  const session = await requireSession();
  requirePermission(session, "flexitanks_edit");

  const location = await flexitankRepository.findDefaultAvailableLocation();
  if (!location) {
    throw new NotFoundError(
      "Localização padrão para liberação de flexitanks não encontrada."
    );
  }

  const result = await flexitankRepository.markFlexitanksAvailable(
    purchaseOrderId,
    location.id
  );
  return { count: result.count };
}

export async function exportFlexitanksCsv(query: ExportFlexitanksQuery) {
  await requireSession();
  const rows = await flexitankRepository.findFlexitanksForExport(query);
  if (rows.length === 0) {
    throw new NotFoundError("Nenhum flexitank para exportação foi localizado.");
  }
  return rows;
}
