"use client";

import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { FlexitankStatusBadge } from "@/components/ui/badge";
import { FLEXITANK_STATUSES } from "@/server/modules/flexitanks/flexitank.dto";

import { DamagedModal } from "./damaged-modal";

export function FlexitankStatusPicker({
  uid,
  status,
  canEdit,
}: {
  uid: string;
  status: string | null;
  canEdit: boolean;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [damagedOpen, setDamagedOpen] = useState(false);
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

  if (!canEdit) {
    return <FlexitankStatusBadge status={status} />;
  }

  async function handleSelect(next: string) {
    setOpen(false);
    if (next === status) return;

    if (next === "Damaged") {
      setDamagedOpen(true);
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(`/api/flexitanks/${uid}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        toast.error(body?.message ?? "Erro ao atualizar o status.");
        return;
      }

      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div ref={containerRef} className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        disabled={saving}
        aria-label="Alterar status"
        aria-haspopup="listbox"
        aria-expanded={open}
        className="group inline-flex items-center gap-1 rounded-full disabled:opacity-60"
      >
        <FlexitankStatusBadge status={status} />
        <ChevronDown
          size={13}
          className="text-navy-400 group-hover:text-navy-700 dark:text-navy-100/40 dark:group-hover:text-navy-100"
        />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute left-0 top-[calc(100%+0.375rem)] z-20 w-40 overflow-hidden rounded-lg border border-navy-100 bg-white py-1 shadow-lg dark:border-navy-700 dark:bg-navy-900"
        >
          {FLEXITANK_STATUSES.map((option) => (
            <button
              key={option}
              type="button"
              role="option"
              aria-selected={option === status}
              onClick={() => handleSelect(option)}
              className="flex w-full items-center px-2 py-1.5 hover:bg-navy-50 dark:hover:bg-navy-800"
            >
              <FlexitankStatusBadge status={option} />
            </button>
          ))}
        </div>
      )}

      <DamagedModal
        open={damagedOpen}
        onClose={() => setDamagedOpen(false)}
        uid={uid}
      />
    </div>
  );
}
