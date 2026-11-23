import assert from "node:assert/strict";
import test from "node:test";
import {
  ajouterConsultation,
  NOMBRE_MAX_HISTORIQUE
} from "../lib/historique-prenoms.ts";

test("une nouvelle consultation passe en tête sans doublon", () => {
  assert.deepEqual(
    ajouterConsultation(["alice", "bob", "charlie"], "bob"),
    ["bob", "alice", "charlie"]
  );
});

test("une nouvelle consultation conserve au plus huit prénoms", () => {
  const slugs = Array.from({ length: NOMBRE_MAX_HISTORIQUE }, (_, index) => `prenom-${index}`);
  assert.deepEqual(
    ajouterConsultation(slugs, "nouveau"),
    ["nouveau", ...slugs.slice(0, NOMBRE_MAX_HISTORIQUE - 1)]
  );
});

test("une consultation sans slug ne modifie pas l'historique", () => {
  const slugs = ["alice", "bob"];
  assert.equal(ajouterConsultation(slugs, ""), slugs);
});
