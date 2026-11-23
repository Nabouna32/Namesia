import assert from "node:assert/strict";
import test from "node:test";
import {
  creerUrlFicheDepuisCatalogue,
  creerUrlRetourCatalogue,
  lireContexteRetourCatalogue
} from "../lib/navigation-prenoms.ts";

test("un lien de fiche conserve la recherche et les filtres du catalogue", () => {
  const url = creerUrlFicheDepuisCatalogue("jean-luc", {
    q: "Jean Luc",
    genre: "Masculin",
    lettre: "j"
  });

  assert.equal(
    url,
    "/prenoms/jean-luc?retour_q=Jean+Luc&retour_genre=Masculin&retour_lettre=j"
  );
});

test("un lien direct vers une fiche ne transporte pas de contexte vide", () => {
  assert.equal(creerUrlFicheDepuisCatalogue("alice", null), "/prenoms/alice");
  assert.equal(
    creerUrlFicheDepuisCatalogue("alice", { q: " ", genre: null, lettre: null }),
    "/prenoms/alice"
  );
});

test("le retour reconstruit uniquement les paramètres du catalogue", () => {
  assert.equal(
    creerUrlRetourCatalogue({
      retour_q: "Jean Luc",
      retour_genre: "Masculin",
      retour_lettre: "j"
    }),
    "/prenoms?q=Jean+Luc&genre=Masculin&lettre=j"
  );
  assert.equal(creerUrlRetourCatalogue({}), "/prenoms");
});

test("les paramètres répétés utilisent leur première valeur", () => {
  assert.deepEqual(
    lireContexteRetourCatalogue({
      retour_q: ["Alice", "ignoré"],
      retour_genre: ["Féminin", "Masculin"]
    }),
    { q: "Alice", genre: "Féminin", lettre: null }
  );
});
