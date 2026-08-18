"use client";

import { Pencil, User } from "lucide-react";
import { useState } from "react";

import type { LeadDetail } from "@/server/modules/leads/lead.mapper";

import { LeadInfoForm } from "./lead-info-form";
import { LeadInfoView } from "./lead-info-view";

export function LeadInfoSection({
  lead,
  operators,
  canEdit,
}: {
  lead: LeadDetail;
  operators: { id: string; fullName: string }[];
  canEdit: boolean;
}) {
  const [editing, setEditing] = useState(false);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 border-l-4 border-navy-900 pl-3 dark:border-navy-100">
          <User size={16} className="text-navy-900 dark:text-navy-100" />
          <h2 className="text-base font-bold text-navy-900 dark:text-navy-100">Lead</h2>
        </div>

        {canEdit && !editing && (
          <button
            type="button"
            onClick={() => setEditing(true)}
            aria-label="Editar lead"
            title="Editar"
            className="rounded-lg p-2 text-navy-500 hover:bg-navy-100 hover:text-navy-900 dark:text-navy-100/70 dark:hover:bg-navy-800 dark:hover:text-navy-100"
          >
            <Pencil size={16} />
          </button>
        )}
      </div>

      {editing ? (
        <LeadInfoForm
          lead={lead}
          operators={operators}
          onSaved={() => setEditing(false)}
          onCancel={() => setEditing(false)}
        />
      ) : (
        <LeadInfoView lead={lead} />
      )}
    </div>
  );
}
