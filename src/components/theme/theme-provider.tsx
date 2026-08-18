"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type Theme = "light" | "dark";

const THEME_STORAGE_KEY = "theme";

const ThemeContext = createContext<{
  theme: Theme;
  toggleTheme: () => void;
} | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Sempre começa em "light", igual ao SSR (o servidor não tem acesso ao
  // localStorage) — se começasse já lendo `document.documentElement.classList`
  // (que o script inline em layout.tsx já corrigiu antes da hidratação), o
  // primeiro render do cliente divergiria do HTML do servidor e quebraria a
  // hidratação nos componentes que calculam cor via JS (gráficos, SVG do
  // donut). O efeito abaixo corrige o estado logo após montar — a classe
  // `.dark` no `<html>` já está certa desde o primeiro paint, só as cores
  // calculadas em JS acompanham um instante depois.
  const [theme, setThemeState] = useState<Theme>("light");

  useEffect(() => {
    if (document.documentElement.classList.contains("dark")) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- sincroniza com localStorage/DOM, indisponíveis no SSR
      setThemeState("dark");
    }
  }, []);

  function toggleTheme() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setThemeState(next);
    window.localStorage.setItem(THEME_STORAGE_KEY, next);
    document.documentElement.classList.toggle("dark", next === "dark");
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme deve ser usado dentro de ThemeProvider.");
  }
  return context;
}
