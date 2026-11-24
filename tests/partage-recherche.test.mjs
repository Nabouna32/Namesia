import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const partage = await readFile(new URL("../components/ShareLink.tsx", import.meta.url), "utf8");
const catalogue = await readFile(new URL("../components/NameSearch.tsx", import.meta.url), "utf8");
const comparateur = await readFile(new URL("../components/NameComparator.tsx", import.meta.url), "utf8");

test("le partage ne transmet que les paramètres explicitement autorisés", () => {
  assert.match(partage, /parameters\?: string\[\]/);
  assert.match(partage, /for \(const parameter of parameters\)/);
  assert.match(partage, /recherche\.get\(parameter\)/);
  assert.doesNotMatch(partage, /searchParams\.forEach|searchParams\.entries/);
});

test("le catalogue partage sa recherche, ses filtres et le lot révélé", () => {
  assert.match(catalogue, /label="Partager cette recherche"/);
  assert.match(catalogue, /parameters=\{\["q", "genre", "lettre", "limite"\]\}/);
  assert.match(catalogue, /synchroniserUrl && \(filtresActifs \|\| nombreVisible > 24\)/);
});

test("le comparateur conserve uniquement sa sélection lors du partage", () => {
  assert.match(comparateur, /parameters=\{\["prenoms"\]\}/);
});
