"use client";

import { LayoutGrid, List } from "lucide-react";

import { cn } from "@/lib/utils";

import { useViewMode } from "./view-mode-context";

export function ViewToggle() {
  const { view, setView } = useViewMode();

  return (
    <div className="flex h-9 items-center gap-0.5 rounded-lg border border-navy-100 bg-white p-1">
      <button
        type="button"
        onClick={() => setView("cards")}
        aria-label="Visualização em cards"
        aria-pressed={view === "cards"}
        title="Cards"
        className={cn(
          "flex h-7 w-7 items-center justify-center rounded-md transition-colors",
          view === "cards"
            ? "bg-navy-900 text-white"
            : "text-navy-500 hover:bg-navy-100 hover:text-navy-900"
        )}
      >
        <LayoutGrid size={15} />
      </button>
      <button
        type="button"
        onClick={() => setView("list")}
        aria-label="Visualização em lista"
        aria-pressed={view === "list"}
        title="Lista"
        className={cn(
          "flex h-7 w-7 items-center justify-center rounded-md transition-colors",
          view === "list"
            ? "bg-navy-900 text-white"
            : "text-navy-500 hover:bg-navy-100 hover:text-navy-900"
        )}
      >
        <List size={15} />
      </button>
    </div>
  );
}
