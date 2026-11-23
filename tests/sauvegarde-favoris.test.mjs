import assert from "node:assert/strict";
import test from "node:test";
import { creerSauvegardeFavoris, lireSauvegardeFavoris, normaliserSlugsFavoris } from "../lib/sauvegarde-favoris.ts";

test("la sauvegarde exportée est versionnée et dédupliquée", () => {
  const sauvegarde = JSON.parse(creerSauvegardeFavoris(["alice", "jean-luc", "alice"]));

  assert.deepEqual(sauvegarde, {
    schema_version: 1,
    slugs: ["alice", "jean-luc"]
  });
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
