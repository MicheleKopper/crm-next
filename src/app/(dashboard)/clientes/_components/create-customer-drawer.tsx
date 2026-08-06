"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { type FieldPath, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Drawer } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
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

  return (
    <>
      <Button onClick={() => setOpen(true)}>+ Add Novo</Button>

      <Drawer open={open} onClose={closeAndReset} title="Adicionar Cliente">
        <div className="flex gap-6">
          <ul className="w-40 flex-shrink-0 space-y-3 text-sm">
            {STEPS.map((label, index) => (
              <li
                key={label}
                className={cn(
                  "font-medium text-navy-500/50",
                  index === step && "text-navy-900",
                  index < step && "text-navy-500"
                )}
              >
                {label}
              </li>
            ))}
          </ul>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex-1 space-y-4"
          >
            {step === 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <input
                    id="isForeignCompany"
                    type="checkbox"
                    {...register("isForeignCompany")}
                    className="h-4 w-4 rounded border-navy-100"
                  />
                  <Label htmlFor="isForeignCompany" className="mb-0">
                    Empresa Estrangeira
                  </Label>
                </div>

                <div>
                  <Label htmlFor="country">País</Label>
                  <Input id="country" {...register("country")} />
                  <FieldError message={errors.country?.message} />
                </div>

                <div>
                  <Label htmlFor="legalName">Razão Social</Label>
                  <Input id="legalName" {...register("legalName")} />
                  <FieldError message={errors.legalName?.message} />
                </div>

                <div>
                  <Label htmlFor="displayName">Nome</Label>
                  <Input id="displayName" {...register("displayName")} />
                  <FieldError message={errors.displayName?.message} />
                </div>

                <div>
                  <Label htmlFor="taxId">
                    {isForeignCompany ? "Tax ID" : "CNPJ"}
                  </Label>
                  <Input id="taxId" {...register("taxId")} />
                  <FieldError message={errors.taxId?.message} />
                </div>

                <div>
                  <Label htmlFor="phone">Telefone</Label>
                  <Input id="phone" {...register("phone")} />
                  <FieldError message={errors.phone?.message} />
                </div>

                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input id="website" {...register("website")} />
                </div>

                <div>
                  <Label htmlFor="ownerId">Responsável</Label>
                  <Select id="ownerId" {...register("ownerId")}>
                    <option value="">Selecione</option>
                    {owners.map((owner) => (
                      <option key={owner.id} value={owner.id}>
                        {owner.fullName}
                      </option>
                    ))}
                  </Select>
                  <FieldError message={errors.ownerId?.message} />
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="postalCode">
                    {isForeignCompany ? "Código Postal" : "CEP"}
                  </Label>
                  <Input id="postalCode" {...register("postalCode")} />
                  <FieldError message={errors.postalCode?.message} />
                </div>

                <div>
                  <Label htmlFor="state">
                    {isForeignCompany ? "State / Province" : "Estado"}
                  </Label>
                  <Input id="state" {...register("state")} />
                  <FieldError message={errors.state?.message} />
                </div>

                <div>
                  <Label htmlFor="city">Cidade</Label>
                  <Input id="city" {...register("city")} />
                  <FieldError message={errors.city?.message} />
                </div>

                <div>
                  <Label htmlFor="address">Endereço</Label>
                  <Input id="address" {...register("address")} />
                  <FieldError message={errors.address?.message} />
                </div>

                <div>
                  <Label htmlFor="number">Número</Label>
                  <Input id="number" {...register("number")} />
                  <FieldError message={errors.number?.message} />
                </div>

                <div>
                  <Label htmlFor="complement">Complemento</Label>
                  <Input id="complement" {...register("complement")} />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="source">Origem</Label>
                  <Select id="source" {...register("source")}>
                    <option value="">Selecione</option>
                    <option value="Indicação">Indicação</option>
                    <option value="Evento">Evento</option>
                    <option value="Online">Online</option>
                    <option value="Outros">Outros</option>
                  </Select>
                  <FieldError message={errors.source?.message} />
                </div>

                <div>
                  <Label htmlFor="sourceSpecify">Especifique a Origem</Label>
                  <Input id="sourceSpecify" {...register("sourceSpecify")} />
                  <FieldError message={errors.sourceSpecify?.message} />
                </div>

                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select id="status" {...register("status")}>
                    <option value="">Selecione</option>
                    {CUSTOMER_STATUSES.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </Select>
                  <FieldError message={errors.status?.message} />
                </div>

                <div>
                  <Label htmlFor="segment">Segmento</Label>
                  <Select id="segment" {...register("segment")}>
                    <option value="">Selecione</option>
                    {CUSTOMER_SEGMENTS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </Select>
                  <FieldError message={errors.segment?.message} />
                </div>

                <div>
                  <Label htmlFor="size">Porte</Label>
                  <Select id="size" {...register("size")}>
                    <option value="">Selecione</option>
                    {CUSTOMER_SIZES.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </Select>
                  <FieldError message={errors.size?.message} />
                </div>

                <div>
                  <Label htmlFor="accountPotential">Potencial da Conta</Label>
                  <Select id="accountPotential" {...register("accountPotential")}>
                    <option value="">Selecione</option>
                    {ACCOUNT_POTENTIALS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </Select>
                  <FieldError message={errors.accountPotential?.message} />
                </div>

                <div>
                  <Label htmlFor="cargoType">Tipo de Carga</Label>
                  <Select id="cargoType" {...register("cargoType")}>
                    <option value="">Selecione</option>
                    {CARGO_TYPES.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </Select>
                  <FieldError message={errors.cargoType?.message} />
                </div>

                <div>
                  <Label htmlFor="incoterms">Incoterms</Label>
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
                </div>

                <div>
                  <Label htmlFor="estimatedVolume">Volume Estimado</Label>
                  <Input
                    id="estimatedVolume"
                    type="number"
                    min={1}
                    {...register("estimatedVolume")}
                  />
                  <FieldError message={errors.estimatedVolume?.message} />
                </div>

                <div>
                  <Label htmlFor="volumeUnit">Unidade</Label>
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
                  <FieldError message={errors.volumeUnit?.message} />
                </div>

                <div>
                  <Label htmlFor="currency">Moeda</Label>
                  <Select id="currency" {...register("currency")}>
                    <option value="">Selecione</option>
                    <option value="BRL">BRL</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                  </Select>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="mainRoutes">Rotas Principais</Label>
                  <Input
                    id="mainRoutes"
                    placeholder="Ex: SHA-ITJ, MIA-GRU"
                    {...register("mainRoutes")}
                  />
                </div>

                <div>
                  <Label htmlFor="restrictions">Restrições Operacionais</Label>
                  <Textarea
                    id="restrictions"
                    rows={3}
                    {...register("restrictions")}
                  />
                </div>

                <div>
                  <Label htmlFor="notes">Observações</Label>
                  <Textarea id="notes" rows={4} {...register("notes")} />
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-4">
              {step > 0 ? (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setStep((current) => current - 1)}
                >
                  Anterior
                </Button>
              ) : (
                <Button type="button" variant="ghost" onClick={closeAndReset}>
                  Cancelar
                </Button>
              )}

              {step < STEPS.length - 1 ? (
                <Button type="button" onClick={goNext}>
                  Próximo
                </Button>
              ) : (
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Adicionando..." : "Adicionar"}
                </Button>
              )}
            </div>
          </form>
        </div>
      </Drawer>
    </>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-status-perdido">{message}</p>;
}
