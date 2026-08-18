"use client";

import { Package, Pencil, Plus } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import type { PurchaseOrderDetail } from "@/server/modules/purchase-orders/purchase-order.mapper";

import { AddProductDrawer } from "./add-product-drawer";
import { EditProductModal } from "./edit-product-modal";

const COLUMNS = ["Descrição", "Tamanho", "Quantidade", "Preço", "Flexitank"];

export function ProductsSection({
  po,
  canEdit,
}: {
  po: PurchaseOrderDetail;
  canEdit: boolean;
}) {
  const [addOpen, setAddOpen] = useState(false);
  const [editingUid, setEditingUid] = useState<string | null>(null);
  const editingProduct = po.products.find((product) => product.uid === editingUid);

  return (
    <section className="rounded-xl bg-white p-6 shadow-sm dark:bg-navy-900">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 border-l-4 border-navy-900 pl-3 dark:border-navy-100">
          <Package size={16} className="text-navy-900 dark:text-navy-100" />
          <h2 className="text-base font-bold text-navy-900 dark:text-navy-100">
            Produtos
          </h2>
        </div>

        {canEdit && (
          <Button className="h-9" onClick={() => setAddOpen(true)}>
            <Plus size={16} />
            Adicionar Produto
          </Button>
        )}
      </div>

      {po.products.length === 0 ? (
        <p className="py-6 text-center text-sm text-navy-500 dark:text-navy-100/70">
          Nenhum produto cadastrado.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-navy-100 dark:border-navy-700">
                {COLUMNS.map((column) => (
                  <th
                    key={column}
                    className="whitespace-nowrap py-2 pr-4 text-xs font-semibold uppercase tracking-wide text-navy-400 dark:text-navy-100/40"
                  >
                    {column}
                  </th>
                ))}
                <th className="py-2 pl-4" />
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-100 dark:divide-navy-700">
              {po.products.map((product) => (
                <tr key={product.uid} className="hover:bg-navy-50 dark:hover:bg-navy-800">
                  <td className="max-w-[240px] truncate py-3 pr-4 text-navy-900 dark:text-navy-100">
                    {product.description ?? "—"}
                  </td>
                  <td className="whitespace-nowrap py-3 pr-4 text-navy-700 dark:text-navy-100">
                    {product.size ?? "—"}
                  </td>
                  <td className="whitespace-nowrap py-3 pr-4 text-navy-700 dark:text-navy-100">
                    {product.quantity}
                  </td>
                  <td className="whitespace-nowrap py-3 pr-4 text-navy-700 dark:text-navy-100">
                    {product.price != null ? product.price.toFixed(2) : "—"}
                  </td>
                  <td className="py-3 pr-4">
                    {product.isFlexitank && (
                      <span className="inline-flex items-center rounded-full bg-status-lead/10 px-2.5 py-1 text-xs font-semibold text-status-lead">
                        Flexitank
                      </span>
                    )}
                  </td>
                  <td className="py-3 pl-4 text-right">
                    {canEdit && (
                      <button
                        type="button"
                        onClick={() => setEditingUid(product.uid)}
                        aria-label="Editar produto"
                        title="Editar"
                        className="rounded-lg p-2 text-navy-500 hover:bg-navy-100 hover:text-navy-900 dark:text-navy-100/70 dark:hover:bg-navy-800 dark:hover:text-navy-100"
                      >
                        <Pencil size={16} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AddProductDrawer poUid={po.uid} open={addOpen} onClose={() => setAddOpen(false)} />
      {editingProduct && (
        <EditProductModal
          poUid={po.uid}
          product={editingProduct}
          open
          onClose={() => setEditingUid(null)}
        />
      )}
    </section>
  );
}
