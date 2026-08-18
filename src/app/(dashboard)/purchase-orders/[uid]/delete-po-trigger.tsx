"use client";

import { Trash2 } from "lucide-react";
import { useState } from "react";

import { DeletePoModal } from "./delete-po-modal";

export function DeletePoTrigger({ uid, poNumber }: { uid: string; poNumber: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Excluir purchase order"
        title="Excluir"
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-navy-100 bg-white text-status-perdido hover:bg-status-perdido/10 dark:border-navy-700 dark:bg-navy-900"
      >
        <Trash2 size={18} />
      </button>

      <DeletePoModal open={open} onClose={() => setOpen(false)} uid={uid} poNumber={poNumber} />
    </>
  );
}
