import assert from "node:assert/strict";
import test from "node:test";
import { creerSauvegardeFavoris, fusionnerFavoris, lireSauvegardeFavoris, normaliserSlugsFavoris, LIMITE_FAVORIS } from "../lib/sauvegarde-favoris.ts";

test("la sauvegarde exportée est versionnée et dédupliquée", () => {
  const sauvegarde = JSON.parse(creerSauvegardeFavoris(["alice", "jean-luc", "alice"]));

  assert.deepEqual(sauvegarde, {
    schema_version: 1,
    slugs: ["alice", "jean-luc"]
  });
});

test("l’export refuse les identifiants invalides", () => {
  assert.throws(() => creerSauvegardeFavoris(["Alice"]), /identifiants de prénoms invalides/);
});

test("l’import valide et déduplique les identifiants", () => {
  assert.deepEqual(
    lireSauvegardeFavoris({ schema_version: 1, slugs: ["alice", "jean-luc", "alice"] }),
    ["alice", "jean-luc"]
  );
});

test("la validation commune déduplique et rejette les slugs invalides ou les listes excessives", () => {
  assert.deepEqual(normaliserSlugsFavoris(["alice", "alice", "jean-luc"]), ["alice", "jean-luc"]);
  for (const invalide of [null, {}, ["Alice"], ["../admin"], [""], Array.from({ length: 10_001 }, (_, index) => `prenom-${index}`)]) {
    assert.equal(normaliserSlugsFavoris(invalide), null);
  }
});

test("l’import refuse les formats inconnus", () => {
  assert.throws(
    () => lireSauvegardeFavoris({ schema_version: 2, slugs: ["alice"] }),
    /version de sauvegarde/
  );
  assert.throws(
    () => lireSauvegardeFavoris({ schema_version: 1, slugs: ["alice"], contenu: "interdit" }),
    /format de sauvegarde/
  );
});

test("l’import refuse les slugs invalides et les listes excessives", () => {
  assert.throws(
    () => lireSauvegardeFavoris({ schema_version: 1, slugs: ["Alice Martin"] }),
    /identifiant de prénom invalide/
  );
  const tropDeFavoris = Array.from({ length: 10_001 }, (_, index) => `prenom-${index}`);
  assert.throws(
    () => lireSauvegardeFavoris({ schema_version: 1, slugs: tropDeFavoris }),
    /10 000/
  );
});

test("l’import refuse une valeur qui n’est pas un objet", () => {
  assert.throws(() => lireSauvegardeFavoris(["alice"]), /objet JSON/);
});

test("la fusion des favoris signale explicitement les éléments ignorés au plafond", () => {
  const existants = Array.from({ length: LIMITE_FAVORIS - 1 }, (_, index) => `prenom-${index}`);
  const resultat = fusionnerFavoris(existants, [existants[0], "nouveau-un", "nouveau-deux"]);

  assert.equal(resultat.slugs.length, LIMITE_FAVORIS);
  assert.equal(resultat.nombreAjoute, 1);
  assert.equal(resultat.nombreIgnoreLimite, 1);
  assert.equal(resultat.slugs.at(-1), "nouveau-un");
});

test("une liste déjà pleine ne masque pas les favoris refusés à l'import", () => {
  const existants = Array.from({ length: LIMITE_FAVORIS }, (_, index) => `prenom-${index}`);
  const resultat = fusionnerFavoris(existants, [existants[5], "nouveau-un", "nouveau-deux"]);

  assert.equal(resultat.nombreAjoute, 0);
  assert.equal(resultat.nombreIgnoreLimite, 2);
  assert.equal(resultat.slugs.length, LIMITE_FAVORIS);
});

test("une sauvegarde déjà présente n'est pas présentée comme un dépassement de capacité", () => {
  const resultat = fusionnerFavoris(["alice", "jean-luc"], ["alice", "jean-luc"]);

  assert.equal(resultat.nombreAjoute, 0);
  assert.equal(resultat.nombreIgnoreLimite, 0);
});
