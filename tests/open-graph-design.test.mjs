import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

const rootOg = await readFile(new URL("../app/opengraph-image.tsx", import.meta.url), "utf8");
const profilePage = await readFile(new URL("../app/prenoms/[slug]/page.tsx", import.meta.url), "utf8");
const fontLoader = await readFile(new URL("../lib/polices-open-graph.ts", import.meta.url), "utf8");
const fontAsset = await readFile(new URL("../assets/fonts/Roboto-Regular.ttf.base64", import.meta.url), "utf8");
const icon = await readFile(new URL("../app/icon.svg", import.meta.url), "utf8");
const wrangler = JSON.parse(await readFile(new URL("../wrangler.jsonc", import.meta.url), "utf8"));

test("l’aperçu Open Graph utilise exclusivement les rôles Material 3 Fidelity", () => {
  assert.match(rootOg, /getMaterialThemeTokens\(false\)/);
  assert.match(rootOg, /--md-sys-color-background/);
  assert.match(rootOg, /--md-sys-color-primary/);
  assert.match(rootOg, /--md-sys-color-surface-container-lowest/);
  assert.doesNotMatch(rootOg, /#[0-9a-f]{3,8}\b/i);
  assert.doesNotMatch(rootOg, /linear-gradient\s*\(/i);
});

test("l’aperçu Open Graph charge Roboto locale sans police de substitution", () => {
  assert.match(rootOg, /fontFamily: "Roboto"/);
  assert.match(rootOg, /fonts: await chargerPolicesOpenGraph\(\)/);
  assert.doesNotMatch(rootOg, /Georgia|Times New Roman|serif/);
  assert.match(fontLoader, /Roboto-Regular\.ttf\.base64/);
  assert.match(fontLoader, /Buffer\.from\(contenu, "base64"\)/);
  assert.match(fontLoader, /weight: 400/);
  assert.ok(fontAsset.trim().length > 200_000);
  assert.match(fontAsset, /^[A-Za-z0-9+/=\s]+$/);
});

test("la police Open Graph est incluse dans le système de fichiers virtuel du Worker", () => {
  assert.equal(wrangler.find_additional_modules, true);
  assert.equal(wrangler.base_dir, ".");
  assert.equal(wrangler.preserve_file_names, true);
  assert.ok(wrangler.rules.some((rule) =>
    rule.type === "Text" && rule.globs.includes("assets/fonts/Roboto-Regular.ttf.base64") && rule.fallthrough === true
  ));
});

test("le favicon dessine le monogramme en vecteurs sans dépendre d’une police système", () => {
  assert.match(icon, /<path /);
  assert.match(icon, /<circle /);
  assert.doesNotMatch(icon, /<text|font-family|Georgia|serif/);
});

test("les fiches héritent de l’aperçu statique commun sans surcharge d’image dynamique", () => {
  assert.match(profilePage, /card: "summary_large_image"/);
  assert.match(profilePage, /images:\s*\["\/opengraph-image"\]/);
  assert.doesNotMatch(profilePage, /\/prenoms\/\$\{name\.slug\}\/opengraph-image/);
  await assert.rejects(readFile(new URL("../app/prenoms/[slug]/opengraph-image.tsx", import.meta.url)));
});
