"use client";

import { LayoutGrid, List } from "lucide-react";
import { createContext, useContext, useEffect, useState } from "react";

import { cn } from "@/lib/utils";

export type ViewMode = "cards" | "list";

const ViewModeContext = createContext<{
  view: ViewMode;
  setView: (view: ViewMode) => void;
} | null>(null);

export function ViewModeProvider({
  storageKey,
  children,
}: {
  storageKey: string;
  children: React.ReactNode;
}) {
  const [view, setViewState] = useState<ViewMode>("cards");

  useEffect(() => {
    const stored = window.localStorage.getItem(storageKey);
    if (stored === "cards" || stored === "list") setViewState(stored);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function setView(next: ViewMode) {
    setViewState(next);
    window.localStorage.setItem(storageKey, next);
  }

  return (
    <ViewModeContext.Provider value={{ view, setView }}>
      {children}
    </ViewModeContext.Provider>
  );
}

export function useViewMode() {
  const context = useContext(ViewModeContext);
  if (!context) {
    throw new Error("useViewMode deve ser usado dentro de ViewModeProvider.");
  }
  return context;
}

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
