"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Building2,
  Target,
  UserPlus,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
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
  LEAD_LANGUAGES,
  LEAD_MODALS,
  LEAD_STATUSES,
  LEAD_URGENCIES,
  LEAD_VOLUME_UNITS,
  type CreateLeadFormInput,
  type CreateLeadInput,
  createLeadSchema,
} from "@/server/modules/leads/lead.dto";

const STEPS = ["Empresa", "Contato", "Lead", "Qualificação"];

const STEP_FIELDS: FieldPath<CreateLeadFormInput>[][] = [
  ["country", "taxId", "legalName", "displayName"],
  ["name", "lastName", "email", "phone", "jobTitle"],
  ["status", "operatorId", "source", "urgency", "score"],
  [],
];

const FORM_ID = "create-lead-form";

export function CreateLeadDrawer({
  operators,
  currentUserId,
}: {
  operators: { id: string; fullName: string }[];
  currentUserId: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [checkingCnpj, setCheckingCnpj] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateLeadFormInput, unknown, CreateLeadInput>({
    resolver: zodResolver(createLeadSchema),
    defaultValues: {
      isForeignCompany: false,
      country: "BRAZIL",
      operatorId: currentUserId,
      status: "Novo",
      language: "Português",
    },
  });

  const isForeignCompany = watch("isForeignCompany");
  const taxId = watch("taxId");
  const companyUid = watch("companyUid");

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!taxId || taxId.trim().length < 8) {
      setValue("companyUid", undefined);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setCheckingCnpj(true);
      try {
        const response = await fetch(
          `/api/leads/check-cnpj?cnpj=${encodeURIComponent(taxId)}`
        );
        if (!response.ok) return;
        const body = await response.json();
        if (body.company) {
          setValue("companyUid", body.company.uid);
          setValue("legalName", body.company.legalName);
          setValue("displayName", body.company.displayName);
          toast.success("Empresa encontrada e vinculada com sucesso.");
        } else {
          setValue("companyUid", undefined);
        }
      } finally {
        setCheckingCnpj(false);
      }
    }, 400);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taxId]);

  function closeAndReset() {
    setOpen(false);
    setStep(0);
    reset();
  }

  async function goNext() {
    const valid = await trigger(STEP_FIELDS[step]);
    if (valid) setStep((current) => current + 1);
  }

  async function onSubmit(values: CreateLeadInput) {
    const response = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      toast.error(body?.message ?? "Erro ao adicionar lead. Tente novamente.");
      return;
    }

    toast.success("Lead adicionado com sucesso.");
    closeAndReset();
    router.refresh();
  }

  const isLastStep = step === STEPS.length - 1;
  const isLinkedToExistingCompany = Boolean(companyUid);

  return (
    <>
      <Button className="h-9" onClick={() => setOpen(true)}>
        + Novo
      </Button>

      <Drawer
        open={open}
        onClose={closeAndReset}
        title="Adicionar Lead"
        subtitle="Cadastre um novo lead no CRM"
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
                {isSubmitting ? "Adicionando..." : "Adicionar Lead"}
              </Button>
            )}
          </div>
        }
      >
        <form id={FORM_ID} onSubmit={handleSubmit(onSubmit)}>
          {step === 0 && (
            <div className="space-y-6">
              <Section icon={Building2} title="Dados da empresa">
                <Switch
                  id="isForeignCompany"
                  label="Empresa estrangeira"
                  description="Ative se o lead não é registrado no Brasil"
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

                <Field
                  htmlFor="taxId"
                  label={isForeignCompany ? "Tax ID" : "CNPJ"}
                  required
                  error={errors.taxId?.message}
                >
                  <Input
                    id="taxId"
                    placeholder={isForeignCompany ? "000-00-0000" : "00.000.000/0000-00"}
                    {...register("taxId")}
                  />
                  {checkingCnpj && (
                    <p className="mt-1 text-xs text-navy-500 dark:text-navy-100/70">Buscando empresa...</p>
                  )}
                  {isLinkedToExistingCompany && (
                    <p className="mt-1 text-xs text-status-ativo">
                      Empresa existente vinculada.
                    </p>
                  )}
                </Field>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field
                    htmlFor="legalName"
                    label="Razão social"
                    required
                    error={errors.legalName?.message}
                  >
                    <Input
                      id="legalName"
                      disabled={isLinkedToExistingCompany}
                      {...register("legalName")}
                    />
                  </Field>
                  <Field
                    htmlFor="displayName"
                    label="Nome"
                    required
                    error={errors.displayName?.message}
                  >
                    <Input
                      id="displayName"
                      disabled={isLinkedToExistingCompany}
                      {...register("displayName")}
                    />
                  </Field>
                </div>
              </Section>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6">
              <Section icon={UserPlus} title="Dados de contato">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field
                    htmlFor="name"
                    label="Nome"
                    required
                    error={errors.name?.message}
                  >
                    <Input id="name" {...register("name")} />
                  </Field>
                  <Field
                    htmlFor="lastName"
                    label="Sobrenome"
                    required
                    error={errors.lastName?.message}
                  >
                    <Input id="lastName" {...register("lastName")} />
                  </Field>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field
                    htmlFor="email"
                    label="E-mail"
                    required
                    error={errors.email?.message}
                  >
                    <Input id="email" type="email" {...register("email")} />
                  </Field>
                  <Field
                    htmlFor="phone"
                    label="Celular"
                    required
                    error={errors.phone?.message}
                  >
                    <Input
                      id="phone"
                      placeholder="(00) 00000-0000"
                      {...register("phone")}
                    />
                  </Field>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field htmlFor="workPhone" label="Telefone fixo">
                    <Input
                      id="workPhone"
                      placeholder="(00) 0000-0000"
                      {...register("workPhone")}
                    />
                  </Field>
                  <Field htmlFor="extension" label="Ramal">
                    <Input id="extension" {...register("extension")} />
                  </Field>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field
                    htmlFor="jobTitle"
                    label="Cargo"
                    required
                    error={errors.jobTitle?.message}
                  >
                    <Input id="jobTitle" {...register("jobTitle")} />
                  </Field>
                  <Field htmlFor="birthday" label="Aniversário">
                    <Input id="birthday" type="date" {...register("birthday")} />
                  </Field>
                </div>

                <Field htmlFor="language" label="Idioma">
                  <Select id="language" {...register("language")}>
                    {LEAD_LANGUAGES.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </Select>
                </Field>
              </Section>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <Section icon={Target} title="Qualificação do lead">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field
                    htmlFor="status"
                    label="Status"
                    required
                    error={errors.status?.message}
                  >
                    <Select id="status" {...register("status")}>
                      {LEAD_STATUSES.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </Select>
                  </Field>
                  <Field
                    htmlFor="operatorId"
                    label="Responsável"
                    required
                    error={errors.operatorId?.message}
                  >
                    <Select id="operatorId" {...register("operatorId")}>
                      <option value="">Selecione</option>
                      {operators.map((operator) => (
                        <option key={operator.id} value={operator.id}>
                          {operator.fullName}
                        </option>
                      ))}
                    </Select>
                  </Field>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field
                    htmlFor="source"
                    label="Origem"
                    required
                    error={errors.source?.message}
                  >
                    <Input id="source" {...register("source")} />
                  </Field>
                  <Field htmlFor="campaign" label="Campanha">
                    <Input id="campaign" {...register("campaign")} />
                  </Field>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field
                    htmlFor="urgency"
                    label="Urgência"
                    required
                    error={errors.urgency?.message}
                  >
                    <Select id="urgency" {...register("urgency")}>
                      <option value="">Selecione</option>
                      {LEAD_URGENCIES.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </Select>
                  </Field>
                  <Field
                    htmlFor="score"
                    label="Score"
                    required
                    error={errors.score?.message}
                  >
                    <Input
                      id="score"
                      type="number"
                      min={1}
                      max={100}
                      placeholder="1 a 100"
                      {...register("score")}
                    />
                  </Field>
                </div>
              </Section>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <Section icon={Briefcase} title="Perfil comercial">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <Field htmlFor="currency" label="Moeda">
                    <Select id="currency" {...register("currency")}>
                      <option value="">Selecione</option>
                      <option value="BRL">BRL</option>
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                    </Select>
                  </Field>
                  <Field
                    htmlFor="modal"
                    label="Modal"
                    required
                    error={errors.modal?.message}
                  >
                    <Select id="modal" {...register("modal")}>
                      <option value="">Selecione</option>
                      {LEAD_MODALS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </Select>
                  </Field>
                  <Field
                    htmlFor="volumeUnit"
                    label="Unidade"
                    required
                    error={errors.volumeUnit?.message}
                  >
                    <Select id="volumeUnit" {...register("volumeUnit")}>
                      <option value="">Selecione</option>
                      {LEAD_VOLUME_UNITS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </Select>
                  </Field>
                </div>

                <Field
                  htmlFor="estimatedVolume"
                  label="Volume estimado"
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

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field htmlFor="painIdentified" label="Desafio atual">
                    <Textarea id="painIdentified" rows={3} {...register("painIdentified")} />
                  </Field>
                  <Field htmlFor="interest" label="Interesse">
                    <Textarea id="interest" rows={3} {...register("interest")} />
                  </Field>
                </div>
              </Section>
            </div>
          )}
        </form>
      </Drawer>
    </>
  );
}
