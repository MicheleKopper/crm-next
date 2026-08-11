"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  ACCOUNT_POTENTIALS,
  CARGO_TYPES,
  CUSTOMER_SEGMENTS,
  CUSTOMER_SIZES,
  CUSTOMER_STATUSES,
  type UpdateProfileFormInput,
  type UpdateProfileInput,
  updateProfileSchema,
} from "@/server/modules/customers/customer.dto";
import type { CustomerDetail } from "@/server/modules/customers/customer.mapper";

export function CommercialProfileForm({
  customer,
  onSaved,
  onCancel,
}: {
  customer: CustomerDetail;
  onSaved: () => void;
  onCancel: () => void;
}) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<UpdateProfileFormInput, unknown, UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      status: (customer.status as UpdateProfileInput["status"]) ?? undefined,
      segment: (customer.segment as UpdateProfileInput["segment"]) ?? undefined,
      size: (customer.size as UpdateProfileInput["size"]) ?? undefined,
      accountPotential:
        (customer.accountPotential as UpdateProfileInput["accountPotential"]) ??
        undefined,
      cargoType: (customer.cargoType as UpdateProfileInput["cargoType"]) ?? undefined,
      estimatedVolume: customer.estimatedVolume ?? undefined,
      volumeUnit: customer.volumeUnit ?? "",
      currency: customer.currency ?? "",
      incoterms: customer.incoterms ?? "",
      source: customer.source ?? "",
      sourceSpecify: customer.sourceSpecify ?? "",
      mainRoutes: customer.mainRoutes ?? "",
      restrictions: customer.restrictions ?? "",
      notes: customer.notes ?? "",
    },
  });

  async function onSubmit(values: UpdateProfileInput) {
    const response = await fetch(`/api/customers/${customer.uid}/profile`, {
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label>Origem</Label>
          <Select {...register("source")}>
            <option value="">Selecione</option>
            <option value="Indicação">Indicação</option>
            <option value="Evento">Evento</option>
            <option value="Online">Online</option>
            <option value="Outros">Outros</option>
          </Select>
        </div>

        <div>
          <Label>Especifique a origem</Label>
          <Input {...register("sourceSpecify")} />
        </div>

        <div>
          <Label>Status</Label>
          <Select {...register("status")}>
            <option value="">Selecione</option>
            {CUSTOMER_STATUSES.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <Label>Segmento</Label>
          <Select {...register("segment")}>
            <option value="">Selecione</option>
            {CUSTOMER_SEGMENTS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <Label>Porte</Label>
          <Select {...register("size")}>
            <option value="">Selecione</option>
            {CUSTOMER_SIZES.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <Label>Potencial da conta</Label>
          <Select {...register("accountPotential")}>
            <option value="">Selecione</option>
            {ACCOUNT_POTENTIALS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <Label>Tipo de carga</Label>
          <Select {...register("cargoType")}>
            <option value="">Selecione</option>
            {CARGO_TYPES.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <Label>Incoterms</Label>
          <Select {...register("incoterms")}>
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
          <Label>Volume estimado</Label>
          <Input type="number" min={1} {...register("estimatedVolume")} />
        </div>

        <div>
          <Label>Unidade</Label>
          <Select {...register("volumeUnit")}>
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
        </div>

        <div>
          <Label>Moeda</Label>
          <Select {...register("currency")}>
            <option value="">Selecione</option>
            <option value="BRL">BRL</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Label>Rotas principais</Label>
          <Input placeholder="Ex: SHA-ITJ, MIA-GRU" {...register("mainRoutes")} />
        </div>

        <div>
          <Label>Restrições operacionais</Label>
          <Textarea rows={3} {...register("restrictions")} />
        </div>

        <div>
          <Label>Observações</Label>
          <Textarea rows={4} {...register("notes")} />
        </div>
      </div>

      <div className="flex items-center gap-2">
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
