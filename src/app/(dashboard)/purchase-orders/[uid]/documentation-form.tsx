"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

export function DocumentationForm({
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
      proformaNumber: po.proformaNumber ?? "",
      proformaDate: toDateInputValue(po.proformaDate),
      packingListNumber: po.packingListNumber ?? "",
      packingListDate: toDateInputValue(po.packingListDate),
      blNumber: po.blNumber ?? "",
      blDate: toDateInputValue(po.blDate),
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
      toast.error(body?.message ?? "Erro ao atualizar a documentação.");
      return;
    }

    toast.success("Documentação editada com sucesso.");
    router.refresh();
    onSaved();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="proformaNumber">Proforma (nº)</Label>
          <Input id="proformaNumber" {...register("proformaNumber")} />
        </div>
        <div>
          <Label htmlFor="proformaDate">Proforma (data)</Label>
          <Input id="proformaDate" type="date" {...register("proformaDate")} />
        </div>
        <div>
          <Label htmlFor="packingListNumber">Packing List (nº)</Label>
          <Input id="packingListNumber" {...register("packingListNumber")} />
        </div>
        <div>
          <Label htmlFor="packingListDate">Packing List (data)</Label>
          <Input id="packingListDate" type="date" {...register("packingListDate")} />
        </div>
        <div>
          <Label htmlFor="blNumber">BL (nº)</Label>
          <Input id="blNumber" {...register("blNumber")} />
        </div>
        <div>
          <Label htmlFor="blDate">BL (data)</Label>
          <Input id="blDate" type="date" {...register("blDate")} />
        </div>
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
