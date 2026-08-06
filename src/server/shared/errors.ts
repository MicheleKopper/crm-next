import { NextResponse } from "next/server";
import { ZodError } from "zod";

export class AppError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export class ValidationError extends AppError {
  readonly issues?: unknown;

  constructor(message: string, issues?: unknown) {
    super(message, 400);
    this.issues = issues;
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Acesso não autorizado") {
    super(message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Ação não autorizada.") {
    super(message, 403);
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Registro não encontrado.") {
    super(message, 404);
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409);
  }
}

export function toErrorResponse(error: unknown) {
  if (error instanceof ZodError) {
    return NextResponse.json(
      { message: "Dados inválidos.", issues: error.issues },
      { status: 400 }
    );
  }

  if (error instanceof AppError) {
    return NextResponse.json(
      {
        message: error.message,
        issues: error instanceof ValidationError ? error.issues : undefined,
      },
      { status: error.status }
    );
  }

  console.error(error);
  return NextResponse.json(
    { message: "Erro interno do servidor." },
    { status: 500 }
  );
}
