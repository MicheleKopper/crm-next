"use client";

import { Pencil, User } from "lucide-react";
import { useState } from "react";

import type { CustomerDetail } from "@/server/modules/customers/customer.mapper";

import { CompanyInfoForm } from "./company-info-form";
import { CompanyInfoView } from "./company-info-view";

export function CompanyInfoSection({
  customer,
  owners,
  canEdit,
}: {
  customer: CustomerDetail;
  owners: { id: string; fullName: string }[];
  canEdit: boolean;
}) {
  const [editing, setEditing] = useState(false);

  return (
    <section className="rounded-xl bg-white p-6 shadow-sm dark:bg-navy-900">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 border-l-4 border-navy-900 pl-3 dark:border-navy-100">
          <User size={16} className="text-navy-900 dark:text-navy-100" />
          <h2 className="text-base font-bold text-navy-900 dark:text-navy-100">
            Identificação e Localização
          </h2>
        </div>

        {canEdit && !editing && (
          <button
            type="button"
            onClick={() => setEditing(true)}
            aria-label="Editar identificação e localização"
            title="Editar"
            className="rounded-lg p-2 text-navy-500 hover:bg-navy-100 hover:text-navy-900 dark:text-navy-100/70 dark:hover:bg-navy-800 dark:hover:text-navy-100"
          >
            <Pencil size={16} />
          </button>
        )}
      </div>

      {editing ? (
        <CompanyInfoForm
          customer={customer}
          owners={owners}
          onSaved={() => setEditing(false)}
          onCancel={() => setEditing(false)}
        />
      ) : (
        <CompanyInfoView customer={customer} />
      )}
    </section>
  );
}
