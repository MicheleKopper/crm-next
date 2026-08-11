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
  LEAD_MODALS,
  LEAD_VOLUME_UNITS,
  type UpdateLeadFormInput,
  type UpdateLeadInput,
  updateLeadSchema,
} from "@/server/modules/leads/lead.dto";
import type { LeadDetail } from "@/server/modules/leads/lead.mapper";

export function QualificationForm({
  lead,
  onSaved,
  onCancel,
}: {
  lead: LeadDetail;
  onSaved: () => void;
  onCancel: () => void;
}) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<UpdateLeadFormInput, unknown, UpdateLeadInput>({
    resolver: zodResolver(updateLeadSchema),
    defaultValues: {
      modal: lead.modal as UpdateLeadInput["modal"],
      estimatedVolume: lead.estimatedVolume,
      volumeUnit: lead.volumeUnit,
      currency: lead.currency ?? "",
      painIdentified: lead.painIdentified ?? "",
      interest: lead.interest ?? "",
      disqualificationReason: lead.disqualificationReason ?? "",
    },
  });

  async function onSubmit(values: UpdateLeadInput) {
    const response = await fetch(`/api/leads/${lead.uid}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      toast.error(body?.message ?? "Erro ao atualizar o lead.");
      return;
    }

    toast.success("Lead editado com sucesso.");
    router.refresh();
    onSaved();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <Label>Modal</Label>
          <Select {...register("modal")}>
            {LEAD_MODALS.map((option) => (
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
            {LEAD_VOLUME_UNITS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
        </div>
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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <Label>Desafio atual</Label>
          <Textarea rows={3} {...register("painIdentified")} />
        </div>
        <div>
          <Label>Interesse</Label>
          <Textarea rows={3} {...register("interest")} />
        </div>
        <div>
          <Label>Motivo de desqualificação</Label>
          <Textarea rows={3} {...register("disqualificationReason")} />
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
