import assert from "node:assert/strict";
import test from "node:test";
import {
  ajouterConsultation,
  lireHistorique,
  NOMBRE_MAX_HISTORIQUE
} from "../lib/historique-prenoms.ts";

test("un historique absent est vide", () => {
  assert.deepEqual(lireHistorique(null), []);
  assert.deepEqual(lireHistorique(""), []);
});

test("la lecture déduplique et limite les entrées les plus anciennes", () => {
  const slugs = Array.from({ length: 10 }, (_, index) => `prenom-${index}`);
  assert.deepEqual(
    lireHistorique(JSON.stringify([...slugs, "prenom-0"])),
    slugs.slice(0, NOMBRE_MAX_HISTORIQUE)
  );
});

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

test("un historique mal formé est rejeté", () => {
  assert.throws(() => lireHistorique("{"), SyntaxError);
  assert.throws(() => lireHistorique(JSON.stringify({ slugs: ["alice"] })), TypeError);
  assert.throws(() => lireHistorique(JSON.stringify(["alice", 42])), TypeError);
  assert.throws(() => lireHistorique(JSON.stringify([""])), TypeError);
});
