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
  FLEXITANK_SIZES,
  type UpdateFlexitankFormInput,
  type UpdateFlexitankInput,
  updateFlexitankSchema,
} from "@/server/modules/flexitanks/flexitank.dto";
import type { FlexitankDetail } from "@/server/modules/flexitanks/flexitank.mapper";

export function ContainerForm({
  flexitank,
  onSaved,
  onCancel,
}: {
  flexitank: FlexitankDetail;
  onSaved: () => void;
  onCancel: () => void;
}) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<UpdateFlexitankFormInput, unknown, UpdateFlexitankInput>({
    resolver: zodResolver(updateFlexitankSchema),
    defaultValues: {
      size: flexitank.size as UpdateFlexitankInput["size"],
      price: flexitank.price,
    },
  });

  async function onSubmit(values: UpdateFlexitankInput) {
    const response = await fetch(`/api/flexitanks/${flexitank.uid}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      toast.error(body?.message ?? "Erro ao atualizar o flexitank.");
      return;
    }

    toast.success("Flexitank editado com sucesso.");
    router.refresh();
    onSaved();
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 gap-4 sm:grid-cols-2"
    >
      <div>
        <Label>Tamanho</Label>
        <Select {...register("size")}>
          {FLEXITANK_SIZES.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <Label>Preço</Label>
        <Input type="number" min={0} step="0.01" {...register("price")} />
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
