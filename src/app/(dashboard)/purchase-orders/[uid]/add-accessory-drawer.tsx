"use client";

import { PackagePlus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Drawer } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import {
  ACCESSORY_TYPES,
  ACCESSORY_TYPE_LABELS,
} from "@/server/modules/purchase-orders/purchase-order.dto";

type HeatingPadRange = { codePrefix: string; start: number; end: number; quantityKit: number };

const EMPTY_RANGE_DRAFT = { codePrefix: "", start: "", end: "", quantityKit: "" };

export function AddAccessoryDrawer({
  poUid,
  open,
  onClose,
}: {
  poUid: string;
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [type, setType] = useState<(typeof ACCESSORY_TYPES)[number]>("heating_pad");
  const [antiBulgingKits, setAntiBulgingKits] = useState("");
  const [rangeDraft, setRangeDraft] = useState(EMPTY_RANGE_DRAFT);
  const [items, setItems] = useState<HeatingPadRange[]>([]);
  const [submitting, setSubmitting] = useState(false);

  function reset() {
    setType("heating_pad");
    setAntiBulgingKits("");
    setRangeDraft(EMPTY_RANGE_DRAFT);
    setItems([]);
  }

  function closeAndReset() {
    onClose();
    reset();
  }

  function addRange() {
    const start = Number(rangeDraft.start);
    const end = Number(rangeDraft.end);
    const quantityKit = Number(rangeDraft.quantityKit);
    if (!rangeDraft.codePrefix || Number.isNaN(start) || Number.isNaN(end) || end < start || Number.isNaN(quantityKit)) {
      toast.error("Preencha a faixa corretamente.");
      return;
    }
    setItems((prev) => [...prev, { codePrefix: rangeDraft.codePrefix, start, end, quantityKit }]);
    setRangeDraft(EMPTY_RANGE_DRAFT);
  }

  function removeItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit() {
    const body =
      type === "anti_bulging_bars"
        ? { type, quantityKit: Number(antiBulgingKits) }
        : { type, items };

    if (type === "anti_bulging_bars" && (!antiBulgingKits || Number.isNaN(Number(antiBulgingKits)))) {
      toast.error("Informe a quantidade de kits.");
      return;
    }
    if (type === "heating_pad" && items.length === 0) {
      toast.error("Adicione ao menos uma faixa.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`/api/purchase-orders/${poUid}/accessories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const responseBody = await response.json().catch(() => null);
        toast.error(responseBody?.message ?? "Erro ao adicionar acessório(s).");
        return;
      }

      toast.success("Acessório(s) adicionado(s) com sucesso.");
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
      title="Adicionar Acessório"
      icon={<PackagePlus size={20} />}
      widthClassName="max-w-2xl"
      footer={
        <div className="flex items-center justify-between">
          <Button type="button" variant="secondary" onClick={closeAndReset}>
            Cancelar
          </Button>
          <Button type="button" disabled={submitting} onClick={handleSubmit}>
            {submitting ? "Adicionando..." : "Adicionar"}
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        <div>
          <Label htmlFor="accessory-type">Tipo</Label>
          <Select
            id="accessory-type"
            value={type}
            onChange={(e) => setType(e.target.value as (typeof ACCESSORY_TYPES)[number])}
          >
            {ACCESSORY_TYPES.map((option) => (
              <option key={option} value={option}>
                {ACCESSORY_TYPE_LABELS[option]}
              </option>
            ))}
          </Select>
        </div>

        {type === "anti_bulging_bars" ? (
          <div>
            <Label htmlFor="quantityKit">Quantidade de kits (6 barras por kit)</Label>
            <Input
              id="quantityKit"
              type="number"
              min={1}
              value={antiBulgingKits}
              onChange={(e) => setAntiBulgingKits(e.target.value)}
            />
          </div>
        ) : (
          <>
            <div className="space-y-3 rounded-lg border border-navy-100 p-4 dark:border-navy-700">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <Label htmlFor="codePrefix">Prefixo do código</Label>
                  <Input
                    id="codePrefix"
                    value={rangeDraft.codePrefix}
                    onChange={(e) => setRangeDraft((d) => ({ ...d, codePrefix: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="quantityKitRange">Quantidade de kits</Label>
                  <Input
                    id="quantityKitRange"
                    type="number"
                    min={1}
                    value={rangeDraft.quantityKit}
                    onChange={(e) => setRangeDraft((d) => ({ ...d, quantityKit: e.target.value }))}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <Label htmlFor="rangeStart">Inicial</Label>
                  <Input
                    id="rangeStart"
                    type="number"
                    value={rangeDraft.start}
                    onChange={(e) => setRangeDraft((d) => ({ ...d, start: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="rangeEnd">Final</Label>
                  <Input
                    id="rangeEnd"
                    type="number"
                    value={rangeDraft.end}
                    onChange={(e) => setRangeDraft((d) => ({ ...d, end: e.target.value }))}
                  />
                </div>
              </div>
              <Button type="button" variant="secondary" onClick={addRange}>
                Adicionar faixa à lista
              </Button>
            </div>

            {items.length > 0 && (
              <div className="space-y-2">
                {items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg border border-navy-100 px-3 py-2 text-sm dark:border-navy-700"
                  >
                    <span className="text-navy-700 dark:text-navy-100">
                      {item.codePrefix}
                      {String(item.start).padStart(3, "0")}–{String(item.end).padStart(3, "0")} ·{" "}
                      {item.end - item.start + 1} un.
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
          </>
        )}
      </div>
    </Drawer>
  );
}
