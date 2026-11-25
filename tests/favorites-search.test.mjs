import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const source = await readFile(new URL("../components/features/favorites/FavoritesList.tsx", import.meta.url), "utf8");

test("les suggestions des favoris réutilisent le moteur commun après le filtre de genre", () => {
  assert.match(source, /normalizeSearchTerm, suggestSimilarNames/);
  assert.match(source, /favoris\.filter\(\(prenom\) => !genreActifValide \|\| prenom\.gender === genreActifValide\)/);
  assert.match(source, /suggestSimilarNames\([\s\S]*?recherche\s*\)/);
  assert.match(source, /favorisAffiches\.slice\(0, nombreVisible\)/);
});

test("les suggestions ne remplacent jamais un résultat exact", () => {
  assert.match(source, /favorisFiltres\.length === 0 && termeNormalise/);
  assert.match(source, /favorisFiltres\.length > 0 \? favorisFiltres : favorisProches/);
});
