"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";
import { Select } from "@/components/ui/select";
import { FLEXITANK_SIZES } from "@/server/modules/flexitanks/flexitank.dto";

const EMPTY_DRAFT = { serialNumber: "", fhbStock: "", size: "", price: "" };

export function AddFlexitankUniqueModal({
  poUid,
  open,
  onClose,
}: {
  poUid: string;
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [draft, setDraft] = useState(EMPTY_DRAFT);
  const [submitting, setSubmitting] = useState(false);

  function closeAndReset() {
    onClose();
    setDraft(EMPTY_DRAFT);
  }

  async function handleSubmit() {
    const price = Number(draft.price);
    if (!draft.serialNumber || !draft.size || Number.isNaN(price)) {
      toast.error("Preencha os campos corretamente.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/flexitanks/unique", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          purchaseOrderId: poUid,
          items: [
            {
              serialNumber: draft.serialNumber,
              fhbStock: draft.fhbStock,
              size: draft.size,
              price,
            },
          ],
        }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        toast.error(body?.message ?? "Erro ao adicionar flexitank.");
        return;
      }

      toast.success("Flexitank adicionado com sucesso.");
      closeAndReset();
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal open={open} onClose={closeAndReset} title="Adicionar Flexitank Único">
      <div className="space-y-4">
        <div>
          <Label htmlFor="unique-serial">Número de série</Label>
          <Input
            id="unique-serial"
            value={draft.serialNumber}
            onChange={(e) => setDraft((d) => ({ ...d, serialNumber: e.target.value }))}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <Label htmlFor="unique-fhb">FHB Stock</Label>
            <Input
              id="unique-fhb"
              value={draft.fhbStock}
              onChange={(e) => setDraft((d) => ({ ...d, fhbStock: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="unique-size">Tamanho</Label>
            <Select
              id="unique-size"
              value={draft.size}
              onChange={(e) => setDraft((d) => ({ ...d, size: e.target.value }))}
            >
              <option value="">Selecione</option>
              {FLEXITANK_SIZES.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="unique-price">Preço</Label>
            <Input
              id="unique-price"
              type="number"
              step="0.01"
              value={draft.price}
              onChange={(e) => setDraft((d) => ({ ...d, price: e.target.value }))}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={closeAndReset}>
            Cancelar
          </Button>
          <Button type="button" disabled={submitting} onClick={handleSubmit}>
            {submitting ? "Adicionando..." : "Adicionar"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
