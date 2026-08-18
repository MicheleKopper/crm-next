import { z } from "zod";

export const PO_STATUSES = ["Completed", "Expected"] as const;

export const PO_SORT_FIELDS = [
  "poNumber",
  "poDate",
  "arrivalDate",
  "clearenceDate",
  "createdAt",
] as const;

export const listPurchaseOrdersQuerySchema = z.object({
  search: z.string().trim().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  offset: z.coerce.number().int().min(0).default(0),
  status: z.enum(PO_STATUSES).optional(),
  poDateFrom: z.string().optional(),
  poDateUntil: z.string().optional(),
  arrivalDateFrom: z.string().optional(),
  arrivalDateUntil: z.string().optional(),
  sortBy: z.enum(PO_SORT_FIELDS).default("createdAt"),
  sortDir: z.enum(["asc", "desc"]).default("desc"),
});
export type ListPurchaseOrdersQuery = z.infer<typeof listPurchaseOrdersQuerySchema>;

export const exportPurchaseOrdersQuerySchema = z.object({
  from: z.string().min(1, "Selecione o período!"),
  until: z.string().min(1, "Selecione o período!"),
});
export type ExportPurchaseOrdersQuery = z.infer<typeof exportPurchaseOrdersQuerySchema>;

const optionalText = () =>
  z
    .string()
    .trim()
    .optional()
    .transform((value) => (value === "" ? undefined : value));

export const createPurchaseOrderSchema = z.object({
  poDate: optionalText(),
  tempAdmissionNumber: optionalText(),
  tempAdmissionDate: optionalText(),
  arrivalDate: optionalText(),
  observations: optionalText(),
});
export type CreatePurchaseOrderInput = z.output<typeof createPurchaseOrderSchema>;
export type CreatePurchaseOrderFormInput = z.input<typeof createPurchaseOrderSchema>;

/**
 * Single partial-update schema shared by the "Informações Gerais" and "Documentação"
 * inline-edit forms — each form only sends its own subset of fields, and Prisma treats
 * `undefined` values in `data` as "don't touch this column", so both can PATCH the same
 * endpoint without clobbering each other's fields.
 */
export const updatePurchaseOrderSchema = z.object({
  poNumber: optionalText(),
  poDate: optionalText(),
  tempAdmissionNumber: optionalText(),
  tempAdmissionDate: optionalText(),
  arrivalDate: optionalText(),
  clearenceDate: optionalText(),
  observations: optionalText(),
  proformaNumber: optionalText(),
  proformaDate: optionalText(),
  packingListNumber: optionalText(),
  packingListDate: optionalText(),
  blNumber: optionalText(),
  blDate: optionalText(),
});
export type UpdatePurchaseOrderInput = z.output<typeof updatePurchaseOrderSchema>;
export type UpdatePurchaseOrderFormInput = z.input<typeof updatePurchaseOrderSchema>;

export const createProductSchema = z.object({
  description: z.string().trim().min(1, "Obrigatório"),
  quantity: z.coerce.number().int().min(1, "Deve ser maior que 0"),
  price: z.coerce.number().min(0).optional(),
  size: optionalText(),
  comments: optionalText(),
  isFlexitank: z.boolean().default(false),
});
export type CreateProductInput = z.output<typeof createProductSchema>;
export type CreateProductFormInput = z.input<typeof createProductSchema>;

export const updateProductSchema = createProductSchema;
export type UpdateProductInput = CreateProductInput;
export type UpdateProductFormInput = CreateProductFormInput;

export const ACCESSORY_TYPES = ["heating_pad", "anti_bulging_bars"] as const;
export const ACCESSORY_TYPE_LABELS: Record<(typeof ACCESSORY_TYPES)[number], string> = {
  heating_pad: "Heating Pad",
  anti_bulging_bars: "Anti-Bulging Bars",
};

export const createAccessorySchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("anti_bulging_bars"),
    quantityKit: z.coerce.number().int().min(1, "Deve ser maior que 0"),
  }),
  z.object({
    type: z.literal("heating_pad"),
    items: z
      .array(
        z.object({
          codePrefix: z.string().trim().min(1, "Obrigatório"),
          start: z.coerce.number().int().min(0),
          end: z.coerce.number().int().min(0),
          quantityKit: z.coerce.number().int().min(1, "Deve ser maior que 0"),
        })
      )
      .min(1, "Adicione ao menos uma faixa."),
  }),
]);
export type CreateAccessoryInput = z.output<typeof createAccessorySchema>;

export const deleteAccessoriesQuerySchema = z.object({
  uids: z
    .string()
    .transform((value) => value.split(",").filter(Boolean))
    .pipe(z.array(z.string().uuid()).min(1, "Selecione ao menos um acessório.")),
});
export type DeleteAccessoriesQuery = z.infer<typeof deleteAccessoriesQuerySchema>;
