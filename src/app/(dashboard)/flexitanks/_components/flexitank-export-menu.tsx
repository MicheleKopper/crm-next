"use client";

import { CheckCircle2, FileDown, ListFilter } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

const FORWARDED_PARAMS = [
  "search",
  "status",
  "size",
  "locationId",
  "poNumber",
  "booking",
  "sortBy",
  "sortDir",
];

export function FlexitankExportMenu() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState<"available" | "current" | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  async function handleExport(mode: "available" | "current") {
    setOpen(false);
    setLoading(mode);
    try {
      const params = new URLSearchParams({ mode });
      if (mode === "current") {
        for (const key of FORWARDED_PARAMS) {
          const value = searchParams.get(key);
          if (value) params.set(key, value);
        }
      }

      const response = await fetch(`/api/flexitanks/export?${params.toString()}`);
      if (!response.ok) {
        const body = await response.json().catch(() => null);
        toast.error(body?.message ?? "Erro ao exportar flexitanks.");
        return;
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `flexitanks-${mode === "available" ? "disponiveis" : "listagem-atual"}-${Date.now()}.csv`;
      link.click();
      URL.revokeObjectURL(url);

      toast.success("Flexitanks exportados com sucesso!");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <Button
        variant="secondary"
        onClick={() => setOpen((value) => !value)}
        aria-label="Exportar flexitanks"
        aria-haspopup="menu"
        aria-expanded={open}
        title="Exportar"
        disabled={loading !== null}
        className="h-9 w-9 p-0"
      >
        <FileDown size={16} />
      </Button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+0.375rem)] z-20 w-64 overflow-hidden rounded-lg border border-navy-100 bg-white py-1 shadow-lg"
        >
          <button
            type="button"
            role="menuitem"
            onClick={() => handleExport("available")}
            disabled={loading !== null}
            className="flex w-full items-start gap-2 px-3 py-2 text-left hover:bg-navy-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-status-ativo" />
            <span>
              <span className="block text-sm font-medium text-navy-900">
                Exportar disponíveis
              </span>
              <span className="block text-xs text-navy-400">
                Todos os itens com status Available
              </span>
            </span>
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={() => handleExport("current")}
            disabled={loading !== null}
            className="flex w-full items-start gap-2 px-3 py-2 text-left hover:bg-navy-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <ListFilter size={14} className="mt-0.5 shrink-0 text-status-lead" />
            <span>
              <span className="block text-sm font-medium text-navy-900">
                Exportar listagem atual
              </span>
              <span className="block text-xs text-navy-400">
                Itens exibidos com os filtros e pesquisa aplicados
              </span>
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
