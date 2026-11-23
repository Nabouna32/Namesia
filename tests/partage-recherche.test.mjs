import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const partage = await readFile(new URL("../components/partager-fiche.tsx", import.meta.url), "utf8");
const catalogue = await readFile(new URL("../components/recherche-prenoms.tsx", import.meta.url), "utf8");
const comparateur = await readFile(new URL("../components/comparateur-prenoms.tsx", import.meta.url), "utf8");

test("le partage ne transmet que les paramètres explicitement autorisés", () => {
  assert.match(partage, /parametres\?: string\[\]/);
  assert.match(partage, /for \(const parametre of parametres\)/);
  assert.match(partage, /recherche\.get\(parametre\)/);
  assert.doesNotMatch(partage, /searchParams\.forEach|searchParams\.entries/);
});

test("le catalogue partage sa recherche, ses filtres et le lot révélé", () => {
  assert.match(catalogue, /label="Partager cette recherche"/);
  assert.match(catalogue, /parametres=\{\["q", "genre", "lettre", "limite"\]\}/);
  assert.match(catalogue, /synchroniserUrl && \(filtresActifs \|\| nombreVisible > 24\)/);
});

test("le comparateur conserve uniquement sa sélection lors du partage", () => {
  assert.match(comparateur, /parametres=\{\["prenoms"\]\}/);
});
