import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const provider = await readFile(new URL("../components/material-theme-provider.tsx", import.meta.url), "utf8");
const theme = await readFile(new URL("../lib/material-theme.ts", import.meta.url), "utf8");
const styles = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
const layout = await readFile(new URL("../app/layout.tsx", import.meta.url), "utf8");

test("Fidelity et Rainbow utilisent explicitement leur spécification M3", () => {
  assert.match(theme, /Variant\.FIDELITY/);
  assert.match(theme, /Variant\.RAINBOW/);
  assert.match(theme, /specVersion: "2021"/);
  assert.doesNotMatch(theme, /specVersion: "2025"/);
  assert.match(theme, /Rôle Material 3/);
  assert.match(theme, /Rôle Rainbow/);
});

test("la liste des rôles système est explicite et exclut les clés internes", () => {
  const block = theme.match(/export const materialColorRoles = \[([\s\S]*?)\] as const;/)?.[1] ?? "";
  assert.ok(block.length > 0);
  assert.doesNotMatch(block, /PaletteKeyColor|primaryDim|secondaryDim|tertiaryDim|errorDim/);
  assert.match(theme, /--md-sys-color-/);
  assert.match(theme, /typeof value !== "number"/);
  assert.match(theme, /throw new Error/);
});

test("les extensions Namesia ne se font pas passer pour des rôles M3", () => {
  assert.doesNotMatch(theme, /--md-sys-color-(?:success|warning|info|category|brand|on-brand)/);
  assert.doesNotMatch(styles, /--md-sys-color-(?:success|warning|info|category|brand|on-brand)/);
  assert.match(theme, /--namesia-color-category-/);
  assert.match(theme, /--namesia-color-success/);
  assert.match(theme, /--namesia-color-brand-gradient/);
});

test("le rendu initial et les changements de préférence utilisent le même générateur", () => {
  assert.match(layout, /materialThemeCss/);
  assert.match(layout, /materialThemeViewportColors/);
  assert.match(theme, /getMaterialThemeTokens\(false\)/);
  assert.match(theme, /getMaterialThemeTokens\(true\)/);
  assert.match(theme, /color-scheme: light/);
  assert.match(theme, /color-scheme: dark/);
  assert.match(provider, /applyMaterialTheme/);
  assert.match(provider, /matchMedia\("\(prefers-color-scheme: dark\)"\)/);
});

test("les feuilles CSS ne conservent aucune palette de couleur parallèle", () => {
  assert.doesNotMatch(styles, /--md-sys-color-/);
  assert.doesNotMatch(styles, /var\(\s*--[\w-]+\s*,/);
});
