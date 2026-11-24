import test from "node:test";
import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const provider = await readFile(join(root, "components/material3/MaterialThemeProvider.tsx"), "utf8");
const theme = await readFile(join(root, "lib/material-theme.ts"), "utf8");
const layout = await readFile(join(root, "app/layout.tsx"), "utf8");
const packageJson = JSON.parse(await readFile(join(root, "package.json"), "utf8"));

async function collectCss(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (["node_modules", ".next", ".git"].includes(entry.name)) continue;
    const absolute = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await collectCss(absolute));
    else if (entry.name.endsWith(".module.css") || relative(root, absolute) === "app/globals.css") files.push(absolute);
  }
  return files;
}

const cssFiles = await collectCss(root);
const styles = await Promise.all(cssFiles.map(async (path) => ({
  path: relative(root, path).replaceAll("\\", "/"),
  content: await readFile(path, "utf8")
})));
const allCss = styles.map(({ content }) => content).join("\n");

test("Fidelity et Rainbow épinglent la version ColorSpec réellement prise en charge", () => {
  assert.match(theme, /Variant\.FIDELITY/);
  assert.match(theme, /Variant\.RAINBOW/);
  assert.match(theme, /specVersion: "2021"/);
  assert.match(theme, /platform: "phone"/);
  assert.match(theme, /argbFromHex\("#0B57D0"\)/);
  assert.equal(packageJson.dependencies["@material/material-color-utilities"], "0.4.0");
  assert.doesNotMatch(theme, /specVersion: "(?:2025|2026)"/);
  assert.match(theme, /rôle Material 3/);
  assert.match(theme, /rôle Rainbow/);
});

test("le registre des couleurs est fermé et reprend les noms des rôles M3", () => {
  const block = theme.match(/export const materialColorRoles = \[([\s\S]*?)\] as const;/)?.[1] ?? "";
  assert.ok(block.length > 0);
  const expected = [
    "background", "onBackground", "surface", "surfaceDim", "surfaceBright",
    "surfaceContainerLowest", "surfaceContainerLow", "surfaceContainer",
    "surfaceContainerHigh", "surfaceContainerHighest", "onSurface", "surfaceVariant",
    "onSurfaceVariant", "inverseSurface", "inverseOnSurface", "outline",
    "outlineVariant", "shadow", "scrim", "surfaceTint",
    "primary", "onPrimary", "primaryContainer", "onPrimaryContainer",
    "primaryFixed", "primaryFixedDim", "onPrimaryFixed", "onPrimaryFixedVariant",
    "inversePrimary", "secondary", "onSecondary", "secondaryContainer",
    "onSecondaryContainer", "secondaryFixed", "secondaryFixedDim",
    "onSecondaryFixed", "onSecondaryFixedVariant", "tertiary", "onTertiary",
    "tertiaryContainer", "onTertiaryContainer", "tertiaryFixed", "tertiaryFixedDim",
    "onTertiaryFixed", "onTertiaryFixedVariant", "error", "onError",
    "errorContainer", "onErrorContainer"
  ];
  const actual = [...block.matchAll(/"([A-Za-z]+)"/g)].map((match) => match[1]);
  assert.deepEqual(actual, expected, "Le registre M3 doit être revu explicitement lors d'une évolution de MCU");
  assert.equal(new Set(actual).size, actual.length, "Un rôle M3 ne peut être déclaré deux fois");

  const toToken = (role) => role.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
  const allowed = new Set(expected.map(toToken));
  const used = [...allCss.matchAll(/var\(--md-sys-color-([a-z0-9-]+)/g)].map((match) => match[1]);
  const unknown = [...new Set(used.filter((role) => !allowed.has(role)))];
  assert.deepEqual(unknown, [], "Un CSS consomme un rôle couleur absent du registre M3");
  assert.match(theme, /--md-sys-color-" \+ toCssToken\(role\)/);
  assert.match(theme, /typeof value !== "number"/);
  assert.match(theme, /throw new Error/);
  assert.doesNotMatch(block, /PaletteKeyColor|primaryDim|secondaryDim|tertiaryDim|errorDim/);
});

test("toutes les feuilles CSS respectent le contrat sans couleur ni valeur de secours", () => {
  for (const { path, content } of styles) {
    assert.doesNotMatch(content, /var\(\s*--[\w-]+\s*,/, path + " contient un fallback CSS");
    assert.doesNotMatch(content, /#[0-9a-f]{3,8}\b/i, path + " contient une couleur codée en dur");
    assert.doesNotMatch(content, /--md-sys-color-[\w-]+\s*:/, path + " redéfinit un rôle M3 hors du générateur");
  }
});

test("les extensions Namesia ne se font pas passer pour des rôles M3", () => {
  assert.doesNotMatch(theme, /--md-sys-color-(?:success|warning|info|category|brand|on-brand)/);
  assert.doesNotMatch(allCss, /--md-sys-color-(?:success|warning|info|category|brand|on-brand)/);
  assert.match(theme, /--namesia-color-category-/);
  assert.match(theme, /const semanticColorSources = \{[\s\S]*success: "#386A20"[\s\S]*warning: "#795900"[\s\S]*info: "#005B9A"/);
  assert.match(theme, /customColor\(sourceColorArgb/);
  assert.match(theme, /blend: false/);
  for (const role of ["success", "warning", "info"]) {
    assert.ok(theme.includes('tokens["--namesia-color-" + role]'));
    assert.ok(theme.includes('tokens["--namesia-color-on-" + role]'));
    assert.ok(theme.includes('tokens["--namesia-color-" + role + "-container"]'));
    assert.ok(theme.includes('tokens["--namesia-color-on-" + role + "-container"]'));
  }
});

test("le rendu SSR, l'hydratation et la barre du navigateur partagent les mêmes schémas", () => {
  assert.match(layout, /materialThemeCss/);
  assert.match(layout, /materialThemeViewportColors/);
  assert.match(theme, /getMaterialThemeTokens\(false\)/);
  assert.match(theme, /getMaterialThemeTokens\(true\)/);
  assert.match(theme, /color-scheme: light/);
  assert.match(theme, /color-scheme: dark/);
  assert.match(provider, /applyMaterialTheme/);
  assert.match(provider, /matchMedia\("\(prefers-color-scheme: dark\)"\)/);
  assert.match(theme, /light: lightTokens\["--md-sys-color-background"\]/);
  assert.match(theme, /dark: darkTokens\["--md-sys-color-background"\]/);
});

test("aucune feuille CSS ne contient une palette de couleur parallèle", () => {
  assert.doesNotMatch(allCss, /--md-sys-color-[\w-]+\s*:/);
});
