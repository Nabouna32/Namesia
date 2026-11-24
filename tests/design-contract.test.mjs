import test from "node:test";
import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const globalCss = await readFile(join(root, "app/globals.css"), "utf8");
const provider = await readFile(join(root, "components/material-theme-provider.tsx"), "utf8");
const theme = await readFile(join(root, "lib/material-theme.ts"), "utf8");
const layout = await readFile(join(root, "app/layout.tsx"), "utf8");
const home = await readFile(join(root, "app/page.tsx"), "utf8");
const prenoms = await readFile(join(root, "lib/prenoms.ts"), "utf8");
const fiche = await readFile(join(root, "lib/fiche-prenom.ts"), "utf8");
const schema = await readFile(join(root, "schemas/fiche-prenom.schema.json"), "utf8");
const messageComponent = await readFile(join(root, "components/ui/message-statut.tsx"), "utf8");
const messageStyles = await readFile(join(root, "components/ui/message-statut.module.css"), "utf8");
const composantsDoc = await readFile(join(root, "docs/composants.md"), "utf8");
const agents = await readFile(join(root, "AGENTS.md"), "utf8");

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
  assert.match(theme, /--md-sys-color-/);
  assert.match(globalCss, /--md-sys-typescale-title-large-size:/);
  assert.match(globalCss, /--md-sys-shape-corner-extra-large:/);
  assert.match(globalCss, /--md-sys-shape-corner-full: 9999px;/);
});

test("le pied de page reste en bas sur les pages courtes sans hauteur artificielle", () => {
  assert.match(globalCss, /\.app-shell\s*\{[^}]*display:\s*flex;[^}]*min-height:\s*100svh;[^}]*flex-direction:\s*column;/s);
  assert.match(globalCss, /\.app-content\s*\{[^}]*display:\s*flex;[^}]*flex:\s*1;[^}]*flex-direction:\s*column;/s);
  assert.match(globalCss, /\.app-content > main\s*\{[^}]*flex:\s*1;/s);
  assert.match(globalCss, /\.site-footer\s*\{[^}]*margin-top:\s*auto;/s);
  assert.doesNotMatch(globalCss, /\.page-main\s*\{[^}]*min-height:\s*70vh/s);
});

test("les animations globales utilisent les tokens de mouvement", () => {
  assert.match(globalCss, /--md-sys-motion-easing-standard:/);
  assert.match(globalCss, /--md-sys-motion-easing-emphasized:/);
  assert.match(globalCss, /--md-sys-motion-duration-short3:/);
  assert.match(globalCss, /--md-sys-motion-duration-medium1:/);
  assert.match(globalCss, /--md-sys-motion-duration-medium4:/);
  assert.match(globalCss, /--md-sys-state-hover-state-layer-opacity:/);
  assert.match(globalCss, /--md-sys-state-focus-state-layer-opacity:/);
  assert.match(globalCss, /--md-sys-state-pressed-state-layer-opacity:/);
  assert.doesNotMatch(allCss, /--md-sys-motion-(?:standard|emphasized|duration-short|duration-medium|duration-long)\b/);
  assert.doesNotMatch(allCss, /--md-sys-elevation-(?:sm|md)\b/);
  assert.doesNotMatch(allCss, /#[0-9a-f]{3,8}\b/i);
  assert.doesNotMatch(allCss, /box-shadow:\s*var\(--md-sys-elevation-/);
  assert.match(globalCss, /\.skip-link\s*\{[^}]*transition: transform var\(--md-sys-motion-duration-short3\) var\(--md-sys-motion-easing-standard\)/s);
  assert.doesNotMatch(allCss, /transition\s*:[^;]*(?:\d+(?:\.\d+)?(?:ms|s))/i);
});

test("un seul indicateur global matérialise le focus clavier", () => {
  assert.equal((allCss.match(/outline:\s*3px solid var\(--md-sys-color-primary\)/g) ?? []).length, 1);
  assert.match(globalCss, /\.skip-link:focus-visible/);
  assert.doesNotMatch(globalCss, /\.navigation-item:focus-visible\s*\{[^}]*outline/s);
  assert.doesNotMatch(globalCss, /\.profile-toc a:focus-visible\s*\{[^}]*outline/s);
});

test("les états hover sont réservés aux appareils qui disposent d'un pointeur fin", () => {
  const reglesSurvol = styles.flatMap(({ path, content }) =>
    collectRules(content)
      .filter(({ selector }) => selector.includes(":hover"))
      .map(({ selector, context }) => ({ path, selector, context }))
  );

  for (const regle of reglesSurvol) {
    assert.ok(
      regle.context.includes("@media (hover: hover) and (pointer: fine)"),
      `${regle.path} applique ${regle.selector} hors d'un pointeur fin`
    );
  }

  const selectionStyles = styles.find(({ path }) => path === "components/ui/liste-selection-comparaison.module.css")?.content ?? "";
  assert.ok(selectionStyles.includes(".chip:active"));
  assert.ok(selectionStyles.includes("on-secondary-container) 12%, var(--md-sys-color-secondary-container)"));
});

test("la feuille globale conserve un seul :root SSR et aucune couche d'overrides finale", () => {
  assert.equal((globalCss.match(/:root\s*\{/g) ?? []).length, 1);
  assert.doesNotMatch(globalCss, /--md-sys-color-/);
  assert.doesNotMatch(globalCss, /Couche Material 3 Fidelity/);
});

test("aucun sélecteur n'est déclaré plusieurs fois dans un même contexte CSS", () => {
  for (const { path, content } of styles) {
    const seen = new Set();
    for (const rule of collectRules(content)) {
      for (const selector of rule.selector.split(",").map((part) => part.trim())) {
        const key = `${rule.context} :: ${selector}`;
        assert.equal(seen.has(key), false, `${path} redéfinit ${selector} dans ${rule.context || "la portée globale"}`);
        seen.add(key);
      }
    }
  }
});

test("Roboto est chargée une fois, auto-hébergée et sans police de substitution", () => {
  assert.match(layout, /import \{ Roboto \} from "next\/font\/google"/);
  assert.match(layout, /weight:\s*\[\s*"400",\s*"500"\s*\]/);
  assert.match(layout, /subsets:\s*\[\s*"latin",\s*"latin-ext"\s*\]/);
  assert.match(layout, /variable: "--font-roboto"/);
  assert.match(layout, /className=\{roboto\.variable\}/);
  assert.match(globalCss, /--md-sys-typescale-body-large-font: var\(--font-roboto\);/);
  assert.doesNotMatch(globalCss, /-font: Roboto;/);
});

test("l'échelle typographique Material 3 est complète et limitée aux graisses 400/500", () => {
  const roles = {
    "display-large": [57, 64, 400, "-0.25px"],
    "display-medium": [45, 52, 400, "0"],
    "display-small": [36, 44, 400, "0"],
    "headline-large": [32, 40, 400, "0"],
    "headline-medium": [28, 36, 400, "0"],
    "headline-small": [24, 32, 400, "0"],
    "title-large": [22, 28, 400, "0"],
    "title-medium": [16, 24, 500, "0.15px"],
    "title-small": [14, 20, 500, "0.1px"],
    "body-large": [16, 24, 400, "0.5px"],
    "body-medium": [14, 20, 400, "0.25px"],
    "body-small": [12, 16, 400, "0.4px"],
    "label-large": [14, 20, 500, "0.1px"],
    "label-medium": [12, 16, 500, "0.5px"],
    "label-small": [11, 16, 500, "0.5px"]
  };
  for (const [role, [size, lineHeight, weight, tracking]] of Object.entries(roles)) {
    for (const property of ["font", "size", "line-height", "weight", "tracking"]) {
      assert.match(globalCss, new RegExp("--md-sys-typescale-" + role + "-" + property + ":"), "Token manquant : " + role + "-" + property);
    }
    assert.ok(globalCss.includes("--md-sys-typescale-" + role + "-size: " + size + "px;"), "Taille M3 incorrecte : " + role);
    assert.ok(globalCss.includes("--md-sys-typescale-" + role + "-line-height: " + lineHeight + "px;"), "Interligne M3 incorrect : " + role);
    assert.ok(globalCss.includes("--md-sys-typescale-" + role + "-weight: " + weight + ";"), "Graisse M3 incorrecte : " + role);
    assert.ok(globalCss.includes("--md-sys-typescale-" + role + "-tracking: " + tracking + ";"), "Approche M3 incorrecte : " + role);
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
      assert.ok(Number(pixel[1]) === 0 || Number(pixel[1]) % 4 === 0, `Espacement hors grille : ${match[1]} = ${pixel[1]}px`);
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


test("les cartes de prénoms acceptent les noms longs sans déborder ni couper leur contenu", () => {
  assert.match(globalCss, /\.name-card strong\s*\{[^}]*overflow-wrap:\s*anywhere/s);
  assert.match(globalCss, /\.featured-name\s*\{[^}]*min-width:\s*0/s);
  assert.match(globalCss, /\.featured-bottom strong\s*\{[^}]*overflow-wrap:\s*anywhere/s);
  assert.match(globalCss, /\.featured-card\s*\{[^}]*min-height:\s*210px/s);
  assert.doesNotMatch(globalCss, /\.featured-card\s*\{[^}]*\n\s*height:\s*210px/s);
});

test("les catégories Rainbow utilisent des rôles explicites sans couleur de repli", () => {
  assert.match(theme, /--namesia-color-category-/);
  assert.match(allCss, /var\(--namesia-color-category-container\)/);
  assert.doesNotMatch(allCss, /var\(--namesia-color-category[^)]*,/);
  assert.doesNotMatch(allCss, /--md-sys-color-(?:success|warning|info|category|brand|on-brand)/);
});


test("les couleurs sémantiques sont des extensions M3 avec annonces accessibles", () => {
  for (const role of ["success", "warning", "info"]) {
    assert.match(theme, new RegExp("--namesia-color-" + role));
    assert.match(messageStyles, new RegExp("--namesia-color-" + role + "-container"));
    assert.match(messageStyles, new RegExp("--namesia-color-on-" + role + "-container"));
  }
  assert.match(messageStyles, /--md-sys-color-error-container/);
  assert.match(messageStyles, /--md-sys-color-on-error-container/);
  assert.match(messageComponent, /role={erreur \? "alert" : "status"}/);
  assert.match(messageComponent, /aria-live={erreur \? "assertive" : "polite"}/);
  assert.doesNotMatch(allCss, /--md-sys-color-(?:success|warning|info)\b/);
});

test("toute nouvelle page doit suivre le registre de composants Material 3", () => {
  assert.match(composantsDoc, /Correspondance avec les composants Material 3/);
  assert.match(composantsDoc, /Contrat obligatoire pour toute nouvelle page/);
  assert.match(composantsDoc, /TopAppBar/);
  assert.match(composantsDoc, /NavigationBar/);
  assert.match(composantsDoc, /FilterChip/);
  assert.match(agents, /Avant de créer ou refondre une page, lire/);
});

test("le hero d'accueil sépare le récit et les outils dans une composition Fidelity responsive", () => {
  assert.match(home, /className="hero-intro"/);
  assert.match(home, /className="hero-tools"/);
  assert.match(home, /<h2>Un prénom en tête\?<\/h2>/);
  assert.match(home, /<RecherchePrenoms prenoms=\{prenoms\} compact \/>/);
  assert.match(globalCss, /\.hero-content\s*\{[^}]*display:\s*grid/s);
  assert.match(globalCss, /\.hero-tools\s*\{[^}]*background:\s*var\(--md-sys-color-surface-container-lowest\)/s);
  assert.match(globalCss, /\.hero-copy\s*\{[^}]*color:\s*var\(--md-sys-color-on-surface-variant\)/s);
  assert.match(globalCss, /@media \(min-width:\s*900px\)[\s\S]*?\.hero-content\s*\{[^}]*grid-template-columns:/);
});


test("les en-têtes de section restent lisibles et leurs actions accessibles sur mobile", () => {
  assert.match(globalCss, /\.text-link\s*\{[^}]*display:\s*inline-flex/s);
  assert.match(globalCss, /\.text-link\s*\{[^}]*min-height:\s*48px/s);
  assert.match(globalCss, /@media \(max-width:\s*599px\)[\s\S]*?\.section-heading\s*\{[^}]*flex-direction:\s*column/s);
});
