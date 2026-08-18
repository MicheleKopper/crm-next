"use client";

import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { ScoreBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ScorePicker({
  uid,
  score,
  canEdit,
}: {
  uid: string;
  score: number | null;
  canEdit: boolean;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(String(score ?? ""));
  const [saving, setSaving] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setValue(String(score ?? ""));
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, score]);

  if (!canEdit) {
    return <ScoreBadge score={score} />;
  }

  async function handleSave() {
    const next = Number(value);
    if (!value || Number.isNaN(next) || next === score) {
      setOpen(false);
      setValue(String(score ?? ""));
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(`/api/leads/${uid}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ score: next }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        toast.error(body?.message ?? "Erro ao atualizar o score.");
        return;
      }

      setOpen(false);
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
        aria-label="Alterar score"
        aria-haspopup="dialog"
        aria-expanded={open}
        className="group inline-flex items-center gap-1 rounded-full disabled:opacity-60"
      >
        <ScoreBadge score={score} />
        <ChevronDown
          size={13}
          className="text-navy-400 group-hover:text-navy-700 dark:text-navy-100/40 dark:group-hover:text-navy-100"
        />
      </button>

      {open && (
        <div className="absolute left-0 top-[calc(100%+0.375rem)] z-20 w-44 rounded-lg border border-navy-100 bg-white p-3 shadow-lg dark:border-navy-700 dark:bg-navy-900">
          <Input
            type="number"
            min={1}
            max={100}
            autoFocus
            value={value}
            disabled={saving}
            onChange={(event) => setValue(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") handleSave();
            }}
          />
          <Button
            type="button"
            className="mt-2 w-full"
            disabled={saving}
            onClick={handleSave}
          >
            {saving ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      )}
    </div>
  );
}
