import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const provider = await readFile(new URL("../components/material-theme-provider.tsx", import.meta.url), "utf8");
const styles = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");

test("le thème général est Fidelity et les accents catégoriels sont Rainbow", () => {
  assert.match(provider, /@material\/material-color-utilities/);
  assert.match(provider, /new DynamicScheme\(/);
  assert.match(provider, /variant: Variant\.FIDELITY/);
  assert.match(provider, /variant: Variant\.RAINBOW/);
  assert.match(provider, /--md-sys-color-category-/);
  assert.doesNotMatch(provider, /Variant\.EXPRESSIVE/);
  assert.match(provider, /specVersion: "2025"/);
  assert.match(provider, /sourceColorHct: sourceColor/);
  assert.match(provider, /matchMedia\("\(prefers-color-scheme: dark\)"\)/);
  assert.match(provider, /setProperty\(\`--md-sys-color-/);
});

test("les rôles Material essentiels ont des valeurs initiales SSR avant hydratation", () => {
  for (const role of [
    "primary",
    "on-primary",
    "primary-container",
    "on-primary-container",
    "secondary",
    "tertiary",
    "error",
    "background",
    "on-background",
    "surface",
    "on-surface",
    "surface-container-low",
    "surface-container",
    "surface-container-high",
    "surface-container-highest",
    "on-surface-variant",
    "outline",
    "outline-variant"
  ]) {
    assert.match(styles, new RegExp(`--md-sys-color-${role}:`), `Le rôle ${role} doit avoir un valeur initiale SSR`);
  }
});

test("les catégories disposent de rôles tonals Rainbow en clair et sombre", () => {
  for (const tone of [1, 2, 3]) {
    assert.match(styles, new RegExp(`--md-sys-color-category-${tone}:`));
    assert.match(styles, new RegExp(`--md-sys-color-category-${tone}-container:`));
    assert.match(styles, new RegExp(`--md-sys-color-category-${tone}-on-container:`));
  }
  assert.match(styles, /data-category-tone/);
});

test("les préférences de thème sont synchronisées sans toucher aux réglages système", () => {
  assert.match(provider, /preference\.addEventListener\("change", updateTheme\)/);
  assert.match(provider, /preference\.removeEventListener\("change", updateTheme\)/);
  assert.doesNotMatch(provider, /localStorage|sessionStorage/);
});
