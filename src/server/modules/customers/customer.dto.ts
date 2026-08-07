import { z } from "zod";

export const CUSTOMER_STATUSES = [
  "Lead",
  "Prospecto",
  "Ativo",
  "Inativo",
  "Perdido",
] as const;

export const CUSTOMER_SEGMENTS = ["Importador", "Exportador", "Trading"] as const;

export const CUSTOMER_SIZES = [
  "Micro",
  "Pequeno",
  "Médio",
  "Grande",
  "Corporativo",
] as const;

export const ACCOUNT_POTENTIALS = ["Baixo", "Médio", "Alto", "Estratégico"] as const;

export const CARGO_TYPES = ["Flexitank", "Isotank", "General Cargo"] as const;

export const CUSTOMER_SORT_FIELDS = [
  "displayName",
  "createdAt",
  "status",
  "ownerFullName",
  "country",
] as const;

export const listCustomersQuerySchema = z.object({
  search: z.string().trim().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  offset: z.coerce.number().int().min(0).default(0),
  segment: z.string().optional(),
  size: z.string().optional(),
  status: z.string().optional(),
  accountPotential: z.string().optional(),
  ownerId: z.string().uuid().optional(),
  sortBy: z.enum(CUSTOMER_SORT_FIELDS).default("displayName"),
  sortDir: z.enum(["asc", "desc"]).default("asc"),
});
export type ListCustomersQuery = z.infer<typeof listCustomersQuerySchema>;

export const exportCustomersQuerySchema = z.object({
  from: z.string().min(1, "Selecione o período!"),
  until: z.string().min(1, "Selecione o período!"),
});
export type ExportCustomersQuery = z.infer<typeof exportCustomersQuerySchema>;

const requiredText = (message = "Obrigatório") => z.string().trim().min(1, message);
const optionalText = () =>
  z
    .string()
    .trim()
    .optional()
    .transform((value) => (value === "" ? undefined : value));

export const createCustomerSchema = z
  .object({
    isForeignCompany: z.boolean().default(false),
    country: requiredText(),
    legalName: requiredText(),
    displayName: requiredText(),
    taxId: requiredText(),
    phone: requiredText(),
    website: optionalText(),
    ownerId: z.string().uuid("Obrigatório"),

    postalCode: requiredText(),
    state: requiredText("Estado / State-Province é obrigatório"),
    city: requiredText(),
    complement: optionalText(),
    address: requiredText(),
    number: requiredText(),

    source: requiredText(),
    sourceSpecify: requiredText(),
    status: z.enum(CUSTOMER_STATUSES),
    segment: z.enum(CUSTOMER_SEGMENTS),
    size: z.enum(CUSTOMER_SIZES),
    accountPotential: z.enum(ACCOUNT_POTENTIALS),
    cargoType: z.enum(CARGO_TYPES),
    incoterms: optionalText(),
    estimatedVolume: z.coerce
      .number()
      .int()
      .min(1, "O volume estimado deve ser maior que 0"),
    volumeUnit: requiredText(),
    currency: optionalText(),

    mainRoutes: optionalText(),
    restrictions: optionalText(),
    notes: optionalText(),
  })
  .refine((data) => !(data.country === "BRAZIL" && data.isForeignCompany), {
    message: "Brasil não pode ser selecionado como empresa estrangeira.",
    path: ["isForeignCompany"],
  });
export type CreateCustomerInput = z.output<typeof createCustomerSchema>;
export type CreateCustomerFormInput = z.input<typeof createCustomerSchema>;

export const updateCompanySchema = z
  .object({
    isForeignCompany: z.boolean().default(false),
    country: requiredText(),
    legalName: requiredText(),
    displayName: requiredText(),
    taxId: requiredText(),
    phone: requiredText(),
    website: optionalText(),
    ownerId: z.string().uuid("Obrigatório"),

    postalCode: requiredText(),
    state: requiredText("Estado / State-Province é obrigatório"),
    city: requiredText(),
    complement: optionalText(),
    address: requiredText(),
    number: requiredText(),
  })
  .refine((data) => !(data.country === "BRAZIL" && data.isForeignCompany), {
    message: "Brasil não pode ser selecionado como empresa estrangeira.",
    path: ["isForeignCompany"],
  });
export type UpdateCompanyInput = z.output<typeof updateCompanySchema>;
export type UpdateCompanyFormInput = z.input<typeof updateCompanySchema>;

export const updateProfileSchema = z.object({
  status: z.enum(CUSTOMER_STATUSES).optional(),
  segment: z.enum(CUSTOMER_SEGMENTS).optional(),
  size: z.enum(CUSTOMER_SIZES).optional(),
  accountPotential: z.enum(ACCOUNT_POTENTIALS).optional(),
  cargoType: z.enum(CARGO_TYPES).optional(),
  estimatedVolume: z.coerce
    .number()
    .int()
    .min(1, "O volume estimado deve ser maior que 0")
    .optional(),
  volumeUnit: z.string().optional(),
  currency: z.string().optional(),
  incoterms: z.string().optional(),
  source: z.string().optional(),
  sourceSpecify: z.string().optional(),
  mainRoutes: z.string().optional(),
  restrictions: z.string().optional(),
  notes: z.string().optional(),
});
export type UpdateProfileInput = z.output<typeof updateProfileSchema>;
export type UpdateProfileFormInput = z.input<typeof updateProfileSchema>;
