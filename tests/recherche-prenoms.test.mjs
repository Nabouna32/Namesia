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
