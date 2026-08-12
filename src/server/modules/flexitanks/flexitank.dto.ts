import { z } from "zod";

export const FLEXITANK_STATUSES = [
  "Available",
  "Used",
  "Waiting",
  "Damaged",
] as const;

export const FLEXITANK_SIZES = [
  "16kl",
  "17kl",
  "18kl",
  "19kl",
  "20kl",
  "21kl",
  "22kl",
  "23kl",
  "24kl",
] as const;

export const FLEXITANK_SORT_FIELDS = [
  "serialNumber",
  "size",
  "price",
  "createdAt",
] as const;

export const listFlexitanksQuerySchema = z.object({
  search: z.string().trim().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  offset: z.coerce.number().int().min(0).default(0),
  status: z.enum(FLEXITANK_STATUSES).optional(),
  size: z.string().optional(),
  locationId: z.string().uuid().optional(),
  poNumber: z.string().optional(),
  booking: z.string().optional(),
  sortBy: z.enum(FLEXITANK_SORT_FIELDS).default("createdAt"),
  sortDir: z.enum(["asc", "desc"]).default("desc"),
});
export type ListFlexitanksQuery = z.infer<typeof listFlexitanksQuerySchema>;

export const exportFlexitanksQuerySchema = z.object({
  mode: z.enum(["available", "current"]),
  search: z.string().trim().optional(),
  status: z.enum(FLEXITANK_STATUSES).optional(),
  size: z.string().optional(),
  locationId: z.string().uuid().optional(),
  poNumber: z.string().optional(),
  booking: z.string().optional(),
  sortBy: z.enum(FLEXITANK_SORT_FIELDS).default("createdAt"),
  sortDir: z.enum(["asc", "desc"]).default("desc"),
});
export type ExportFlexitanksQuery = z.infer<typeof exportFlexitanksQuerySchema>;

export const searchTransferQuerySchema = z.object({
  search: z.string().trim().min(1, "Obrigatório"),
});
export type SearchTransferQuery = z.infer<typeof searchTransferQuerySchema>;

export const updateFlexitankSchema = z.object({
  fhbStock: z.string().trim().optional(),
  serialNumber: z.string().trim().min(1).optional(),
  size: z.enum(FLEXITANK_SIZES).optional(),
  price: z.coerce.number().min(0).optional(),
  status: z.enum(FLEXITANK_STATUSES).optional(),
  comment: z.string().trim().optional(),
});
export type UpdateFlexitankInput = z.output<typeof updateFlexitankSchema>;
export type UpdateFlexitankFormInput = z.input<typeof updateFlexitankSchema>;

export const markFlexitankDamagedSchema = z.object({
  comment: z.string().trim().min(1, "Obrigatório"),
});
export type MarkFlexitankDamagedInput = z.output<typeof markFlexitankDamagedSchema>;

export const transferFlexitanksSchema = z.object({
  uids: z.array(z.string().uuid()).min(1, "Selecione ao menos um flexitank."),
  locationId: z.string().uuid("Obrigatório"),
});
export type TransferFlexitanksInput = z.output<typeof transferFlexitanksSchema>;
