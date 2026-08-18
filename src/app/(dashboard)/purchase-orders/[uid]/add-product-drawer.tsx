"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { PackagePlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Drawer } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  type CreateProductFormInput,
  type CreateProductInput,
  createProductSchema,
} from "@/server/modules/purchase-orders/purchase-order.dto";

const FORM_ID = "add-product-form";

export function AddProductDrawer({
  poUid,
  open,
  onClose,
}: {
  poUid: string;
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<CreateProductFormInput, unknown, CreateProductInput>({
    resolver: zodResolver(createProductSchema),
    defaultValues: { isFlexitank: false },
  });

  function closeAndReset() {
    onClose();
    reset();
  }

  async function onSubmit(values: CreateProductInput) {
    const response = await fetch(`/api/purchase-orders/${poUid}/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      toast.error(body?.message ?? "Erro ao adicionar produto.");
      return;
    }

    toast.success("Produto adicionado com sucesso.");
    closeAndReset();
    router.refresh();
  }

  return (
    <Drawer
      open={open}
      onClose={closeAndReset}
      title="Adicionar Produto"
      icon={<PackagePlus size={20} />}
      footer={
        <div className="flex items-center justify-between">
          <Button type="button" variant="ghost" onClick={closeAndReset}>
            Cancelar
          </Button>
          <Button type="submit" form={FORM_ID} disabled={isSubmitting}>
            {isSubmitting ? "Adicionando..." : "Adicionar"}
          </Button>
        </div>
      }
    >
      <form id={FORM_ID} onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="description">Descrição</Label>
          <Input id="description" {...register("description")} />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <Label htmlFor="quantity">Quantidade</Label>
            <Input id="quantity" type="number" min={1} {...register("quantity")} />
          </div>
          <div>
            <Label htmlFor="size">Tamanho</Label>
            <Input id="size" {...register("size")} />
          </div>
          <div>
            <Label htmlFor="price">Preço</Label>
            <Input id="price" type="number" step="0.01" min={0} {...register("price")} />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            id="isFlexitank"
            type="checkbox"
            {...register("isFlexitank")}
            className="h-4 w-4 rounded border-navy-100 dark:border-navy-700"
          />
          <Label htmlFor="isFlexitank" className="mb-0">
            Este item compõe a cota de flexitanks
          </Label>
        </div>

        <div>
          <Label htmlFor="comments">Comentários</Label>
          <Textarea id="comments" rows={3} {...register("comments")} />
        </div>
      </form>
    </Drawer>
  );
}
