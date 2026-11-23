import assert from "node:assert/strict";
import test from "node:test";
import {
  ajouterConsultation,
  lireHistoriqueSession,
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

test("l'historique de session se recharge en conservant l'ordre et sans doublons", () => {
  assert.deepEqual(
    lireHistoriqueSession(JSON.stringify(["alice", "bob", "alice", "charlie"])),
    ["alice", "bob", "charlie"]
  );
});

test("l'absence de sauvegarde démarre avec un historique vide", () => {
  assert.deepEqual(lireHistoriqueSession(null), []);
});

test("une sauvegarde invalide est rejetée", () => {
  assert.throws(() => lireHistoriqueSession('{"slugs":[]}'), /historique est invalide/);
  assert.throws(() => lireHistoriqueSession('["alice", 42]'), /historique est invalide/);
  assert.throws(() => lireHistoriqueSession('["../admin"]'), /historique est invalide/);
});

test("une sauvegarde trop longue est limitée aux huit consultations les plus récentes", () => {
  const slugs = Array.from({ length: 12 }, (_, index) => "prenom-" + index);
  assert.deepEqual(lireHistoriqueSession(JSON.stringify(slugs)), slugs.slice(0, NOMBRE_MAX_HISTORIQUE));
});
