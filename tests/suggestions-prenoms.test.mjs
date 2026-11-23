import assert from "node:assert/strict";
import test from "node:test";
import { calculerFenetreSuggestions, TAILLE_ECHANTILLON_SUGGESTIONS } from "../lib/suggestions-prenoms.ts";

test("un catalogue plus petit que la fenêtre conserve tous ses candidats", () => {
  assert.deepEqual(calculerFenetreSuggestions("alice", 3), { debut: 0, taille: 3 });
  assert.deepEqual(calculerFenetreSuggestions("alice", 0), { debut: 0, taille: 0 });
});

test("la fenêtre est bornée à 64 identités", () => {
  assert.deepEqual(calculerFenetreSuggestions("alice", 500).taille, TAILLE_ECHANTILLON_SUGGESTIONS);
});

test("la fenêtre reste stable pour une fiche et dans les limites du catalogue", () => {
  const premiere = calculerFenetreSuggestions("jean-luc", 500);
  const seconde = calculerFenetreSuggestions("jean-luc", 500);
  assert.deepEqual(premiere, seconde);
  assert.ok(premiere.debut >= 0);
  assert.ok(premiere.debut + premiere.taille <= 500);
});

test("les fiches peuvent explorer des fenêtres différentes", () => {
  const fenetres = new Set(
    ["alice", "jeanne", "gabriel", "theo", "ines", "louise", "nathan", "jade"]
      .map((slug) => calculerFenetreSuggestions(slug, 500).debut)
  );
  assert.ok(fenetres.size > 1);
});

test("les entrées invalides sont rejetées", () => {
  assert.throws(() => calculerFenetreSuggestions("", 10), TypeError);
  for (const count of [-1, 1.5, Number.NaN, Number.POSITIVE_INFINITY]) {
    assert.throws(() => calculerFenetreSuggestions("alice", count), RangeError);
  }
});
