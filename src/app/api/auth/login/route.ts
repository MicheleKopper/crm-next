import { NextRequest, NextResponse } from "next/server";

import { login } from "@/server/auth/auth.service";
import { loginSchema } from "@/server/auth/auth.dto";
import { toErrorResponse } from "@/server/shared/errors";

export async function POST(request: NextRequest) {
  try {
    const input = loginSchema.parse(await request.json());
    const user = await login(input);
    return NextResponse.json({ user });
  } catch (error) {
    return toErrorResponse(error);
  }
}
