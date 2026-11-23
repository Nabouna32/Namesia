import test from "node:test";
import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const globalCss = await readFile(join(root, "app/globals.css"), "utf8");
const provider = await readFile(join(root, "components/material-theme-provider.tsx"), "utf8");
const prenoms = await readFile(join(root, "lib/prenoms.ts"), "utf8");
const fiche = await readFile(join(root, "lib/fiche-prenom.ts"), "utf8");
const schema = await readFile(join(root, "schemas/fiche-prenom.schema.json"), "utf8");

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

const cssPaths = await collectCss(root);
const styles = await Promise.all(cssPaths.map(async (path) => ({
  path: relative(root, path).replaceAll("\\", "/"),
  content: await readFile(path, "utf8")
})));
const allCss = styles.map(({ content }) => content).join("\n");

function collectRules(css) {
  const rules = [];
  function scan(start, end, context) {
    let cursor = start;
    while (cursor < end) {
      while (cursor < end && /\s/.test(css[cursor])) cursor++;
      if (css.startsWith("/*", cursor)) {
        const commentEnd = css.indexOf("*/", cursor + 2);
        cursor = commentEnd < 0 ? end : commentEnd + 2;
        continue;
      }
      const preludeStart = cursor;
      while (cursor < end && css[cursor] !== "{" && css[cursor] !== ";") cursor++;
      if (cursor >= end || css[cursor] === ";") {
        cursor++;
        continue;
      }
      const prelude = css.slice(preludeStart, cursor).trim().replace(/\s+/g, " ");
      let depth = 0;
      let closing = cursor;
      for (; closing < end; closing++) {
        if (css[closing] === "{") depth++;
        else if (css[closing] === "}" && --depth === 0) break;
      }
      if (prelude.startsWith("@")) scan(cursor + 1, closing, [...context, prelude]);
      else rules.push({ selector: prelude, context: context.join(" / ") });
      cursor = closing + 1;
    }
  }
  scan(0, css.length, []);
  return rules;
}

test("les feuilles consomment les rôles Material sans alias hérités ni fallback", () => {
  assert.doesNotMatch(allCss, /--(?:color-[\w-]+|ink|muted|line|paper|surface|accent|sans|font-(?:sans|display)|radius-[\w-]+|space-\d+|motion-[\w-]+|shadow-[\w-]+)\b/);
  assert.doesNotMatch(allCss, /var\(\s*--[\w-]+\s*,/);
  assert.match(globalCss, /--md-sys-color-primary:/);
  assert.match(globalCss, /--md-sys-typescale-title-large-size:/);
  assert.match(globalCss, /--md-sys-shape-corner-extra-large:/);
});

test("la feuille globale conserve un seul :root SSR et aucune couche d'overrides finale", () => {
  assert.equal((globalCss.match(/:root\s*\{/g) ?? []).length, 1);
  assert.match(globalCss, /Valeurs initiales SSR/);
  assert.doesNotMatch(globalCss, /Couche Material 3 Fidelity/);
});

test("aucun sélecteur n'est déclaré plusieurs fois dans un même contexte CSS", () => {
  for (const { path, content } of styles) {
    const seen = new Set();
    for (const rule of collectRules(content)) {
      const key = `${rule.context} :: ${rule.selector}`;
      assert.equal(seen.has(key), false, `${path} redéfinit ${rule.selector} dans ${rule.context || "la portée globale"}`);
      seen.add(key);
    }
  }
});

test("l'échelle typographique Material 3 est complète et limitée aux graisses 400/500", () => {
  const roles = ["display-large", "display-medium", "display-small", "headline-large", "headline-medium", "headline-small", "title-large", "title-medium", "title-small", "body-large", "body-medium", "body-small", "label-large", "label-medium", "label-small"];
  for (const role of roles) {
    for (const property of ["font", "size", "line-height", "weight", "tracking"]) {
      assert.match(globalCss, new RegExp(`--md-sys-typescale-${role}-${property}:`), `Token manquant : ${role}-${property}`);
    }
  }
  assert.doesNotMatch(allCss, /font-size\s*:[^;]*px/);
  const weights = [...allCss.matchAll(/font-weight:\s*([^;]+);/g)].map((match) => match[1].trim());
  assert.ok(weights.every((weight) => weight === "400" || weight === "500"), `Graisses interdites : ${weights.join(", ")}`);
  assert.doesNotMatch(allCss, /text-transform:\s*uppercase/i);
});

test("les rayons sont tokenisés et les espacements suivent la grille de 4 px", () => {
  assert.doesNotMatch(allCss, /border-radius:\s*(?:\d+(?:\.\d+)?px|\d+%)/);
  const spacingPattern = /^\s*((?:margin|padding)(?:-(?:top|right|bottom|left|block|inline))?|gap|row-gap|column-gap)\s*:\s*([^;]+);/gm;
  for (const match of allCss.matchAll(spacingPattern)) {
    for (const pixel of match[2].matchAll(/(-?\d+(?:\.\d+)?)px/g)) {
      assert.equal(Number(pixel[1]) % 4, 0, `Espacement hors grille : ${match[1]} = ${pixel[1]}px`);
    }
  }
});

test("les données de fiche et les libellés de genre invalides échouent explicitement", () => {
  assert.doesNotMatch(prenoms, /\?\?/);
  assert.doesNotMatch(fiche, /\?\?/);
  assert.match(prenoms, /Genre de prénom non pris en charge/);
  assert.match(prenoms, /ne peut pas avoir un nom vide/);
  assert.match(schema, /"required":\["introduction","symbolic_associations"\]/);
  assert.doesNotMatch(fiche, /symbolic_associations\s*\?\?\s*\[\]/);
});

test("les catégories Rainbow utilisent des rôles explicites sans couleur de repli", () => {
  assert.match(provider, /--md-sys-color-category-/);
  assert.match(provider, /--md-sys-color-\$\{role\}/);
  assert.match(allCss, /var\(--md-sys-color-category-container\)/);
  assert.doesNotMatch(allCss, /var\(--md-sys-color-category[^)]*,/);
});
