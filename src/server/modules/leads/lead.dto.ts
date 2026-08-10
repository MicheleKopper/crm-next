import { z } from "zod";

export const LEAD_STATUSES = [
  "Novo",
  "Em contato",
  "Em negociação",
  "Convertido",
  "Perdido",
] as const;

export const LEAD_URGENCIES = ["Baixo", "Médio", "Alto", "Crítico"] as const;

export const LEAD_MODALS = [
  "Aéreo",
  "Rodoviário",
  "Ferroviário",
  "Marítimo",
  "Multimodal",
] as const;

export const LEAD_LANGUAGES = ["Português", "Inglês", "Espanhol"] as const;

export const LEAD_VOLUME_UNITS = [
  "Container",
  "Bill of Lading",
  "TEU",
  "kg",
  "Cubic Meter",
  "Metric Ton",
  "Cubic Meter/Ton",
] as const;

export const LEAD_SORT_FIELDS = [
  "contactName",
  "createdAt",
  "status",
  "operatorFullName",
  "urgency",
] as const;

export const listLeadsQuerySchema = z.object({
  search: z.string().trim().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  offset: z.coerce.number().int().min(0).default(0),
  status: z.string().optional(),
  operatorId: z.string().uuid().optional(),
  modal: z.string().optional(),
  urgency: z.string().optional(),
  sortBy: z.enum(LEAD_SORT_FIELDS).default("createdAt"),
  sortDir: z.enum(["asc", "desc"]).default("desc"),
});
export type ListLeadsQuery = z.infer<typeof listLeadsQuerySchema>;

export const exportLeadsQuerySchema = z.object({
  from: z.string().min(1, "Selecione o período!"),
  until: z.string().min(1, "Selecione o período!"),
});
export type ExportLeadsQuery = z.infer<typeof exportLeadsQuerySchema>;

export const checkCnpjQuerySchema = z.object({
  cnpj: z.string().trim().min(1, "Informe o CNPJ ou Tax ID."),
});
export type CheckCnpjQuery = z.infer<typeof checkCnpjQuerySchema>;

const requiredText = (message = "Obrigatório") => z.string().trim().min(1, message);
const optionalText = () =>
  z
    .string()
    .trim()
    .optional()
    .transform((value) => (value === "" ? undefined : value));
const optionalDate = () =>
  z
    .string()
    .trim()
    .optional()
    .transform((value) => (value ? new Date(value) : undefined));

export const createLeadSchema = z
  .object({
    // Empresa
    isForeignCompany: z.boolean().default(false),
    companyUid: optionalText(),
    country: requiredText(),
    taxId: requiredText(),
    legalName: requiredText(),
    displayName: requiredText(),

    // Contato
    name: requiredText(),
    lastName: requiredText(),
    email: z.string().trim().min(1, "Obrigatório").email("Informe um e-mail válido"),
    phone: requiredText(),
    workPhone: optionalText(),
    extension: optionalText(),
    jobTitle: requiredText(),
    birthday: optionalDate(),
    language: z.enum(LEAD_LANGUAGES).default("Português"),

    // Lead
    status: z.enum(LEAD_STATUSES).default("Novo"),
    operatorId: z.string().uuid("Obrigatório"),
    source: requiredText(),
    campaign: optionalText(),
    urgency: z.enum(LEAD_URGENCIES),
    score: z.coerce
      .number()
      .int()
      .min(1, "O score deve ser maior que 0")
      .max(100, "O score deve ser menor ou igual a 100"),

    // Qualificação
    currency: optionalText(),
    modal: z.enum(LEAD_MODALS),
    estimatedVolume: z.coerce
      .number()
      .int()
      .min(1, "O volume estimado deve ser maior que 0"),
    volumeUnit: requiredText(),
    painIdentified: optionalText(),
    interest: optionalText(),
  })
  .refine((data) => !(data.country === "BRAZIL" && data.isForeignCompany), {
    message: "Brasil não pode ser selecionado como empresa estrangeira.",
    path: ["isForeignCompany"],
  });
export type CreateLeadInput = z.output<typeof createLeadSchema>;
export type CreateLeadFormInput = z.input<typeof createLeadSchema>;

export const updateLeadSchema = z.object({
  status: z.enum(LEAD_STATUSES).optional(),
  operatorId: z.string().uuid().optional(),
  source: z.string().optional(),
  campaign: z.string().optional(),
  urgency: z.enum(LEAD_URGENCIES).optional(),
  score: z.coerce.number().int().min(1).max(100).optional(),
  currency: z.string().optional(),
  modal: z.enum(LEAD_MODALS).optional(),
  estimatedVolume: z.coerce.number().int().min(1).optional(),
  volumeUnit: z.string().optional(),
  painIdentified: z.string().optional(),
  interest: z.string().optional(),
  disqualificationReason: z.string().optional(),
});
export type UpdateLeadInput = z.output<typeof updateLeadSchema>;
export type UpdateLeadFormInput = z.input<typeof updateLeadSchema>;

export const updateLeadContactSchema = z.object({
  name: z.string().trim().min(1).optional(),
  lastName: z.string().trim().min(1).optional(),
  email: z.string().trim().email().optional(),
  phone: z.string().trim().min(1).optional(),
  workPhone: z.string().trim().optional(),
  extension: z.string().trim().optional(),
  jobTitle: z.string().trim().min(1).optional(),
  birthday: optionalDate(),
  language: z.enum(LEAD_LANGUAGES).optional(),
});
export type UpdateLeadContactInput = z.output<typeof updateLeadContactSchema>;
export type UpdateLeadContactFormInput = z.input<typeof updateLeadContactSchema>;
