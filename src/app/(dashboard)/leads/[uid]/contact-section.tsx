"use client";

import { Contact as ContactIcon, Pencil } from "lucide-react";
import { useState } from "react";

import type { LeadDetail } from "@/server/modules/leads/lead.mapper";

import { ContactForm } from "./contact-form";
import { ContactView } from "./contact-view";

export function ContactSection({
  lead,
  canEdit,
}: {
  lead: LeadDetail;
  canEdit: boolean;
}) {
  const [editing, setEditing] = useState(false);

  return (
    <section className="rounded-xl bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 border-l-4 border-navy-900 pl-3">
          <ContactIcon size={16} className="text-navy-900" />
          <h2 className="text-base font-bold text-navy-900">Contato</h2>
        </div>

        {canEdit && !editing && (
          <button
            type="button"
            onClick={() => setEditing(true)}
            aria-label="Editar contato"
            title="Editar"
            className="rounded-lg p-2 text-navy-500 hover:bg-navy-100 hover:text-navy-900"
          >
            <Pencil size={16} />
          </button>
        )}
      </div>

      {editing ? (
        <ContactForm
          lead={lead}
          onSaved={() => setEditing(false)}
          onCancel={() => setEditing(false)}
        />
      ) : (
        <ContactView lead={lead} />
      )}
    </section>
  );
}
