"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import type { CustomerDetail } from "@/server/modules/customers/customer.mapper";
import {
  type UpdateCompanyFormInput,
  type UpdateCompanyInput,
  updateCompanySchema,
} from "@/server/modules/customers/customer.dto";

export function CompanyInfoForm({
  customer,
  owners,
  onSaved,
  onCancel,
}: {
  customer: CustomerDetail;
  owners: { id: string; fullName: string }[];
  onSaved: () => void;
  onCancel: () => void;
}) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<UpdateCompanyFormInput, unknown, UpdateCompanyInput>({
    resolver: zodResolver(updateCompanySchema),
    defaultValues: {
      isForeignCompany: customer.isForeignCompany,
      country: customer.country ?? "",
      legalName: customer.legalName,
      displayName: customer.displayName,
      taxId: customer.taxId,
      phone: customer.phone,
      website: customer.website ?? "",
      ownerId: customer.ownerId ?? "",
      postalCode: customer.postalCode ?? "",
      state: customer.state ?? "",
      city: customer.city ?? "",
      complement: customer.complement ?? "",
      address: customer.address ?? "",
      number: customer.number ?? "",
    },
  });

  const isForeignCompany = watch("isForeignCompany");

  async function onSubmit(values: UpdateCompanyInput) {
    const response = await fetch(`/api/customers/${customer.uid}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      toast.error(body?.message ?? "Erro ao atualizar o cliente.");
      return;
    }

    toast.success("Cliente editado com sucesso.");
    router.refresh();
    onSaved();
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 gap-4 sm:grid-cols-2"
    >
      <div className="flex items-center gap-2 sm:col-span-2">
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

      <Field label="País" error={errors.country?.message}>
        <Input {...register("country")} />
      </Field>

      <Field label="Razão Social" error={errors.legalName?.message}>
        <Input {...register("legalName")} />
      </Field>

      <Field label="Nome" error={errors.displayName?.message}>
        <Input {...register("displayName")} />
      </Field>

      <Field
        label={isForeignCompany ? "Tax ID" : "CNPJ"}
        error={errors.taxId?.message}
      >
        <Input {...register("taxId")} />
      </Field>

      <Field label="Telefone" error={errors.phone?.message}>
        <Input {...register("phone")} />
      </Field>

      <Field label="Website">
        <Input {...register("website")} />
      </Field>

      <Field label="Responsável" error={errors.ownerId?.message}>
        <Select {...register("ownerId")}>
          <option value="">Selecione</option>
          {owners.map((owner) => (
            <option key={owner.id} value={owner.id}>
              {owner.fullName}
            </option>
          ))}
        </Select>
      </Field>

      <Field
        label={isForeignCompany ? "Código Postal" : "CEP"}
        error={errors.postalCode?.message}
      >
        <Input {...register("postalCode")} />
      </Field>

      <Field
        label={isForeignCompany ? "State / Province" : "Estado"}
        error={errors.state?.message}
      >
        <Input {...register("state")} />
      </Field>

      <Field label="Cidade" error={errors.city?.message}>
        <Input {...register("city")} />
      </Field>

      <Field label="Endereço" error={errors.address?.message}>
        <Input {...register("address")} />
      </Field>

      <Field label="Número" error={errors.number?.message}>
        <Input {...register("number")} />
      </Field>

      <Field label="Complemento">
        <Input {...register("complement")} />
      </Field>

      <div className="flex items-center gap-2 sm:col-span-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Salvando..." : "Salvar"}
        </Button>
        <Button
          type="button"
          variant="secondary"
          disabled={isSubmitting}
          onClick={onCancel}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label>{label}</Label>
      {children}
      {error && <p className="mt-1 text-xs text-status-perdido">{error}</p>}
    </div>
  );
}
