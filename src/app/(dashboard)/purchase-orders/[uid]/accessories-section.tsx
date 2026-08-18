"use client";

import { PackageCheck, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { FlexitankStatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { PurchaseOrderDetail } from "@/server/modules/purchase-orders/purchase-order.mapper";

import { AddAccessoryDrawer } from "./add-accessory-drawer";

const COLUMNS = ["Tipo", "Código", "Qtd. kit", "Status"];

export function AccessoriesSection({
  po,
  canCreate,
  canDelete,
}: {
  po: PurchaseOrderDetail;
  canCreate: boolean;
  canDelete: boolean;
}) {
  const router = useRouter();
  const [addOpen, setAddOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);

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
      const response = await fetch(
        `/api/purchase-orders/${po.uid}/accessories?${params.toString()}`,
        { method: "DELETE" }
      );
      if (!response.ok) {
        const body = await response.json().catch(() => null);
        toast.error(body?.message ?? "Erro ao excluir acessórios.");
        return;
      }
      toast.success("Acessório(s) excluído(s) com sucesso.");
      setSelected([]);
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="rounded-xl bg-white p-6 shadow-sm dark:bg-navy-900">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 border-l-4 border-navy-900 pl-3 dark:border-navy-100">
          <PackageCheck size={16} className="text-navy-900 dark:text-navy-100" />
          <h2 className="text-base font-bold text-navy-900 dark:text-navy-100">
            Acessórios
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
          {canCreate && (
            <Button className="h-9" onClick={() => setAddOpen(true)}>
              <Plus size={16} />
              Adicionar Acessório
            </Button>
          )}
        </div>
      </div>

      {po.accessories.length === 0 ? (
        <p className="py-6 text-center text-sm text-navy-500 dark:text-navy-100/70">
          Nenhum acessório cadastrado.
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
              {po.accessories.map((accessory) => (
                <tr key={accessory.uid} className="hover:bg-navy-50 dark:hover:bg-navy-800">
                  <td className="py-3 pr-2">
                    {canDelete && (
                      <input
                        type="checkbox"
                        checked={selected.includes(accessory.uid)}
                        onChange={() => toggle(accessory.uid)}
                        className="h-4 w-4 rounded border-navy-100 dark:border-navy-700"
                      />
                    )}
                  </td>
                  <td className="whitespace-nowrap py-3 pr-4 font-semibold text-navy-900 dark:text-navy-100">
                    {accessory.typeLabel}
                  </td>
                  <td className="whitespace-nowrap py-3 pr-4 text-navy-700 dark:text-navy-100">
                    {accessory.code ?? "—"}
                  </td>
                  <td className="whitespace-nowrap py-3 pr-4 text-navy-700 dark:text-navy-100">
                    {accessory.quantityKit ?? "—"}
                  </td>
                  <td className="py-3 pr-4">
                    <FlexitankStatusBadge status={accessory.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AddAccessoryDrawer poUid={po.uid} open={addOpen} onClose={() => setAddOpen(false)} />
    </section>
  );
}
