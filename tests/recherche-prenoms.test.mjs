import assert from "node:assert/strict";
import test from "node:test";
import { normaliserRecherche } from "../lib/recherche-prenoms.ts";

test("la recherche ignore les accents et la casse", () => {
  assert.equal(normaliserRecherche(" ÉLODIE "), "elodie");
});

test("la recherche rapproche les séparateurs des prénoms composés", () => {
  assert.equal(normaliserRecherche("Jean Luc"), "jeanluc");
  assert.equal(normaliserRecherche("Jean-Luc"), "jeanluc");
  assert.equal(normaliserRecherche("O Connor"), "oconnor");
  assert.equal(normaliserRecherche("O’Connor"), "oconnor");
});

test("un séparateur isolé ne devient pas une recherche vide", () => {
  assert.equal(normaliserRecherche("-"), "-");
});

test("la recherche développe les ligatures françaises et latines", () => {
  assert.equal(normaliserRecherche("CŒLIA"), "coelia");
  assert.equal(normaliserRecherche("ÆLIA"), "aelia");
  assert.equal(normaliserRecherche("Cœur"), "coeur");
});

import { distanceEditionBornee } from "../lib/recherche-prenoms.ts";

test("la distance bornée reconnaît les substitutions, insertions et suppressions", () => {
  assert.equal(distanceEditionBornee("alice", "alixe", 1), 1);
  assert.equal(distanceEditionBornee("alice", "allice", 1), 1);
  assert.equal(distanceEditionBornee("alice", "alie", 1), 1);
  assert.equal(distanceEditionBornee("alice", "bob", 2), 3);
});

test("la distance utilise les caractères Unicode, pas les unités UTF-16", () => {
  assert.equal(distanceEditionBornee("😀a", "😀b", 1), 1);
  assert.equal(distanceEditionBornee("😀", "a", 1), 1);
});

test("la distance bornée gère les chaînes vides et la limite nulle", () => {
  assert.equal(distanceEditionBornee("", "", 0), 0);
  assert.equal(distanceEditionBornee("a", "", 1), 1);
  assert.equal(distanceEditionBornee("", "abc", 2), 3);
  assert.equal(distanceEditionBornee("alice", "alice", 0), 0);
  assert.equal(distanceEditionBornee("alice", "alixe", 0), 1);
});

test("la distance rejette une limite invalide", () => {
  assert.throws(() => distanceEditionBornee("a", "b", -1), RangeError);
  assert.throws(() => distanceEditionBornee("a", "b", 1.5), RangeError);
});

test("la distance bornée traite rapidement les chaînes de longueurs incompatibles", () => {
  assert.equal(distanceEditionBornee("a".repeat(10000), "alice", 2), 3);
});
