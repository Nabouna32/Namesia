"use client";

import { useEffect } from "react";
import { applyMaterialTheme } from "@/lib/material-theme";

export function MaterialThemeProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  useEffect(() => {
    const preference = window.matchMedia("(prefers-color-scheme: dark)");
    const updateTheme = (event: MediaQueryList | MediaQueryListEvent) => applyMaterialTheme(event.matches);

    updateTheme(preference);
    preference.addEventListener("change", updateTheme);

    return () => preference.removeEventListener("change", updateTheme);
  }, []);

  return children;
}
