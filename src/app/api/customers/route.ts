import type { NextRequest } from "next/server";

import * as customerController from "@/server/modules/customers/customer.controller";

export async function GET(request: NextRequest) {
  return customerController.listCustomers(request);
}

export async function POST(request: NextRequest) {
  return customerController.createCustomer(request);
}
