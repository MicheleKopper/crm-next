"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type ViewMode = "cards" | "list";

const STORAGE_KEY = "clientes:view-mode";

const ViewModeContext = createContext<{
  view: ViewMode;
  setView: (view: ViewMode) => void;
} | null>(null);

export function ViewModeProvider({ children }: { children: React.ReactNode }) {
  const [view, setViewState] = useState<ViewMode>("cards");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "cards" || stored === "list") setViewState(stored);
  }, []);

  function setView(next: ViewMode) {
    setViewState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
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
