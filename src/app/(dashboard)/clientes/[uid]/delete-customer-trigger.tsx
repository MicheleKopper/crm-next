"use client";

import { Trash2 } from "lucide-react";
import { useState } from "react";

import { DeleteCustomerModal } from "./delete-customer-modal";

export function DeleteCustomerTrigger({
  uid,
  displayName,
}: {
  uid: string;
  displayName: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Excluir cliente"
        title="Excluir"
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-navy-100 bg-white text-status-perdido hover:bg-status-perdido/10 dark:border-navy-700 dark:bg-navy-900"
      >
        <Trash2 size={18} />
      </button>

      <DeleteCustomerModal
        open={open}
        onClose={() => setOpen(false)}
        uid={uid}
        displayName={displayName}
      />
    </>
  );
}
