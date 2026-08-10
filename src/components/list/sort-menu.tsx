"use client";

import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type SortOption = { value: string; label: string };

const DEFAULT_SORT_DIR = "asc";

export function SortMenu({
  basePath,
  options,
  defaultSortBy,
  ariaLabel,
}: {
  basePath: string;
  options: readonly SortOption[];
  defaultSortBy: string;
  ariaLabel: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const sortBy = searchParams.get("sortBy") ?? defaultSortBy;
  const sortDir = searchParams.get("sortDir") ?? DEFAULT_SORT_DIR;
  const isActive = sortBy !== defaultSortBy || sortDir !== DEFAULT_SORT_DIR;

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

  function applySort(field: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (field === sortBy) {
      params.set("sortDir", sortDir === "asc" ? "desc" : "asc");
    } else {
      params.set("sortBy", field);
      params.set("sortDir", "asc");
    }
    params.set("offset", "0");
    router.push(`${basePath}?${params.toString()}`);
  }

  return (
    <div ref={containerRef} className="relative">
      <Button
        variant="secondary"
        onClick={() => setOpen((value) => !value)}
        aria-label={ariaLabel}
        title="Ordenar"
        className={cn("h-9 w-9 p-0", isActive && "border-navy-900 text-navy-900")}
      >
        <ArrowUpDown size={16} />
      </Button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+0.5rem)] z-20 w-52 overflow-hidden rounded-lg border border-navy-100 bg-white py-1 shadow-lg">
          <p className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-navy-400">
            Ordenar por
          </p>
          {options.map((option) => {
            const active = option.value === sortBy;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => applySort(option.value)}
                className={cn(
                  "flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-navy-50",
                  active ? "font-semibold text-navy-900" : "text-navy-700"
                )}
              >
                {option.label}
                {active &&
                  (sortDir === "asc" ? (
                    <ArrowUp size={14} />
                  ) : (
                    <ArrowDown size={14} />
                  ))}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
