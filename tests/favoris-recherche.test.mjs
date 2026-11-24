import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const source = await readFile(new URL("../components/FavoriteList.tsx", import.meta.url), "utf8");

test("les suggestions des favoris réutilisent le moteur commun après le filtre de genre", () => {
  assert.match(source, /normaliserRecherche, suggererPrenomsProches/);
  assert.match(source, /favoris\.filter\(\(prenom\) => !genreActifValide \|\| prenom\.genre === genreActifValide\)/);
  assert.match(source, /suggererPrenomsProches\([\s\S]*?recherche\s*\)/);
  assert.match(source, /favorisAffiches\.slice\(0, nombreVisible\)/);
});

test("les suggestions ne remplacent jamais un résultat exact", () => {
  assert.match(source, /favorisFiltres\.length === 0 && termeNormalise/);
  assert.match(source, /favorisFiltres\.length > 0 \? favorisFiltres : favorisProches/);
});
