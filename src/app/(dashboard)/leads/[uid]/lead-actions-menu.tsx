"use client";

import { CalendarPlus, MoreVertical, Target, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { DeleteLeadModal } from "./delete-lead-modal";

export function LeadActionsMenu({
  uid,
  displayName,
  canDelete,
}: {
  uid: string;
  displayName: string;
  canDelete: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div ref={containerRef} className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label="Ações do lead"
        aria-haspopup="menu"
        aria-expanded={open}
        title="Ações"
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-navy-100 bg-white text-navy-500 hover:bg-navy-100 hover:text-navy-900"
      >
        <MoreVertical size={18} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+0.375rem)] z-20 w-52 overflow-hidden rounded-lg border border-navy-100 bg-white py-1 shadow-lg"
        >
          <button
            type="button"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-navy-700 hover:bg-navy-50"
          >
            <Target size={14} />
            Add Oportunidade
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-navy-700 hover:bg-navy-50"
          >
            <CalendarPlus size={14} />
            Add Atividade
          </button>

          {canDelete && (
            <>
              <div className="my-1 border-t border-navy-100" />
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setOpen(false);
                  setDeleteOpen(true);
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm font-medium text-status-perdido hover:bg-status-perdido/10"
              >
                <Trash2 size={14} />
                Deletar
              </button>
            </>
          )}
        </div>
      )}

      {canDelete && (
        <DeleteLeadModal
          open={deleteOpen}
          onClose={() => setDeleteOpen(false)}
          uid={uid}
          displayName={displayName}
        />
      )}
    </div>
  );
}
