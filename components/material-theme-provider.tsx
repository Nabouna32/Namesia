"use client";

import { useEffect } from "react";
import {
  argbFromHex,
  DynamicScheme,
  Hct,
  hexFromArgb,
  Variant
} from "@material/material-color-utilities";

const sourceColor = Hct.fromInt(argbFromHex("#6750A4"));

function applyMaterialTheme(isDark: boolean) {
  const scheme = new DynamicScheme({
    sourceColorHct: sourceColor,
    variant: Variant.EXPRESSIVE,
    contrastLevel: 0,
    isDark,
    platform: "phone",
    specVersion: "2025"
  });

  for (const [role, value] of Object.entries(scheme.toJSON())) {
    const token = role.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
    document.documentElement.style.setProperty(`--md-sys-color-${token}`, hexFromArgb(value));
  }

  document.documentElement.dataset.theme = isDark ? "dark" : "light";
}

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
