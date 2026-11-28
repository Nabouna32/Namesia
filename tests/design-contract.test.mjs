import test from "node:test";
import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const globalCss = await readFile(join(root, "app/globals.css"), "utf8");
const featuredCss = await readFile(join(root, "components/features/catalog/FeaturedNames.module.css"), "utf8");
const layoutSource = await readFile(join(root, "app/layout.tsx"), "utf8");
const tokensCss = await readFile(join(root, "styles/material3/tokens.css"), "utf8");
const theme = await readFile(join(root, "lib/material-theme.ts"), "utf8");
const layout = await readFile(join(root, "app/layout.tsx"), "utf8");
const home = await readFile(join(root, "app/page.tsx"), "utf8");
const namesSource = await readFile(join(root, "lib/names.ts"), "utf8");
const fiche = await readFile(join(root, "lib/fiche-prenom.ts"), "utf8");
const schema = await readFile(join(root, "schemas/fiche-prenom.schema.json"), "utf8");
const messageComponent = await readFile(join(root, "components/material3/Snackbar.tsx"), "utf8");
const messageStyles = await readFile(join(root, "components/material3/Snackbar.module.css"), "utf8");
const composantsDoc = await readFile(join(root, "docs/design/COMPONENTS.md"), "utf8");
const designDoc = await readFile(join(root, "docs/design/NAVIGATION-AND-RESPONSIVE.md"), "utf8");
const architectureDoc = await readFile(join(root, "docs/ARCHITECTURE.md"), "utf8");
const materialVerificationDoc = await readFile(join(root, "docs/MATERIAL-3-VERIFICATION.md"), "utf8");
const navigationComponent = await readFile(join(root, "components/material3/NavigationDestinations.tsx"), "utf8");
const comparisonSelectionComponent = await readFile(join(root, "components/features/comparison/ComparisonSelection.tsx"), "utf8");
const agents = await readFile(join(root, "AGENTS.md"), "utf8");

async function collectCss(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (["node_modules", ".next", ".git"].includes(entry.name)) continue;
    const absolute = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await collectCss(absolute));
    else if (entry.name.endsWith(".module.css") || ["app/globals.css", "styles/material3/tokens.css"].includes(relative(root, absolute))) files.push(absolute);
  }
  return files;
}

const cssPaths = await collectCss(root);
const styles = await Promise.all(cssPaths.map(async (path) => ({
  path: relative(root, path).replaceAll("\\", "/"),
  content: await readFile(path, "utf8")
})));
const allCss = styles.map(({ content }) => content).join("\n");
const checkboxStyles = styles.find(({ path }) => path === "components/material3/Checkbox.module.css")?.content ?? "";

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

test("Roboto est la seule police de l’interface, sans police de substitution", () => {
  assert.match(layoutSource, /display: "block"/);
  assert.match(layoutSource, /adjustFontFallback: false/);
  assert.doesNotMatch(layoutSource, /display: "swap"/);
  assert.match(tokensCss, /--md-sys-typescale-body-large-font: var\(--font-roboto\);/);
});

test("les composants sont organisés par domaine et aucune primitive Namesia historique ne subsiste", async () => {
  const entries = await readdir(join(root, "components"), { withFileTypes: true });
  const rootEntries = entries.map((entry) => entry.name).sort();
  assert.deepEqual(rootEntries, ["features", "material3"], "components/ ne doit contenir que les domaines métier et la bibliothèque Material 3");
  await assert.rejects(readdir(join(root, "components/ui")), { code: "ENOENT" });
  const material3 = await readdir(join(root, "components/material3"));
  for (const name of ["AlertDialog.tsx", "Button.tsx", "Card.tsx", "Checkbox.tsx", "TextField.tsx", "IconButton.tsx", "SearchBar.tsx", "FilterChip.tsx", "InputChip.tsx", "Snackbar.tsx", "TopAppBar.tsx", "NavigationBar.tsx", "NavigationRail.tsx"]) {
    assert.ok(material3.includes(name), "Composant Material 3 manquant : " + name);
  }
});

test("les feuilles consomment les rôles Material sans alias hérités ni fallback", () => {
  assert.doesNotMatch(allCss, /--(?:color-[\w-]+|ink|muted|line|paper|surface|accent|sans|font-(?:sans|display)|radius-[\w-]+|space-\d+|motion-[\w-]+|shadow-[\w-]+)\b/);
  assert.doesNotMatch(allCss, /var\(\s*--[\w-]+\s*,/);
  assert.match(theme, /--md-sys-color-/);
  assert.match(theme, /specVersion: "2021"/);
  assert.doesNotMatch(theme, /maybeFallbackSpecVersion|fallback/i);
  assert.match(tokensCss, /--md-sys-typescale-title-large-size:/);
  assert.match(tokensCss, /--md-sys-shape-corner-extra-large:/);
  assert.match(tokensCss, /--md-sys-shape-corner-full: 9999px;/);
});

test("le pied de page reste en bas sur les pages courtes sans hauteur artificielle", () => {
  assert.match(globalCss, /\.app-shell\s*\{[^}]*display:\s*flex;[^}]*min-height:\s*100svh;[^}]*flex-direction:\s*column;/s);
  assert.match(globalCss, /\.app-content\s*\{[^}]*display:\s*flex;[^}]*flex:\s*1;[^}]*flex-direction:\s*column;/s);
  assert.match(globalCss, /\.app-content > main\s*\{[^}]*flex:\s*1;/s);
  assert.match(globalCss, /\.site-footer\s*\{[^}]*margin-top:\s*auto;/s);
  assert.doesNotMatch(globalCss, /\.page-main\s*\{[^}]*min-height:\s*70vh/s);
});

test("les animations globales utilisent les tokens de mouvement", () => {
  assert.match(tokensCss, /--md-sys-motion-easing-standard:/);
  assert.match(tokensCss, /--md-sys-motion-easing-emphasized:/);
  assert.match(tokensCss, /--md-sys-motion-duration-short3:/);
  assert.match(tokensCss, /--md-sys-motion-duration-medium1:/);
  assert.match(tokensCss, /--md-sys-motion-duration-medium4:/);
  assert.match(tokensCss, /--md-sys-state-hover-state-layer-opacity:/);
  assert.match(tokensCss, /--md-sys-state-focus-state-layer-opacity:/);
  assert.match(tokensCss, /--md-sys-state-pressed-state-layer-opacity:/);
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
  assert.match(globalCss, /\.skip-link\s*\{[^}]*z-index:\s*50;/s);
  assert.match(globalCss, /\.top-app-bar\s*\{[^}]*z-index:\s*30;/s);
  assert.doesNotMatch(globalCss, /\.navigation-item:focus-visible\s*\{[^}]*outline/s);
  assert.doesNotMatch(globalCss, /\.profile-toc a:focus-visible\s*\{[^}]*outline/s);
  assert.match(globalCss, /input:not\(\[type="search"\]\):focus-visible, select:focus-visible/);
  assert.match(allCss, /\.container:has\(input:focus-visible\)\s*\{[^}]*outline: 2px solid var\(--md-sys-color-primary\)/s);
});

test("TopAppBar suit la barre small M3 sans séparateur ajouté", () => {
  const topAppBar = globalCss.match(/\.top-app-bar\s*\{([^}]*)\}/s)?.[1] ?? "";
  assert.match(topAppBar, /height:\s*64px/);
  assert.match(topAppBar, /background:\s*var\(--md-sys-color-surface\)/);
  assert.doesNotMatch(topAppBar, /border-bottom/);
  assert.match(globalCss, /@media \(max-width: 599px\) \{[^]*?\.top-app-bar-caption \{\s*display: none;/);
});

test("les contrôles des favoris conservent l'indicateur global de focus", () => {
  const favorisStyles = styles.find(({ path }) => path === "components/features/favorites/FavoritesList.module.css")?.content ?? "";
  assert.doesNotMatch(favorisStyles, /:focus-visible[^{}]*\{[^}]*outline\s*:/s);
  assert.doesNotMatch(favorisStyles, /select:focus-visible/);
  assert.match(favorisStyles, /\.importButton input\s*\{[^}]*position:\s*absolute;[^}]*inset:\s*0;[^}]*width:\s*100%;[^}]*height:\s*100%;[^}]*opacity:\s*0;/s);
  assert.doesNotMatch(favorisStyles, /\.importButton input\s*\{[^}]*clip\s*:/s);
  assert.match(globalCss, /input:not\(\[type="search"\]\):focus-visible/);
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

  const selection = comparisonSelectionComponent;
  const selectionStyles = styles.find(({ path }) => path === "components/features/comparison/ComparisonSelection.module.css")?.content ?? "";
  const buttonStyles = styles.find(({ path }) => path === "components/material3/Button.module.css")?.content ?? "";
  assert.match(selection, /<InputChip/);
  assert.match(selection, /onRemove=/);
  const inputChipStyles = styles.find(({ path }) => path === "components/material3/InputChip.module.css")?.content ?? "";
  assert.ok(inputChipStyles.includes("var(--md-sys-color-outline-variant)"));
  assert.ok(inputChipStyles.includes("inset: 8px 0"));
  assert.ok(buttonStyles.includes("var(--md-sys-state-pressed-state-layer-opacity)"));
});

test("la feuille globale conserve un seul :root SSR et aucune couche d'overrides finale", () => {
  assert.equal((tokensCss.match(/:root\s*\{/g) ?? []).length, 1);
  assert.equal((globalCss.match(/:root\s*\{/g) ?? []).length, 0);
  assert.doesNotMatch(globalCss, /--md-sys-color-[\w-]+\s*:/);
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
  assert.match(tokensCss, /--md-sys-typescale-body-large-font: var\(--font-roboto\);/);
  assert.doesNotMatch(globalCss, /-font: Roboto;/);
});

test("tous les champs, y compris l'éditeur JSON, restent en Roboto Material 3", () => {
  assert.doesNotMatch(allCss, /ui-monospace|SFMono-Regular|Consolas|font-family:\s*monospace/i);
  const adminStyles = styles.find(({ path }) => path === "app/admin/admin.module.css")?.content ?? "";
  assert.match(adminStyles, /\.jsonField textarea\s*\{[^}]*font-family:\s*var\(--md-sys-typescale-body-medium-font\)[^}]*font-size:\s*var\(--md-sys-typescale-body-medium-size\)/s);
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
      assert.match(tokensCss, new RegExp("--md-sys-typescale-" + role + "-" + property + ":"), "Token manquant : " + role + "-" + property);
    }
    assert.ok(tokensCss.includes("--md-sys-typescale-" + role + "-size: " + size + "px;"), "Taille M3 incorrecte : " + role);
    assert.ok(tokensCss.includes("--md-sys-typescale-" + role + "-line-height: " + lineHeight + "px;"), "Interligne M3 incorrect : " + role);
    assert.ok(tokensCss.includes("--md-sys-typescale-" + role + "-weight: " + weight + ";"), "Graisse M3 incorrecte : " + role);
    assert.ok(tokensCss.includes("--md-sys-typescale-" + role + "-tracking: " + tracking + ";"), "Approche M3 incorrecte : " + role);
  }
  assert.doesNotMatch(allCss, /font-size\s*:[^;]*px/);
  const weights = [...allCss.matchAll(/font-weight:\s*([^;]+);/g)].map((match) => match[1].trim());
  assert.ok(weights.every((weight) => weight === "400" || weight === "500" || /^var\(--md-sys-typescale-[\w-]+-weight\)$/.test(weight)), `Graisses interdites : ${weights.join(", ")}`);
  assert.doesNotMatch(allCss, /font-family:\s*(?:Arial|sans-serif|system-ui)/i);
  assert.doesNotMatch(allCss, /text-transform:\s*uppercase/i);
});

test("l'approche typographique utilise exclusivement les tokens de rôle Material 3", () => {
  const approches = [...allCss.matchAll(/letter-spacing:\s*([^;]+);/g)].map((match) => match[1].trim());
  assert.ok(
    approches.every((valeur) => /^var\(--md-sys-typescale-[\w-]+-tracking\)$/.test(valeur)),
    "Chaque approche doit provenir du token de tracking de son rôle"
  );
  assert.match(globalCss, /\.section-heading h2\s*\{[^}]*letter-spacing:\s*var\(--md-sys-typescale-headline-medium-tracking\)/s);
  assert.match(globalCss, /\.profile-section-heading h2\s*\{[^}]*letter-spacing:\s*var\(--md-sys-typescale-headline-small-tracking\)/s);
  assert.match(globalCss, /\.eyebrow\s*\{[^}]*font-size:\s*var\(--md-sys-typescale-label-medium-size\)[^}]*line-height:\s*var\(--md-sys-typescale-label-medium-line-height\)/s);
  assert.match(globalCss, /\.profile-section-kicker\s*\{[^}]*font-size:\s*var\(--md-sys-typescale-label-medium-size\)/s);
  assert.match(globalCss, /\.symbolic-card > span,[^}]*font-size:\s*var\(--md-sys-typescale-label-small-size\)/s);
  const adminStyles = styles.find(({ path }) => path === "app/admin/admin.module.css")?.content ?? "";
  assert.match(adminStyles, /\.previewLabel\s*\{[^}]*font-size:\s*var\(--md-sys-typescale-label-medium-size\)[^}]*letter-spacing:\s*var\(--md-sys-typescale-label-medium-tracking\)/s);
});

test("les textes utilisent les interlignes de leur rôle Material 3", () => {
  const ratios = [...allCss.matchAll(/line-height:\s*(\d+(?:\.\d+)?);/g)].map((match) => match[1]);
  assert.deepEqual(ratios, ["0.95"], "Seul le monogramme de la fiche peut conserver un ratio local");
  assert.match(featuredCss, /\.letter\s*\{[^}]*line-height:\s*0\.95;/s);
  assert.match(globalCss, /\.profile-monogram\s*\{[^}]*line-height:\s*0\.95;/s);
  for (const role of ["body-large", "body-medium", "body-small", "headline-large"]) {
    assert.match(allCss, new RegExp("line-height:\\s*var\\(--md-sys-typescale-" + role + "-line-height\\)"));
  }
});

test("les rayons suivent les tokens ou les valeurs AndroidX source-vérifiées", () => {
  assert.doesNotMatch(allCss.replace(checkboxStyles, ""), /border-radius:\s*(?:\d+(?:\.\d+)?px|\d+%)/);
  assert.match(checkboxStyles, /border-radius:\s*2px/);
  const spacingPattern = /^\s*((?:margin|padding)(?:-(?:top|right|bottom|left|block|inline))?|gap|row-gap|column-gap)\s*:\s*([^;]+);/gm;
  for (const match of allCss.matchAll(spacingPattern)) {
    for (const pixel of match[2].matchAll(/(-?\d+(?:\.\d+)?)px/g)) {
      assert.ok(Number(pixel[1]) === 0 || Number(pixel[1]) % 4 === 0, `Espacement hors grille : ${match[1]} = ${pixel[1]}px`);
    }
  }
});

test("les données de fiche et les libellés de genre invalides échouent explicitement", () => {
  assert.doesNotMatch(namesSource, /\?\?/);
  assert.doesNotMatch(fiche, /\?\?/);
  assert.match(namesSource, /Genre de prénom non pris en charge/);
  assert.match(namesSource, /ne peut pas avoir un nom vide/);
  assert.match(schema, /"required":\["introduction","symbolic_associations"\]/);
  assert.doesNotMatch(fiche, /symbolic_associations\s*\?\?\s*\[\]/);
});


test("les cartes de prénoms acceptent les noms longs sans déborder ni couper leur contenu", () => {
  assert.match(globalCss, /\.name-card strong\s*\{[^}]*overflow-wrap:\s*anywhere/s);
  assert.match(featuredCss, /\.name\s*\{[^}]*min-width:\s*0/s);
  assert.match(featuredCss, /\.name strong\s*\{[^}]*overflow-wrap:\s*anywhere/s);
  assert.match(featuredCss, /\.card\s*\{[^}]*min-height:\s*184px/s);
  assert.match(featuredCss, /@media \(max-width: 599px\) \{[^}]*\.card\s*\{[^}]*min-height:\s*136px/s);
  assert.doesNotMatch(featuredCss, /\.card\s*\{[^}]*\n\s*height:/s);
  assert.doesNotMatch(globalCss, /\.featured-(?:grid|card|letter|bottom|name|action)\b/);
});

test("les catégories Rainbow utilisent des rôles explicites sans couleur de repli", () => {
  assert.match(theme, /--namesia-color-category-/);
  assert.match(allCss, /var\(--namesia-color-category-container\)/);
  assert.doesNotMatch(allCss, /var\(--namesia-color-category[^)]*,/);
  assert.doesNotMatch(allCss, /--md-sys-color-(?:success|warning|info|category|brand|on-brand)/);
});


test("les couleurs sémantiques sont des extensions M3 avec annonces accessibles", () => {
  for (const role of ["success", "warning", "info"]) {
    assert.ok(theme.includes('tokens["--namesia-color-" + role]'));
    assert.match(messageStyles, new RegExp("--namesia-color-" + role + "-container"));
    assert.match(messageStyles, new RegExp("--namesia-color-on-" + role + "-container"));
  }
  assert.match(messageStyles, /--md-sys-color-error-container/);
  assert.match(messageStyles, /--md-sys-color-on-error-container/);
  assert.match(messageStyles, /min-height:\s*48px/);
  assert.match(messageStyles, /max-width:\s*560px/);
  assert.match(messageStyles, /corner-extra-small/);
  assert.match(messageStyles, /md-sys-color-inverse-surface/);
  assert.match(messageStyles, /md-sys-color-inverse-on-surface/);
  assert.ok(messageStyles.includes("box-shadow:") && messageStyles.includes("color-mix"));
  assert.match(messageComponent, /severity = "neutral"/);
  assert.match(messageComponent, /action\?: ReactNode/);
  assert.match(messageComponent, /dismissAction\?: ReactNode/);
  assert.match(messageComponent, /actionOnNewLine\?: boolean/);
  assert.match(messageComponent, /actionOnNewLine && action/);
  assert.match(messageComponent, /<div className={classes} role=/);
  assert.match(messageComponent, /styles\.action/);
  assert.match(messageComponent, /styles\.dismissAction/);
  assert.doesNotMatch(messageComponent, /<p className={classes}/);
  assert.match(messageStyles, /--snackbar-action-color/);
  assert.match(messageStyles, /--snackbar-dismiss-action-color/);
  assert.match(messageStyles, /\.actionOnNewLine/);
  assert.match(messageStyles, /min-height: 68px/);
  assert.match(messageStyles, /width: 100%/);
  assert.match(messageStyles, /max-width: 560px/);
  assert.match(messageComponent, /role={urgent \? "alert" : "status"}/);
  assert.doesNotMatch(allCss, /--md-sys-color-(?:success|warning|info)\b/);
});

test("toute nouvelle page doit suivre le registre de composants Material 3", () => {
  assert.match(composantsDoc, /Correspondance avec les composants Material 3/);
  assert.match(architectureDoc, /`AlertDialog` encadre la confirmation de la publication publique/);
  assert.match(composantsDoc, /Contrat obligatoire pour toute nouvelle page/);
  assert.match(composantsDoc, /TopAppBar/);
  assert.match(composantsDoc, /NavigationBar/);
  assert.match(composantsDoc, /FilterChip/);
  assert.match(composantsDoc, /SearchBar/);
  assert.match(composantsDoc, /components\/material3/);
  assert.match(composantsDoc, /noms, variantes, anatomie, dimensions et états suivent AndroidX Compose Material 3/);
  assert.match(composantsDoc, /ports explicites des contrats AndroidX/);
  assert.match(composantsDoc, /wrappers de convenance/);
  assert.doesNotMatch(composantsDoc, /ChampRecherche|ChipFiltre|MessageStatut/);
  assert.match(composantsDoc, /SearchBarTokens/);
  assert.match(composantsDoc, /ButtonSmallTokens/);
  assert.match(composantsDoc, /IconButton/);
  assert.match(materialVerificationDoc, /ButtonSmallTokens\.ContainerHeight/);
  assert.match(materialVerificationDoc, /ButtonDefaults\.IconSize = 18\.dp/);
  assert.match(materialVerificationDoc, /40\.dp/);
  assert.match(materialVerificationDoc, /MinWidth = 58\.dp/);
  assert.match(materialVerificationDoc, /DisabledContainerOpacity = 0\.1f/);

  assert.match(materialVerificationDoc, /SearchBarTokens\.ContainerHeight/);
  assert.match(materialVerificationDoc, /56\.dp/);
  assert.match(materialVerificationDoc, /TonalElevation = Level0/);
  assert.match(materialVerificationDoc, /ShadowElevation = Level0/);
  assert.ok(composantsDoc.includes("github.com/androidx/androidx"));
  assert.ok(composantsDoc.includes("919e948eaa351c590e7e6fc89d4014fad7a6e78c"));
  assert.doesNotMatch(composantsDoc, /androidx-main/);
  assert.doesNotMatch(composantsDoc, /(?:blob|tree)[/]main[/]/);
  assert.ok(materialVerificationDoc.includes("Compose Material 3 `1.5.0` stable"));
  assert.ok(materialVerificationDoc.includes("919e948eaa351c590e7e6fc89d4014fad7a6e78c"));
  assert.doesNotMatch(materialVerificationDoc, /androidx-main/);
  assert.ok(materialVerificationDoc.includes("b03ef34bb53a15c3ba41bf963eb3e2c5c353c85f"));
  assert.ok(materialVerificationDoc.includes("5c7b286a7684599f275a0f7b4b77752ae751b6bd"));
  assert.ok(materialVerificationDoc.includes("d4f63c567f73b16717f4c04b57fa6390d0b2312d"));
  assert.doesNotMatch(materialVerificationDoc, /b4de401/);
  assert.doesNotMatch(materialVerificationDoc, /(?:blob|tree)[/]main[/]/);
  assert.match(agents, /DESIGN-SYSTEM\.md/);
});

test("le hero d'accueil sépare le récit et les outils dans une composition Fidelity responsive", () => {
  assert.match(home, /className="hero-intro"/);
  assert.match(home, /className="hero-tools"/);
  assert.match(home, /<h2>Un prénom en tête\s*\?<\/h2>/);
  assert.match(home, /<NameSearch names=\{names\} compact \/>/);
  assert.match(globalCss, /\.hero-content\s*\{[^}]*display:\s*grid/s);
  assert.match(globalCss, /\.hero-tools\s*\{[^}]*background:\s*var\(--md-sys-color-surface-container-lowest\)/s);
  assert.match(globalCss, /\.hero-copy\s*\{[^}]*color:\s*var\(--md-sys-color-on-surface-variant\)/s);
  assert.match(globalCss, /@media \(min-width:\s*840px\)[\s\S]*?\.hero-content\s*\{[^}]*grid-template-columns:/);
  assert.match(featuredCss, /@media \(max-width:\s*839px\) \{[^}]*\.grid\s*\{[^}]*grid-template-columns:\s*repeat\(2/s);
  assert.doesNotMatch(globalCss, /@media \(min-width:\s*900px\)/);
});


test("les compositions suivent les classes de fenêtre AndroidX vérifiées", () => {
  assert.match(globalCss, /@media \(max-width:\s*599px\)/);
  assert.match(globalCss, /@media \(min-width:\s*600px\) and \(max-width:\s*839px\)/);
  assert.match(globalCss, /@media \(min-width:\s*840px\)/);
  assert.match(designDoc, /compact sous 600 dp, medium de 600 à 839 dp, expanded de 840 à 1199 dp/);
  assert.ok(materialVerificationDoc.includes("https://developer.android.com/reference/androidx/window/core/layout/WindowSizeClass"));
  assert.match(materialVerificationDoc, /vérifiés le 25 novembre 2026/);
});

test("les en-têtes de section restent lisibles et leurs actions accessibles sur mobile", () => {
  assert.match(globalCss, /\.text-link\s*\{[^}]*display:\s*inline-flex/s);
  assert.match(globalCss, /\.text-link\s*\{[^}]*min-height:\s*48px/s);
  assert.match(globalCss, /@media \(max-width:\s*599px\)[\s\S]*?\.section-heading\s*\{[^}]*flex-direction:\s*column/s);
});


test("les boutons et FilterChip utilisent le rôle typographique M3 label-large", () => {
  const buttonStyles = styles.find(({ path }) => path === "components/material3/Button.module.css")?.content ?? "";
  const filterChipStyles = styles.find(({ path }) => path === "components/material3/FilterChip.module.css")?.content ?? "";
  for (const [name, content] of [["Button", buttonStyles], ["FilterChip", filterChipStyles]]) {
    assert.match(content, /font-size:\s*var\(--md-sys-typescale-label-large-size\)/, name + " doit utiliser label-large");
    assert.match(content, /font-weight:\s*var\(--md-sys-typescale-label-large-weight\)/, name + " doit utiliser la graisse du rôle");
    assert.match(content, /line-height:\s*var\(--md-sys-typescale-label-large-line-height\)/, name + " doit utiliser l'interligne du rôle");
    assert.match(content, /letter-spacing:\s*var\(--md-sys-typescale-label-large-tracking\)/, name + " doit utiliser l'approche du rôle");
    assert.doesNotMatch(content, /typescale-body-(?:medium|large)-(?:size|weight|line-height|tracking)/, name + " ne doit pas détourner un rôle body");
  }
  assert.doesNotMatch(filterChipStyles, /\.initial\s*\{[^}]*font-size:/s, "La variante initiale ne doit pas remplacer la typographie M3");
  assert.match(filterChipStyles, /min-height:\s*48px/, "La cible interactive doit rester de 48 px");
  assert.match(filterChipStyles, /\.chip::before\s*\{[^}]*inset:\s*8px 0/s, "La capsule visuelle doit mesurer 32 px dans la cible de 48 px");
  assert.match(filterChipStyles, /border:\s*1px solid var\(--md-sys-color-outline-variant\)/, "Le contour au repos doit utiliser outline-variant");
  assert.match(filterChipStyles, /\.chip\[aria-pressed="true"\]::before\s*\{[^}]*border:\s*0/s, "La sélection M3 ne doit pas conserver de contour");
  assert.match(filterChipStyles, /--md-sys-state-hover-state-layer-opacity/);
  assert.match(filterChipStyles, /--md-sys-state-focus-state-layer-opacity/);
  assert.match(filterChipStyles, /--md-sys-state-pressed-state-layer-opacity/);
  assert.match(composantsDoc, /FilterChipTokens\.ContainerHeight.*32 dp/);
});


test("NavigationBar et NavigationRail utilisent le rôle M3 label-medium à toutes les largeurs", () => {
  const navigationRule = globalCss.match(/\.navigation-item\s*\{([^}]*)\}/s)?.[1] ?? "";
  assert.match(navigationRule, /font-size:\s*var\(--md-sys-typescale-label-medium-size\)/);
  assert.match(navigationRule, /font-weight:\s*var\(--md-sys-typescale-label-medium-weight\)/);
  assert.match(navigationRule, /line-height:\s*var\(--md-sys-typescale-label-medium-line-height\)/);
  assert.match(navigationRule, /letter-spacing:\s*var\(--md-sys-typescale-label-medium-tracking\)/);
  assert.doesNotMatch(globalCss, /navigation-item[^}]*font-size:\s*var\(--md-sys-typescale-(?:body-small|label-small)-size\)/s);
  assert.match(composantsDoc, /NavigationBar[\s\S]*label-medium/);
  assert.match(composantsDoc, /NavigationRail[\s\S]*label-medium/);
});



test("les listes de navigation conservent leur sémantique accessible", () => {
  const navigationItems = globalCss.match(/\.navigation-items\s*\{([^}]*)\}/s)?.[1] ?? "";
  assert.match(navigationItems, /display:\s*flex/);
  assert.doesNotMatch(navigationItems, /display:\s*contents/);
  assert.match(navigationComponent, /const pathname = usePathname\(\);/);
  assert.doesNotMatch(navigationComponent, /usePathname\(\)\s*\?\?/);
  assert.match(navigationComponent, /<ul className="navigation-items">/);
  assert.match(navigationComponent, /<li key=\{destination\.href\}>/);
});

test("la navigation paysage réserve les 80 dp réellement affichés", () => {
  const paysage = globalCss.match(/@media \(min-width: 600px\) and \(max-height: 480px\) \{([\s\S]*?)\n\}/)?.[1] ?? "";
  assert.match(paysage, /\.navigation-bar \.navigation-item \{ min-height: 64px/);
  assert.match(paysage, /padding-bottom: calc\(80px \+ env\(safe-area-inset-bottom\)\)/);
  assert.doesNotMatch(paysage, /padding-bottom: calc\(72px/);
});

test("NavigationBar reproduit les 80 dp de TallContainerHeight de Compose Material 3 1.5.0", () => {
  const navigationBar = globalCss.match(/\.navigation-bar\s*\{([^}]*)\}/s)?.[1] ?? "";
  assert.match(navigationBar, /padding:\s*8px 8px calc\(8px \+ env\(safe-area-inset-bottom\)\)/);
  assert.doesNotMatch(navigationBar, /border-top:/);
  assert.match(globalCss, /\.navigation-bar \.navigation-item \{\s*min-height:\s*64px/);
  assert.match(globalCss, /\.app-content \{\s*padding-bottom:\s*calc\(80px \+ env\(safe-area-inset-bottom\)\)/);
  assert.doesNotMatch(globalCss, /padding-bottom:\s*calc\(64px \+ env\(safe-area-inset-bottom\)\)/);
  assert.match(composantsDoc, /TallContainerHeight/);
});
