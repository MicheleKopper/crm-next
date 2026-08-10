import "server-only";

import { ForbiddenError, UnauthorizedError } from "@/server/shared/errors";
import { getSession, type SessionPayload } from "./session";

export type PermissionKey =
  | "customers_create"
  | "customers_edit"
  | "customers_delete"
  | "leads_create"
  | "leads_edit"
  | "leads_delete";

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
