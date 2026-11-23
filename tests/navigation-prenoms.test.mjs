import assert from "node:assert/strict";
import test from "node:test";
import {
  creerUrlFicheDepuisCatalogue,
  creerUrlFicheDepuisFavoris,
  creerUrlRetourNavigation,
  lireContexteRetourNavigation
} from "../lib/navigation-prenoms.ts";

test("un lien de fiche depuis le catalogue conserve recherche et filtres", () => {
  assert.equal(
    creerUrlFicheDepuisCatalogue("jean-luc", {
      q: "Jean Luc",
      genre: "Masculin",
      lettre: "j"
    }),
    "/prenoms/jean-luc?retour_vue=catalogue&retour_q=Jean+Luc&retour_genre=Masculin&retour_lettre=j"
  );
});

test("un lien direct vers une fiche ne transporte pas de contexte vide", () => {
  assert.equal(creerUrlFicheDepuisCatalogue("alice", null), "/prenoms/alice");
  assert.equal(
    creerUrlFicheDepuisCatalogue("alice", { q: " ", genre: null, lettre: null }),
    "/prenoms/alice"
  );
});

test("un lien depuis les favoris conserve la vue même sans filtre", () => {
  const url = creerUrlFicheDepuisFavoris("alice", {
    q: "",
    genre: null,
    tri: "enregistrement"
  });

  assert.equal(url, "/prenoms/alice?retour_vue=favoris");
  assert.equal(
    creerUrlRetourNavigation({ retour_vue: "favoris" }),
    "/favoris"
  );
});

test("le retour aux favoris restaure recherche, genre et tri", () => {
  const url = creerUrlFicheDepuisFavoris("jean-luc", {
    q: "Jean Luc",
    genre: "Masculin",
    tri: "nom-desc"
  });

  assert.equal(
    url,
    "/prenoms/jean-luc?retour_vue=favoris&retour_q=Jean+Luc&retour_genre=Masculin&retour_tri=nom-desc"
  );
  assert.equal(
    creerUrlRetourNavigation({
      retour_vue: "favoris",
      retour_q: "Jean Luc",
      retour_genre: "Masculin",
      retour_tri: "nom-desc"
    }),
    "/favoris?q=Jean+Luc&genre=Masculin&tri=nom-desc"
  );
});

test("les paramètres répétés utilisent leur première valeur et le tri invalide revient au défaut", () => {
  assert.deepEqual(
    lireContexteRetourNavigation({
      retour_vue: "favoris",
      retour_q: ["Alice", "ignoré"],
      retour_genre: ["Féminin", "Masculin"],
      retour_tri: "inconnu"
    }),
    { vue: "favoris", q: "Alice", genre: "Féminin", tri: "enregistrement" }
  );
});

test("les anciens liens catalogue sans discriminant restent compatibles", () => {
  assert.equal(
    creerUrlRetourNavigation({
      retour_q: "Jean Luc",
      retour_genre: "Masculin",
      retour_lettre: "j"
    }),
    "/prenoms?q=Jean+Luc&genre=Masculin&lettre=j"
  );
  assert.equal(creerUrlRetourNavigation({}), "/prenoms");
});
