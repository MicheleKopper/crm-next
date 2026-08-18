"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { PurchaseOrderDetail } from "@/server/modules/purchase-orders/purchase-order.mapper";
import {
  type UpdatePurchaseOrderFormInput,
  type UpdatePurchaseOrderInput,
  updatePurchaseOrderSchema,
} from "@/server/modules/purchase-orders/purchase-order.dto";

function toDateInputValue(value: Date | string | null) {
  if (!value) return "";
  return new Date(value).toISOString().slice(0, 10);
}

export function GeneralInfoForm({
  po,
  onSaved,
  onCancel,
}: {
  po: PurchaseOrderDetail;
  onSaved: () => void;
  onCancel: () => void;
}) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<UpdatePurchaseOrderFormInput, unknown, UpdatePurchaseOrderInput>({
    resolver: zodResolver(updatePurchaseOrderSchema),
    defaultValues: {
      poDate: toDateInputValue(po.poDate),
      arrivalDate: toDateInputValue(po.arrivalDate),
      tempAdmissionNumber: po.tempAdmissionNumber ?? "",
      tempAdmissionDate: toDateInputValue(po.tempAdmissionDate),
      clearenceDate: toDateInputValue(po.clearenceDate),
      observations: po.observations ?? "",
    },
  });

  async function onSubmit(values: UpdatePurchaseOrderInput) {
    const response = await fetch(`/api/purchase-orders/${po.uid}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      toast.error(body?.message ?? "Erro ao atualizar a purchase order.");
      return;
    }

    toast.success("Purchase order editada com sucesso.");
    router.refresh();
    onSaved();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="poDate">Data da PO</Label>
          <Input id="poDate" type="date" {...register("poDate")} />
        </div>
        <div>
          <Label htmlFor="arrivalDate">Data de chegada</Label>
          <Input id="arrivalDate" type="date" {...register("arrivalDate")} />
        </div>
        <div>
          <Label htmlFor="tempAdmissionNumber">Admissão temporária (nº)</Label>
          <Input id="tempAdmissionNumber" {...register("tempAdmissionNumber")} />
        </div>
        <div>
          <Label htmlFor="tempAdmissionDate">Admissão temporária (data)</Label>
          <Input id="tempAdmissionDate" type="date" {...register("tempAdmissionDate")} />
        </div>
        <div>
          <Label htmlFor="clearenceDate">Data de liberação</Label>
          <Input id="clearenceDate" type="date" {...register("clearenceDate")} />
        </div>
      </div>

      <div>
        <Label htmlFor="observations">Observações</Label>
        <Textarea id="observations" rows={4} {...register("observations")} />
      </div>

      <div className="flex items-center gap-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Salvando..." : "Salvar"}
        </Button>
        <Button type="button" variant="secondary" disabled={isSubmitting} onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
