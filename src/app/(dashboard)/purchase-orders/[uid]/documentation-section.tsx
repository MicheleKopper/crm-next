"use client";

import { FileStack, Pencil } from "lucide-react";
import { useState } from "react";

import type { PurchaseOrderDetail } from "@/server/modules/purchase-orders/purchase-order.mapper";

import { DocumentationForm } from "./documentation-form";
import { DocumentationView } from "./documentation-view";

export function DocumentationSection({
  po,
  canEdit,
}: {
  po: PurchaseOrderDetail;
  canEdit: boolean;
}) {
  const [editing, setEditing] = useState(false);

  return (
    <section className="rounded-xl bg-white p-6 shadow-sm dark:bg-navy-900">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 border-l-4 border-navy-900 pl-3 dark:border-navy-100">
          <FileStack size={16} className="text-navy-900 dark:text-navy-100" />
          <h2 className="text-base font-bold text-navy-900 dark:text-navy-100">
            Documentação
          </h2>
        </div>

        {canEdit && !editing && (
          <button
            type="button"
            onClick={() => setEditing(true)}
            aria-label="Editar documentação"
            title="Editar"
            className="rounded-lg p-2 text-navy-500 hover:bg-navy-100 hover:text-navy-900 dark:text-navy-100/70 dark:hover:bg-navy-800 dark:hover:text-navy-100"
          >
            <Pencil size={16} />
          </button>
        )}
      </div>

      {editing ? (
        <DocumentationForm
          po={po}
          onSaved={() => setEditing(false)}
          onCancel={() => setEditing(false)}
        />
      ) : (
        <DocumentationView po={po} />
      )}
    </section>
  );
}
