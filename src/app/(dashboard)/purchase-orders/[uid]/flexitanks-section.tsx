"use client";

import { Boxes, CheckCircle2, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { FlexitankStatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { PurchaseOrderDetail } from "@/server/modules/purchase-orders/purchase-order.mapper";

import { AddFlexitankUniqueModal } from "./add-flexitank-unique-modal";
import { AddFlexitanksBatchDrawer } from "./add-flexitanks-batch-drawer";

const COLUMNS = ["Série", "FHB Stock", "Tamanho", "Status", "Comentário"];

export function FlexitanksSection({
  po,
  canCreate,
  canDelete,
  canSetAvailable,
}: {
  po: PurchaseOrderDetail;
  canCreate: boolean;
  canDelete: boolean;
  canSetAvailable: boolean;
}) {
  const router = useRouter();
  const [batchOpen, setBatchOpen] = useState(false);
  const [uniqueOpen, setUniqueOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);

  const waitingCount = po.flexitanks.filter((f) => f.status === "Waiting").length;

  function toggle(uid: string) {
    setSelected((prev) =>
      prev.includes(uid) ? prev.filter((id) => id !== uid) : [...prev, uid]
    );
  }

  async function handleDeleteSelected() {
    if (selected.length === 0) return;
    setBusy(true);
    try {
      const params = new URLSearchParams({ uids: selected.join(",") });
      const response = await fetch(`/api/flexitanks?${params.toString()}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const body = await response.json().catch(() => null);
        toast.error(body?.message ?? "Erro ao excluir flexitanks.");
        return;
      }
      toast.success("Flexitank(s) excluído(s) com sucesso.");
      setSelected([]);
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  async function handleSetAvailable() {
    setBusy(true);
    try {
      const response = await fetch("/api/flexitanks/set-available", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ purchaseOrderId: po.uid }),
      });
      if (!response.ok) {
        const body = await response.json().catch(() => null);
        toast.error(body?.message ?? "Erro ao liberar flexitanks.");
        return;
      }
      toast.success("Flexitank(s) liberado(s) com sucesso.");
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="rounded-xl bg-white p-6 shadow-sm dark:bg-navy-900">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 border-l-4 border-navy-900 pl-3 dark:border-navy-100">
          <Boxes size={16} className="text-navy-900 dark:text-navy-100" />
          <h2 className="text-base font-bold text-navy-900 dark:text-navy-100">
            Flexitanks
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {selected.length > 0 && canDelete && (
            <Button
              variant="danger"
              className="h-9"
              disabled={busy}
              onClick={handleDeleteSelected}
            >
              <Trash2 size={16} />
              Excluir selecionados ({selected.length})
            </Button>
          )}
          {canSetAvailable && waitingCount > 0 && (
            <Button
              variant="secondary"
              className="h-9"
              disabled={busy}
              onClick={handleSetAvailable}
            >
              <CheckCircle2 size={16} />
              Marcar Disponíveis ({waitingCount})
            </Button>
          )}
          {canCreate && (
            <>
              <Button variant="secondary" className="h-9" onClick={() => setUniqueOpen(true)}>
                <Plus size={16} />
                Único
              </Button>
              <Button className="h-9" onClick={() => setBatchOpen(true)}>
                <Plus size={16} />
                Em Lote
              </Button>
            </>
          )}
        </div>
      </div>

      {po.flexitanks.length === 0 ? (
        <p className="py-6 text-center text-sm text-navy-500 dark:text-navy-100/70">
          Nenhum flexitank cadastrado.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-navy-100 dark:border-navy-700">
                <th className="w-8 py-2 pr-2" />
                {COLUMNS.map((column) => (
                  <th
                    key={column}
                    className="whitespace-nowrap py-2 pr-4 text-xs font-semibold uppercase tracking-wide text-navy-400 dark:text-navy-100/40"
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-100 dark:divide-navy-700">
              {po.flexitanks.map((flexitank) => (
                <tr key={flexitank.uid} className="hover:bg-navy-50 dark:hover:bg-navy-800">
                  <td className="py-3 pr-2">
                    {canDelete && (
                      <input
                        type="checkbox"
                        checked={selected.includes(flexitank.uid)}
                        onChange={() => toggle(flexitank.uid)}
                        className="h-4 w-4 rounded border-navy-100 dark:border-navy-700"
                      />
                    )}
                  </td>
                  <td className="whitespace-nowrap py-3 pr-4 font-semibold text-navy-900 dark:text-navy-100">
                    {flexitank.serialNumber}
                  </td>
                  <td className="whitespace-nowrap py-3 pr-4 text-navy-700 dark:text-navy-100">
                    {flexitank.fhbStock ?? "—"}
                  </td>
                  <td className="whitespace-nowrap py-3 pr-4 text-navy-700 dark:text-navy-100">
                    {flexitank.size}
                  </td>
                  <td className="py-3 pr-4">
                    <FlexitankStatusBadge status={flexitank.status} />
                  </td>
                  <td className="max-w-[200px] truncate py-3 pr-4 text-navy-700 dark:text-navy-100">
                    {flexitank.comment ?? "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AddFlexitanksBatchDrawer
        poUid={po.uid}
        open={batchOpen}
        onClose={() => setBatchOpen(false)}
      />
      <AddFlexitankUniqueModal
        poUid={po.uid}
        open={uniqueOpen}
        onClose={() => setUniqueOpen(false)}
      />
    </section>
  );
}
