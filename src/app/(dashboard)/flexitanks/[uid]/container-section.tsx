"use client";

import { Container as ContainerIcon, Pencil } from "lucide-react";
import { useState } from "react";

import type { FlexitankDetail } from "@/server/modules/flexitanks/flexitank.mapper";

import { ContainerForm } from "./container-form";
import { ContainerView } from "./container-view";

export function ContainerSection({
  flexitank,
  canEdit,
}: {
  flexitank: FlexitankDetail;
  canEdit: boolean;
}) {
  const [editing, setEditing] = useState(false);

  return (
    <section className="rounded-xl bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 border-l-4 border-navy-900 pl-3">
          <ContainerIcon size={16} className="text-navy-900" />
          <h2 className="text-base font-bold text-navy-900">Container</h2>
        </div>

        {canEdit && !editing && (
          <button
            type="button"
            onClick={() => setEditing(true)}
            aria-label="Editar container"
            title="Editar"
            className="rounded-lg p-2 text-navy-500 hover:bg-navy-100 hover:text-navy-900"
          >
            <Pencil size={16} />
          </button>
        )}
      </div>

      {editing ? (
        <ContainerForm
          flexitank={flexitank}
          onSaved={() => setEditing(false)}
          onCancel={() => setEditing(false)}
        />
      ) : (
        <ContainerView flexitank={flexitank} />
      )}
    </section>
  );
}
