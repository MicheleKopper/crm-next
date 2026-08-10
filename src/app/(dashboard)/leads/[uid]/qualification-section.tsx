"use client";

import { Pencil, Target } from "lucide-react";
import { useState } from "react";

import type { LeadDetail } from "@/server/modules/leads/lead.mapper";

import { QualificationForm } from "./qualification-form";
import { QualificationView } from "./qualification-view";

export function QualificationSection({
  lead,
  canEdit,
}: {
  lead: LeadDetail;
  canEdit: boolean;
}) {
  const [editing, setEditing] = useState(false);

  return (
    <div className="border-t border-navy-100 pt-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 border-l-4 border-navy-900 pl-3">
          <Target size={16} className="text-navy-900" />
          <h2 className="text-base font-bold text-navy-900">Qualificação</h2>
        </div>

        {canEdit && !editing && (
          <button
            type="button"
            onClick={() => setEditing(true)}
            aria-label="Editar qualificação"
            title="Editar"
            className="rounded-lg p-2 text-navy-500 hover:bg-navy-100 hover:text-navy-900"
          >
            <Pencil size={16} />
          </button>
        )}
      </div>

      {editing ? (
        <QualificationForm
          lead={lead}
          onSaved={() => setEditing(false)}
          onCancel={() => setEditing(false)}
        />
      ) : (
        <QualificationView lead={lead} />
      )}
    </div>
  );
}
