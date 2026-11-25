import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

const rootOg = await readFile(new URL("../app/opengraph-image.tsx", import.meta.url), "utf8");
const profilePage = await readFile(new URL("../app/prenoms/[slug]/page.tsx", import.meta.url), "utf8");
const fontLoader = await readFile(new URL("../lib/polices-open-graph.ts", import.meta.url), "utf8");
const fontAsset = await readFile(new URL("../assets/fonts/Roboto-Regular.ttf.base64", import.meta.url), "utf8");
const icon = await readFile(new URL("../app/icon.svg", import.meta.url), "utf8");

test("l’aperçu Open Graph commun charge Roboto locale sans police de substitution", () => {
  for (const source of [rootOg]) {
    assert.match(source, /fontFamily: "Roboto"/);
    assert.match(source, /fonts: await chargerPolicesOpenGraph\(\)/);
    assert.doesNotMatch(source, /Georgia|Times New Roman|serif/);
  }
  assert.match(fontLoader, /Roboto-Regular\.ttf\.base64/);
  assert.match(fontLoader, /Buffer\.from\(contenu, "base64"\)/);
  assert.match(fontLoader, /weight: 400/);
  assert.ok(fontAsset.trim().length > 200_000);
  assert.match(fontAsset, /^[A-Za-z0-9+/=\s]+$/);
});

test("le favicon dessine le monogramme en vecteurs sans dépendre d'une police système", () => {
  assert.match(icon, /<path /);
  assert.match(icon, /<circle /);
  assert.doesNotMatch(icon, /<text|font-family|Georgia|serif/);
});


test("les fiches héritent de l’aperçu statique sans surcharge d’image dynamique", () => {
  assert.match(profilePage, /card: "summary_large_image"/);
  assert.doesNotMatch(profilePage, /images:\s*\[/);
  assert.doesNotMatch(profilePage, /opengraph-image/);
});
