import {
  argbFromHex,
  DynamicScheme,
  Hct,
  hexFromArgb,
  Variant
} from "@material/material-color-utilities";

const sourceColor = Hct.fromInt(argbFromHex("#005AC1"));

/** Rôles système M3 explicitement autorisés ; les clés de palette internes sont exclues. */
export const materialColorRoles = [
  "background",
  "onBackground",
  "surface",
  "surfaceDim",
  "surfaceBright",
  "surfaceContainerLowest",
  "surfaceContainerLow",
  "surfaceContainer",
  "surfaceContainerHigh",
  "surfaceContainerHighest",
  "onSurface",
  "surfaceVariant",
  "onSurfaceVariant",
  "inverseSurface",
  "inverseOnSurface",
  "outline",
  "outlineVariant",
  "shadow",
  "scrim",
  "surfaceTint",
  "primary",
  "onPrimary",
  "primaryContainer",
  "onPrimaryContainer",
  "primaryFixed",
  "primaryFixedDim",
  "onPrimaryFixed",
  "onPrimaryFixedVariant",
  "inversePrimary",
  "secondary",
  "onSecondary",
  "secondaryContainer",
  "onSecondaryContainer",
  "secondaryFixed",
  "secondaryFixedDim",
  "onSecondaryFixed",
  "onSecondaryFixedVariant",
  "tertiary",
  "onTertiary",
  "tertiaryContainer",
  "onTertiaryContainer",
  "tertiaryFixed",
  "tertiaryFixedDim",
  "onTertiaryFixed",
  "onTertiaryFixedVariant",
  "error",
  "onError",
  "errorContainer",
  "onErrorContainer"
] as const;

const categoryRoles = ["primary", "secondary", "tertiary"] as const;
const brandGradient = "linear-gradient(105deg, #ef568b 0%, #f29a42 19%, #e8c94c 36%, #55b987 54%, #49a9d5 72%, #8669d4 88%, #d76bb5 100%)";

function toCssToken(role: string) {
  return role.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}

function createScheme(isDark: boolean, variant: Variant) {
  return new DynamicScheme({
    sourceColorHct: sourceColor,
    contrastLevel: 0,
    isDark,
    platform: "phone",
    // Fidelity et Rainbow sont définies dans la spécification Material 3 de 2021.
    specVersion: "2021",
    variant
  });
}

export function getMaterialThemeTokens(isDark: boolean): Record<string, string> {
  const fidelityScheme = createScheme(isDark, Variant.FIDELITY);
  const rainbowScheme = createScheme(isDark, Variant.RAINBOW);
  const tokens: Record<string, string> = {};

  for (const role of materialColorRoles) {
    const value: unknown = Reflect.get(fidelityScheme, role);
    if (typeof value !== "number") {
      throw new Error("Le rôle Material 3 « " + role + " » est absent du schéma Fidelity.");
    }
    tokens["--md-sys-color-" + toCssToken(role)] = hexFromArgb(value);
  }

  categoryRoles.forEach((role, index) => {
    const token = index + 1;
    const properties = [
      ["", role],
      ["-container", role + "Container"],
      ["-on-container", "on" + role[0].toUpperCase() + role.slice(1) + "Container"]
    ] as const;

    for (const [suffix, property] of properties) {
      const value: unknown = Reflect.get(rainbowScheme, property);
      if (typeof value !== "number") {
        throw new Error("Le rôle Rainbow « " + property + " » est absent du schéma.");
      }
      tokens["--namesia-color-category-" + token + suffix] = hexFromArgb(value);
    }
  });

  const statusColors = isDark
    ? { success: "#b5f397", warning: "#f1d28b", info: "#9ecaff" }
    : { success: "#386a20", warning: "#795900", info: "#005b9a" };

  for (const [role, value] of Object.entries(statusColors)) {
    tokens["--namesia-color-" + role] = value;
  }
  tokens["--namesia-color-on-brand"] = "#ffffff";
  tokens["--namesia-color-brand-gradient"] = brandGradient;

  return tokens;
}

function cssDeclarations(tokens: Record<string, string>) {
  return Object.entries(tokens).map(([name, value]) => "  " + name + ": " + value + ";").join("\n");
}

const lightTokens = getMaterialThemeTokens(false);
const darkTokens = getMaterialThemeTokens(true);

export const materialThemeCss = ":root {\n  color-scheme: light;\n" +
  cssDeclarations(lightTokens) +
  "\n}\n\n@media (prefers-color-scheme: dark) {\n  :root {\n    color-scheme: dark;\n" +
  cssDeclarations(darkTokens) +
  "\n  }\n}";

export const materialThemeViewportColors = {
  light: lightTokens["--md-sys-color-background"],
  dark: darkTokens["--md-sys-color-background"]
};

export function applyMaterialTheme(isDark: boolean) {
  const tokens = isDark ? darkTokens : lightTokens;
  for (const [name, value] of Object.entries(tokens)) {
    document.documentElement.style.setProperty(name, value);
  }
  document.documentElement.dataset.theme = isDark ? "dark" : "light";
}
