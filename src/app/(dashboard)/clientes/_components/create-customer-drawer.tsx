"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  NotebookPen,
  Package,
  Phone,
  Route,
  Tag,
  UserCircle,
  UserPlus,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { type FieldPath, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Drawer } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Stepper, WizardField as Field, WizardSection as Section } from "@/components/ui/wizard";
import {
  ACCOUNT_POTENTIALS,
  CARGO_TYPES,
  CUSTOMER_SEGMENTS,
  CUSTOMER_SIZES,
  CUSTOMER_STATUSES,
  type CreateCustomerFormInput,
  type CreateCustomerInput,
  createCustomerSchema,
} from "@/server/modules/customers/customer.dto";

const STEPS = ["Identificação", "Localização", "Perfil Comercial", "Observações"];

const STEP_FIELDS: FieldPath<CreateCustomerFormInput>[][] = [
  ["country", "legalName", "displayName", "taxId", "phone", "ownerId"],
  ["postalCode", "state", "city", "address", "number"],
  [
    "source",
    "sourceSpecify",
    "status",
    "segment",
    "size",
    "accountPotential",
    "cargoType",
    "estimatedVolume",
    "volumeUnit",
  ],
  [],
];

const FORM_ID = "create-customer-form";

export function CreateCustomerDrawer({
  owners,
  currentUserId,
}: {
  owners: { id: string; fullName: string }[];
  currentUserId: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateCustomerFormInput, unknown, CreateCustomerInput>({
    resolver: zodResolver(createCustomerSchema),
    defaultValues: {
      isForeignCompany: false,
      country: "BRAZIL",
      ownerId: currentUserId,
    },
  });

  const isForeignCompany = watch("isForeignCompany");

  function closeAndReset() {
    setOpen(false);
    setStep(0);
    reset();
  }

  async function goNext() {
    const valid = await trigger(STEP_FIELDS[step]);
    if (valid) setStep((current) => current + 1);
  }

  async function onSubmit(values: CreateCustomerInput) {
    const response = await fetch("/api/customers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      toast.error(body?.message ?? "Erro ao adicionar cliente. Tente novamente.");
      return;
    }

    toast.success("Cliente adicionado com sucesso.");
    closeAndReset();
    router.refresh();
  }

  const isLastStep = step === STEPS.length - 1;

  return (
    <>
      <Button className="h-9" onClick={() => setOpen(true)}>
        + Novo
      </Button>

      <Drawer
        open={open}
        onClose={closeAndReset}
        title="Adicionar Cliente"
        subtitle="Cadastre um novo cliente no CRM"
        icon={<UserPlus size={20} />}
        widthClassName="max-w-2xl"
        headerExtra={<Stepper steps={STEPS} current={step} />}
        footer={
          <div className="flex items-center justify-between">
            {step > 0 ? (
              <Button
                key="back"
                type="button"
                variant="secondary"
                onClick={() => setStep((current) => current - 1)}
              >
                <ArrowLeft size={16} />
                Anterior
              </Button>
            ) : (
              <Button
                key="cancel"
                type="button"
                variant="ghost"
                onClick={closeAndReset}
              >
                Cancelar
              </Button>
            )}

            {!isLastStep ? (
              <Button key="next" type="button" onClick={goNext}>
                Próximo
                <ArrowRight size={16} />
              </Button>
            ) : (
              <Button
                key="submit"
                type="submit"
                form={FORM_ID}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Adicionando..." : "Adicionar Cliente"}
              </Button>
            )}
          </div>
        }
      >
        <form id={FORM_ID} onSubmit={handleSubmit(onSubmit)}>
          {step === 0 && (
            <div className="space-y-6">
              <Section icon={UserCircle} title="Dados da empresa">
                <Switch
                  id="isForeignCompany"
                  label="Empresa estrangeira"
                  description="Ative se o cliente não é registrado no Brasil"
                  {...register("isForeignCompany")}
                />

                <Field
                  htmlFor="country"
                  label="País"
                  required
                  error={errors.country?.message}
                >
                  <Input id="country" {...register("country")} />
                </Field>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field
                    htmlFor="legalName"
                    label="Razão Social"
                    required
                    error={errors.legalName?.message}
                  >
                    <Input id="legalName" {...register("legalName")} />
                  </Field>
                  <Field
                    htmlFor="displayName"
                    label="Nome Fantasia"
                    required
                    error={errors.displayName?.message}
                  >
                    <Input id="displayName" {...register("displayName")} />
                  </Field>
                </div>

                <Field
                  htmlFor="taxId"
                  label={isForeignCompany ? "Tax ID" : "CNPJ"}
                  required
                  error={errors.taxId?.message}
                >
                  <Input id="taxId" {...register("taxId")} />
                </Field>
              </Section>

              <Section icon={Phone} title="Contato">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field
                    htmlFor="phone"
                    label="Telefone"
                    required
                    error={errors.phone?.message}
                  >
                    <Input id="phone" {...register("phone")} />
                  </Field>
                  <Field htmlFor="website" label="Website">
                    <Input id="website" {...register("website")} />
                  </Field>
                </div>
              </Section>

              <Section icon={UserCircle} title="Responsável">
                <Field
                  htmlFor="ownerId"
                  label="Responsável"
                  required
                  error={errors.ownerId?.message}
                >
                  <Select id="ownerId" {...register("ownerId")}>
                    <option value="">Selecione</option>
                    {owners.map((owner) => (
                      <option key={owner.id} value={owner.id}>
                        {owner.fullName}
                      </option>
                    ))}
                  </Select>
                </Field>
              </Section>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6">
              <Section icon={MapPin} title="Endereço">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field
                    htmlFor="postalCode"
                    label={isForeignCompany ? "Código Postal" : "CEP"}
                    required
                    error={errors.postalCode?.message}
                  >
                    <Input id="postalCode" {...register("postalCode")} />
                  </Field>
                  <Field
                    htmlFor="state"
                    label={isForeignCompany ? "State / Province" : "Estado"}
                    required
                    error={errors.state?.message}
                  >
                    <Input id="state" {...register("state")} />
                  </Field>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field
                    htmlFor="city"
                    label="Cidade"
                    required
                    error={errors.city?.message}
                  >
                    <Input id="city" {...register("city")} />
                  </Field>
                  <Field
                    htmlFor="number"
                    label="Número"
                    required
                    error={errors.number?.message}
                  >
                    <Input id="number" {...register("number")} />
                  </Field>
                </div>

                <Field
                  htmlFor="address"
                  label="Endereço"
                  required
                  error={errors.address?.message}
                >
                  <Input id="address" {...register("address")} />
                </Field>

                <Field htmlFor="complement" label="Complemento">
                  <Input id="complement" {...register("complement")} />
                </Field>
              </Section>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <Section icon={Route} title="Origem">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field
                    htmlFor="source"
                    label="Origem"
                    required
                    error={errors.source?.message}
                  >
                    <Select id="source" {...register("source")}>
                      <option value="">Selecione</option>
                      <option value="Indicação">Indicação</option>
                      <option value="Evento">Evento</option>
                      <option value="Online">Online</option>
                      <option value="Outros">Outros</option>
                    </Select>
                  </Field>
                  <Field
                    htmlFor="sourceSpecify"
                    label="Especifique a Origem"
                    required
                    error={errors.sourceSpecify?.message}
                  >
                    <Input id="sourceSpecify" {...register("sourceSpecify")} />
                  </Field>
                </div>
              </Section>

              <Section icon={Tag} title="Classificação">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field
                    htmlFor="status"
                    label="Status"
                    required
                    error={errors.status?.message}
                  >
                    <Select id="status" {...register("status")}>
                      <option value="">Selecione</option>
                      {CUSTOMER_STATUSES.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </Select>
                  </Field>
                  <Field
                    htmlFor="segment"
                    label="Segmento"
                    required
                    error={errors.segment?.message}
                  >
                    <Select id="segment" {...register("segment")}>
                      <option value="">Selecione</option>
                      {CUSTOMER_SEGMENTS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </Select>
                  </Field>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field
                    htmlFor="size"
                    label="Porte"
                    required
                    error={errors.size?.message}
                  >
                    <Select id="size" {...register("size")}>
                      <option value="">Selecione</option>
                      {CUSTOMER_SIZES.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </Select>
                  </Field>
                  <Field
                    htmlFor="accountPotential"
                    label="Potencial da Conta"
                    required
                    error={errors.accountPotential?.message}
                  >
                    <Select
                      id="accountPotential"
                      {...register("accountPotential")}
                    >
                      <option value="">Selecione</option>
                      {ACCOUNT_POTENTIALS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </Select>
                  </Field>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field
                    htmlFor="cargoType"
                    label="Tipo de Carga"
                    required
                    error={errors.cargoType?.message}
                  >
                    <Select id="cargoType" {...register("cargoType")}>
                      <option value="">Selecione</option>
                      {CARGO_TYPES.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </Select>
                  </Field>
                  <Field htmlFor="incoterms" label="Incoterms">
                    <Select id="incoterms" {...register("incoterms")}>
                      <option value="">Selecione</option>
                      {[
                        "EXW",
                        "FCA",
                        "FAS",
                        "FOB",
                        "CPT",
                        "CIP",
                        "CFR",
                        "CIF",
                        "DAP",
                        "DPU",
                        "DDP",
                      ].map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </Select>
                  </Field>
                </div>
              </Section>

              <Section icon={Package} title="Volume estimado">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <Field
                    htmlFor="estimatedVolume"
                    label="Volume Estimado"
                    required
                    error={errors.estimatedVolume?.message}
                  >
                    <Input
                      id="estimatedVolume"
                      type="number"
                      min={1}
                      {...register("estimatedVolume")}
                    />
                  </Field>
                  <Field
                    htmlFor="volumeUnit"
                    label="Unidade"
                    required
                    error={errors.volumeUnit?.message}
                  >
                    <Select id="volumeUnit" {...register("volumeUnit")}>
                      <option value="">Selecione</option>
                      {[
                        "Container",
                        "Bill of Lading",
                        "TEU",
                        "kg",
                        "Cubic Meter (CBM)",
                        "Metric Ton",
                        "CBM/Ton",
                      ].map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </Select>
                  </Field>
                  <Field htmlFor="currency" label="Moeda">
                    <Select id="currency" {...register("currency")}>
                      <option value="">Selecione</option>
                      <option value="BRL">BRL</option>
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                    </Select>
                  </Field>
                </div>
              </Section>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <Section icon={Route} title="Detalhes operacionais">
                <Field htmlFor="mainRoutes" label="Rotas Principais">
                  <Input
                    id="mainRoutes"
                    placeholder="Ex: SHA-ITJ, MIA-GRU"
                    {...register("mainRoutes")}
                  />
                </Field>
                <Field htmlFor="restrictions" label="Restrições Operacionais">
                  <Textarea id="restrictions" rows={3} {...register("restrictions")} />
                </Field>
              </Section>

              <Section icon={NotebookPen} title="Notas">
                <Field htmlFor="notes" label="Observações">
                  <Textarea
                    id="notes"
                    rows={4}
                    placeholder="Adicione observações sobre o cliente (opcional)"
                    {...register("notes")}
                  />
                </Field>
              </Section>
            </div>
          )}
        </form>
      </Drawer>
    </>
  );
}

