"use client";

import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { LeadStatusBadge } from "@/components/ui/badge";
import { LEAD_STATUSES } from "@/server/modules/leads/lead.dto";

export function LeadStatusPicker({
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
    return <LeadStatusBadge status={status} />;
  }

  async function handleSelect(next: string) {
    setOpen(false);
    if (next === status) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/leads/${uid}`, {
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
        <LeadStatusBadge status={status} />
        <ChevronDown
          size={13}
          className="text-navy-400 group-hover:text-navy-700"
        />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute left-0 top-[calc(100%+0.375rem)] z-20 w-40 overflow-hidden rounded-lg border border-navy-100 bg-white py-1 shadow-lg"
        >
          {LEAD_STATUSES.map((option) => (
            <button
              key={option}
              type="button"
              role="option"
              aria-selected={option === status}
              onClick={() => handleSelect(option)}
              className="flex w-full items-center px-2 py-1.5 hover:bg-navy-50"
            >
              <LeadStatusBadge status={option} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
