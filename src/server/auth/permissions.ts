import "server-only";

import { ForbiddenError, UnauthorizedError } from "@/server/shared/errors";
import { getSession, type SessionPayload } from "./session";

export type PermissionKey =
  | "customers_create"
  | "customers_edit"
  | "customers_delete"
  | "leads_create"
  | "leads_edit"
  | "leads_delete"
  | "flexitanks_edit"
  | "flexitanks_create"
  | "flexitanks_delete"
  | "purchase_orders_create"
  | "purchase_orders_edit"
  | "purchase_orders_delete"
  | "accessories_create"
  | "accessories_delete";

export async function requireSession(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) {
    throw new UnauthorizedError();
  }
  return session;
}

export function requirePermission(
  session: SessionPayload,
  permission: PermissionKey
) {
  if (!session.permissions?.[permission]) {
    throw new ForbiddenError();
  }
}
