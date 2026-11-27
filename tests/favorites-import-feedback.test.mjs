import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const favoris = await readFile(new URL("../components/features/favorites/FavoritesList.tsx", import.meta.url), "utf8");

test("un import partiel utilise un avertissement et non un succès", () => {
  assert.match(favoris, /setImportPartiel\(resultat\.nombreIgnoreLimite > 0 \|\| resultat\.nombreIgnoreIndisponible > 0\)/);
  assert.match(favoris, /<Snackbar severity=\{importPartiel \? "warning" : "success"\}>\{messageImport\}<\/Snackbar>/);
});

test("un nouvel import efface le retour de copie lié à l'ancienne sélection", () => {
  assert.match(favoris, /async function importerFavoris\([^]*?if \(!fichier\) return;\s*effacerFeedbackCopie\(\);/);
  assert.match(favoris, /const resultat = await ajouterPlusieurs\(slugsImportes\)/);
  assert.doesNotMatch(favoris, /migrerFavorisLocaux|localStorage/);
});
