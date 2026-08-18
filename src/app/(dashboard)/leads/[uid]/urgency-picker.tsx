"use client";

import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { UrgencyBadge } from "@/components/ui/badge";
import { LEAD_URGENCIES } from "@/server/modules/leads/lead.dto";

export function UrgencyPicker({
  uid,
  urgency,
  canEdit,
}: {
  uid: string;
  urgency: string | null;
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
    return <UrgencyBadge urgency={urgency} />;
  }

  async function handleSelect(next: string) {
    setOpen(false);
    if (next === urgency) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/leads/${uid}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urgency: next }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        toast.error(body?.message ?? "Erro ao atualizar a urgência.");
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
        aria-label="Alterar urgência"
        aria-haspopup="listbox"
        aria-expanded={open}
        className="group inline-flex items-center gap-1 rounded-full disabled:opacity-60"
      >
        <UrgencyBadge urgency={urgency} />
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
          {LEAD_URGENCIES.map((option) => (
            <button
              key={option}
              type="button"
              role="option"
              aria-selected={option === urgency}
              onClick={() => handleSelect(option)}
              className="flex w-full items-center px-2 py-1.5 hover:bg-navy-50 dark:hover:bg-navy-800"
            >
              <UrgencyBadge urgency={option} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
