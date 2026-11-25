import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

const rootOg = await readFile(new URL("../app/opengraph-image.tsx", import.meta.url), "utf8");
const profileOg = await readFile(new URL("../app/prenoms/[slug]/opengraph-image.tsx", import.meta.url), "utf8");
const namesSource = await readFile(new URL("../lib/names.ts", import.meta.url), "utf8");
const fontLoader = await readFile(new URL("../lib/polices-open-graph.ts", import.meta.url), "utf8");
const fontAsset = await readFile(new URL("../assets/fonts/Roboto-Regular.ttf.base64", import.meta.url), "utf8");
const icon = await readFile(new URL("../app/icon.svg", import.meta.url), "utf8");

test("les deux aperçus chargent la même Roboto locale sans police de substitution", () => {
  for (const source of [rootOg, profileOg]) {
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


test("l’aperçu d’une fiche ne charge que les champs nécessaires au rendu social", () => {
  assert.match(profileOg, /getNameOpenGraphBySlug\(slug\)/);
  assert.doesNotMatch(profileOg, /getNameBySlug|introduction|symbolic_associations/);
  assert.match(namesSource, /export const getNameOpenGraphBySlug = cache/);
  assert.match(namesSource, /\.select\("slug, display_name, gender, name_profiles!inner\(status, published_at\)"\)/);
});
