import {
  argbFromHex,
  customColor,
  DynamicScheme,
  Hct,
  hexFromArgb,
  Variant
} from "@material/material-color-utilities";

// Bleu Google baseline_primary_600 utilisé par Chromium Android ; source personnalisée des schémas Fidelity/Rainbow.
const sourceColorArgb = argbFromHex("#0B57D0");
const sourceColor = Hct.fromInt(sourceColorArgb);

/** Couleurs sémantiques Namesia conservées comme couleurs personnalisées M3. */
const semanticColorSources = {
  success: "#386A20",
  warning: "#795900",
  info: "#005B9A"
} as const;

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

function toCssToken(role: string) {
  return role.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}

function createScheme(isDark: boolean, variant: Variant) {
  return new DynamicScheme({
    sourceColorHct: sourceColor,
    contrastLevel: 0,
    isDark,
    // Version de l’algorithme de couleur MCU, pas version du système de composants M3.
    specVersion: "2021",
    platform: "phone",
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

  for (const [role, sourceHex] of Object.entries(semanticColorSources)) {
    const group = customColor(sourceColorArgb, {
      name: role,
      value: argbFromHex(sourceHex),
      // Les teintes sémantiques ne doivent pas dériver vers le violet primaire.
      blend: false
    });
    const colors = isDark ? group.dark : group.light;
    tokens["--namesia-color-" + role] = hexFromArgb(colors.color);
    tokens["--namesia-color-on-" + role] = hexFromArgb(colors.onColor);
    tokens["--namesia-color-" + role + "-container"] = hexFromArgb(colors.colorContainer);
    tokens["--namesia-color-on-" + role + "-container"] = hexFromArgb(colors.onColorContainer);
  }

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
