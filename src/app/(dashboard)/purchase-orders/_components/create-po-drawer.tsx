"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FilePlus2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Drawer } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  type CreatePurchaseOrderFormInput,
  type CreatePurchaseOrderInput,
  createPurchaseOrderSchema,
} from "@/server/modules/purchase-orders/purchase-order.dto";

const FORM_ID = "create-po-form";

export function CreatePoDrawer() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<CreatePurchaseOrderFormInput, unknown, CreatePurchaseOrderInput>({
    resolver: zodResolver(createPurchaseOrderSchema),
  });

  function closeAndReset() {
    setOpen(false);
    reset();
  }

  async function onSubmit(values: CreatePurchaseOrderInput) {
    const response = await fetch("/api/purchase-orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      toast.error(body?.message ?? "Erro ao criar purchase order. Tente novamente.");
      return;
    }

    const result = await response.json();
    toast.success(`Purchase order ${result.poNumber} criada com sucesso.`);
    closeAndReset();
    router.push(`/purchase-orders/${result.uid}`);
  }

  return (
    <>
      <Button className="h-9" onClick={() => setOpen(true)}>
        + Nova PO
      </Button>

      <Drawer
        open={open}
        onClose={closeAndReset}
        title="Nova Purchase Order"
        subtitle="O número da PO é gerado automaticamente"
        icon={<FilePlus2 size={20} />}
        footer={
          <div className="flex items-center justify-between">
            <Button type="button" variant="ghost" onClick={closeAndReset}>
              Cancelar
            </Button>
            <Button type="submit" form={FORM_ID} disabled={isSubmitting}>
              {isSubmitting ? "Criando..." : "Criar Purchase Order"}
            </Button>
          </div>
        }
      >
        <form id={FORM_ID} onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="poDate">Data da PO</Label>
              <Input id="poDate" type="date" {...register("poDate")} />
            </div>
            <div>
              <Label htmlFor="arrivalDate">Data de chegada</Label>
              <Input id="arrivalDate" type="date" {...register("arrivalDate")} />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="tempAdmissionNumber">Admissão temporária (nº)</Label>
              <Input id="tempAdmissionNumber" {...register("tempAdmissionNumber")} />
            </div>
            <div>
              <Label htmlFor="tempAdmissionDate">Admissão temporária (data)</Label>
              <Input
                id="tempAdmissionDate"
                type="date"
                {...register("tempAdmissionDate")}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="observations">Observações</Label>
            <Textarea id="observations" rows={4} {...register("observations")} />
          </div>
        </form>
      </Drawer>
    </>
  );
}
