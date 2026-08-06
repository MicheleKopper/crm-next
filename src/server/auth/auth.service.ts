import "server-only";

import bcrypt from "bcryptjs";

import { prisma } from "@/server/shared/prisma";
import { UnauthorizedError } from "@/server/shared/errors";
import type { LoginInput } from "./auth.dto";
import {
  clearSessionCookie,
  setSessionCookie,
  signSession,
} from "./session";

const INVALID_CREDENTIALS_MESSAGE = "E-mail ou senha inválidos.";

export async function login(input: LoginInput) {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
  });
  if (!user) {
    throw new UnauthorizedError(INVALID_CREDENTIALS_MESSAGE);
  }

  const passwordMatches = await bcrypt.compare(
    input.password,
    user.passwordHash
  );
  if (!passwordMatches) {
    throw new UnauthorizedError(INVALID_CREDENTIALS_MESSAGE);
  }

  const token = await signSession({
    sub: user.id,
    fullName: user.fullName,
    email: user.email,
    permissions: (user.permissions ?? {}) as Record<string, boolean>,
  });
  await setSessionCookie(token);

  return { id: user.id, fullName: user.fullName, email: user.email };
}

export async function logout() {
  await clearSessionCookie();
}
