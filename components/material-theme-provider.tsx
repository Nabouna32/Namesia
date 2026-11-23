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

  const roles = [
    "primaryPaletteKeyColor", "secondaryPaletteKeyColor", "tertiaryPaletteKeyColor",
    "neutralPaletteKeyColor", "neutralVariantPaletteKeyColor", "errorPaletteKeyColor",
    "background", "onBackground", "surface", "surfaceDim", "surfaceBright",
    "surfaceContainerLowest", "surfaceContainerLow", "surfaceContainer",
    "surfaceContainerHigh", "surfaceContainerHighest", "onSurface", "surfaceVariant",
    "onSurfaceVariant", "inverseSurface", "inverseOnSurface", "outline", "outlineVariant",
    "shadow", "scrim", "surfaceTint", "primary", "primaryDim", "onPrimary",
    "primaryContainer", "onPrimaryContainer", "primaryFixed", "primaryFixedDim",
    "onPrimaryFixed", "onPrimaryFixedVariant", "inversePrimary", "secondary",
    "secondaryDim", "onSecondary", "secondaryContainer", "onSecondaryContainer",
    "secondaryFixed", "secondaryFixedDim", "onSecondaryFixed", "onSecondaryFixedVariant",
    "tertiary", "tertiaryDim", "onTertiary", "tertiaryContainer", "onTertiaryContainer",
    "tertiaryFixed", "tertiaryFixedDim", "onTertiaryFixed", "onTertiaryFixedVariant",
    "error", "errorDim", "onError", "errorContainer", "onErrorContainer"
  ] as const;

  for (const role of roles) {
    const value: unknown = Reflect.get(scheme, role);
    if (typeof value !== "number") continue;
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
