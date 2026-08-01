"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

type Theme = "light" | "dark" | "system";

interface ThemeContextValue {
  theme: Theme;
  resolved: "light" | "dark";
  setTheme: (t: Theme) => void;
  mounted: boolean;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "system",
  resolved: "light",
  setTheme: () => {},
  mounted: false,
});

const STORAGE_KEY = "hive-dashboard-theme";

function getStored(): Theme {
  if (typeof window === "undefined") return "system";
  return (localStorage.getItem(STORAGE_KEY) as Theme) || "system";
}

function resolveTheme(t: Theme): "light" | "dark" {
  if (t === "system") {
    if (typeof window === "undefined") return "light";
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  return t;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("system");
  const [resolved, setResolved] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = getStored();
    setThemeState(stored);
    setResolved(resolveTheme(stored));
    setMounted(true);
  }, []);

  /* Keep data-theme on <html> so portaled content (mobile sidebar) inherits */
  useEffect(() => {
    if (!mounted) return;
    document.documentElement.setAttribute("data-theme", resolved);
  }, [resolved, mounted]);

  useEffect(() => {
    if (!mounted) return;
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      if (theme === "system") setResolved(resolveTheme("system"));
    };
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [theme, mounted]);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    localStorage.setItem(STORAGE_KEY, t);
    setResolved(resolveTheme(t));
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, resolved, setTheme, mounted }}>
      <div
        data-theme={mounted ? resolved : undefined}
        className="min-h-screen bg-background text-foreground"
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
