import assert from "node:assert/strict";
import test from "node:test";
import {
  addHistoryVisit,
  removeHistoryVisit,
  parseSessionHistory,
  MAX_HISTORY_ITEMS
} from "../lib/history.ts";

test("une nouvelle consultation passe en tête sans doublon", () => {
  assert.deepEqual(
    addHistoryVisit(["alice", "bob", "charlie"], "bob"),
    ["bob", "alice", "charlie"]
  );
});

test("une nouvelle consultation conserve au plus huit prénoms", () => {
  const slugs = Array.from({ length: MAX_HISTORY_ITEMS }, (_, index) => `prenom-${index}`);
  assert.deepEqual(
    addHistoryVisit(slugs, "nouveau"),
    ["nouveau", ...slugs.slice(0, MAX_HISTORY_ITEMS - 1)]
  );
});

test("une consultation sans slug ne modifie pas l'historique", () => {
  const slugs = ["alice", "bob"];
  assert.equal(addHistoryVisit(slugs, ""), slugs);
});

test("l'historique de session se recharge en conservant l'ordre et sans doublons", () => {
  assert.deepEqual(
    parseSessionHistory(JSON.stringify(["alice", "bob", "alice", "charlie"])),
    ["alice", "bob", "charlie"]
  );
});

test("l'absence de sauvegarde démarre avec un historique vide", () => {
  assert.deepEqual(parseSessionHistory(null), []);
});

test("une sauvegarde invalide est rejetée", () => {
  assert.throws(() => parseSessionHistory('{"slugs":[]}'), /historique est invalide/);
  assert.throws(() => parseSessionHistory('["alice", 42]'), /historique est invalide/);
  assert.throws(() => parseSessionHistory('["../admin"]'), /historique est invalide/);
});

test("une sauvegarde trop longue est limitée aux huit consultations les plus récentes", () => {
  const slugs = Array.from({ length: 12 }, (_, index) => "prenom-" + index);
  assert.deepEqual(parseSessionHistory(JSON.stringify(slugs)), slugs.slice(0, MAX_HISTORY_ITEMS));
});

test("retirer une consultation ne modifie que l'entrée demandée", () => {
  assert.deepEqual(removeHistoryVisit(["alice", "bob", "charlie"], "bob"), ["alice", "charlie"]);
});

test("retirer une consultation absente laisse l'historique inchangé", () => {
  const slugs = ["alice", "bob"];
  assert.deepEqual(removeHistoryVisit(slugs, "inconnu"), slugs);
});

test("retirer une consultation vide conserve les autres entrées", () => {
  assert.deepEqual(removeHistoryVisit(["alice", "bob"], ""), ["alice", "bob"]);
});
