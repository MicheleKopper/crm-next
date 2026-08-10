"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import {
  LEAD_STATUSES,
  LEAD_URGENCIES,
  type UpdateLeadFormInput,
  type UpdateLeadInput,
  updateLeadSchema,
} from "@/server/modules/leads/lead.dto";
import type { LeadDetail } from "@/server/modules/leads/lead.mapper";

export function LeadInfoForm({
  lead,
  operators,
  onSaved,
  onCancel,
}: {
  lead: LeadDetail;
  operators: { id: string; fullName: string }[];
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
      status: lead.status as UpdateLeadInput["status"],
      operatorId: lead.operatorId ?? "",
      source: lead.source,
      campaign: lead.campaign ?? "",
      urgency: lead.urgency as UpdateLeadInput["urgency"],
      score: lead.score,
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
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 gap-4 sm:grid-cols-2"
    >
      <div>
        <Label>Status</Label>
        <Select {...register("status")}>
          {LEAD_STATUSES.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <Label>Responsável</Label>
        <Select {...register("operatorId")}>
          <option value="">Selecione</option>
          {operators.map((operator) => (
            <option key={operator.id} value={operator.id}>
              {operator.fullName}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <Label>Origem</Label>
        <Input {...register("source")} />
      </div>

      <div>
        <Label>Campanha</Label>
        <Input {...register("campaign")} />
      </div>

      <div>
        <Label>Urgência</Label>
        <Select {...register("urgency")}>
          {LEAD_URGENCIES.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <Label>Score</Label>
        <Input type="number" min={1} max={100} {...register("score")} />
      </div>

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
