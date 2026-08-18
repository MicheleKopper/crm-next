"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";
import { Textarea } from "@/components/ui/textarea";
import {
  type CreateProductFormInput,
  type CreateProductInput,
  createProductSchema,
} from "@/server/modules/purchase-orders/purchase-order.dto";
import type { PurchaseOrderDetail } from "@/server/modules/purchase-orders/purchase-order.mapper";

export function EditProductModal({
  poUid,
  product,
  open,
  onClose,
}: {
  poUid: string;
  product: PurchaseOrderDetail["products"][number];
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<CreateProductFormInput, unknown, CreateProductInput>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      description: product.description ?? "",
      quantity: product.quantity,
      price: product.price ?? undefined,
      size: product.size ?? "",
      comments: product.comments ?? "",
      isFlexitank: product.isFlexitank,
    },
  });

  async function onSubmit(values: CreateProductInput) {
    const response = await fetch(
      `/api/purchase-orders/${poUid}/products/${product.uid}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      }
    );

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      toast.error(body?.message ?? "Erro ao editar produto.");
      return;
    }

    toast.success("Produto editado com sucesso.");
    router.refresh();
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title="Editar Produto">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="edit-description">Descrição</Label>
          <Input id="edit-description" {...register("description")} />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <Label htmlFor="edit-quantity">Quantidade</Label>
            <Input id="edit-quantity" type="number" min={1} {...register("quantity")} />
          </div>
          <div>
            <Label htmlFor="edit-size">Tamanho</Label>
            <Input id="edit-size" {...register("size")} />
          </div>
          <div>
            <Label htmlFor="edit-price">Preço</Label>
            <Input
              id="edit-price"
              type="number"
              step="0.01"
              min={0}
              {...register("price")}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            id="edit-isFlexitank"
            type="checkbox"
            {...register("isFlexitank")}
            className="h-4 w-4 rounded border-navy-100 dark:border-navy-700"
          />
          <Label htmlFor="edit-isFlexitank" className="mb-0">
            Este item compõe a cota de flexitanks
          </Label>
        </div>

        <div>
          <Label htmlFor="edit-comments">Comentários</Label>
          <Textarea id="edit-comments" rows={3} {...register("comments")} />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
