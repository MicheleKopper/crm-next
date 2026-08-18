"use client";

import { Boxes, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Drawer } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { FLEXITANK_SIZES } from "@/server/modules/flexitanks/flexitank.dto";

type RangeItem = {
  serialPrefix: string;
  start: number;
  end: number;
  fhbStock: string;
  size: string;
  price: number;
};

const EMPTY_DRAFT = { serialPrefix: "", start: "", end: "", fhbStock: "", size: "", price: "" };

export function AddFlexitanksBatchDrawer({
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
  const [items, setItems] = useState<RangeItem[]>([]);
  const [submitting, setSubmitting] = useState(false);

  function reset() {
    setDraft(EMPTY_DRAFT);
    setItems([]);
  }

  function closeAndReset() {
    onClose();
    reset();
  }

  function addRange() {
    const start = Number(draft.start);
    const end = Number(draft.end);
    const price = Number(draft.price);
    if (!draft.serialPrefix || !draft.size || Number.isNaN(start) || Number.isNaN(end) || end < start) {
      toast.error("Preencha a faixa corretamente.");
      return;
    }
    setItems((prev) => [
      ...prev,
      { serialPrefix: draft.serialPrefix, start, end, fhbStock: draft.fhbStock, size: draft.size, price },
    ]);
    setDraft(EMPTY_DRAFT);
  }

  function removeItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  const totalCount = items.reduce((sum, item) => sum + (item.end - item.start + 1), 0);

  async function handleSubmit() {
    if (items.length === 0) return;
    setSubmitting(true);
    try {
      const response = await fetch("/api/flexitanks/batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ purchaseOrderId: poUid, items }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        toast.error(body?.message ?? "Erro ao adicionar flexitanks.");
        return;
      }

      toast.success("Flexitanks adicionados com sucesso.");
      closeAndReset();
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Drawer
      open={open}
      onClose={closeAndReset}
      title="Adicionar Flexitanks em Lote"
      subtitle="Defina faixas de série e adicione à lista antes de enviar"
      icon={<Boxes size={20} />}
      widthClassName="max-w-2xl"
      footer={
        <div className="flex items-center justify-between">
          <Button type="button" variant="secondary" onClick={closeAndReset}>
            Cancelar
          </Button>
          <Button
            type="button"
            disabled={items.length === 0 || submitting}
            onClick={handleSubmit}
          >
            {submitting ? "Adicionando..." : `Adicionar ${totalCount} flexitank(s)`}
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        <div className="space-y-3 rounded-lg border border-navy-100 p-4 dark:border-navy-700">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div>
              <Label htmlFor="serialPrefix">Prefixo de série</Label>
              <Input
                id="serialPrefix"
                value={draft.serialPrefix}
                onChange={(e) => setDraft((d) => ({ ...d, serialPrefix: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="start">Inicial</Label>
              <Input
                id="start"
                type="number"
                value={draft.start}
                onChange={(e) => setDraft((d) => ({ ...d, start: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="end">Final</Label>
              <Input
                id="end"
                type="number"
                value={draft.end}
                onChange={(e) => setDraft((d) => ({ ...d, end: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div>
              <Label htmlFor="fhbStock">FHB Stock</Label>
              <Input
                id="fhbStock"
                value={draft.fhbStock}
                onChange={(e) => setDraft((d) => ({ ...d, fhbStock: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="size">Tamanho</Label>
              <Select
                id="size"
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
              <Label htmlFor="price">Preço</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={draft.price}
                onChange={(e) => setDraft((d) => ({ ...d, price: e.target.value }))}
              />
            </div>
          </div>

          <Button type="button" variant="secondary" onClick={addRange}>
            Adicionar faixa à lista
          </Button>
        </div>

        {items.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-semibold text-navy-900 dark:text-navy-100">
              {items.length} faixa(s) · {totalCount} flexitank(s)
            </p>
            {items.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-lg border border-navy-100 px-3 py-2 text-sm dark:border-navy-700"
              >
                <span className="text-navy-700 dark:text-navy-100">
                  {item.serialPrefix}
                  {String(item.start).padStart(3, "0")}–{String(item.end).padStart(3, "0")} ·{" "}
                  {item.size} · {item.end - item.start + 1} un.
                </span>
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  aria-label="Remover faixa"
                  className="rounded-lg p-1.5 text-status-perdido hover:bg-status-perdido/10"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </Drawer>
  );
}
