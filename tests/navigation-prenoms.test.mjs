import assert from "node:assert/strict";
import test from "node:test";
import {
  creerUrlCatalogueDepuisRecherche,
  creerUrlFicheDepuisCatalogue,
  creerUrlFicheDepuisFavoris,
  creerUrlFicheDepuisContexte,
  creerUrlRetourNavigation,
  lireContexteRetourNavigation,
  lireNombreVisible
} from "../lib/navigation-prenoms.ts";

test("un lien de fiche depuis le catalogue conserve recherche et filtres", () => {
  assert.equal(
    creerUrlFicheDepuisCatalogue("jean-luc", {
      q: "Jean Luc",
      genre: "Masculin",
      lettre: "j",
      limite: 24
    }),
    "/prenoms/jean-luc?retour_vue=catalogue&retour_q=Jean+Luc&retour_genre=Masculin&retour_lettre=j"
  );
});

test("un lien direct vers une fiche ne transporte pas de contexte vide", () => {
  assert.equal(creerUrlFicheDepuisCatalogue("alice", null), "/prenoms/alice");
  assert.equal(
    creerUrlFicheDepuisCatalogue("alice", { q: " ", genre: null, lettre: null, limite: 24 }),
    "/prenoms/alice"
  );
});

test("le nombre visible est normalisé et borné par le catalogue", () => {
  assert.equal(lireNombreVisible("72"), 72);
  assert.equal(lireNombreVisible("25"), 24);
  assert.equal(lireNombreVisible("invalide"), 24);
  assert.equal(lireNombreVisible("72", 48), 48);
});

test("le retour catalogue restaure recherche, filtres et pagination", () => {
  assert.equal(
    creerUrlRetourNavigation({
      retour_vue: "catalogue",
      retour_q: "Jean Luc",
      retour_genre: "Masculin",
      retour_lettre: "j",
      retour_limite: "48"
    }),
    "/prenoms?q=Jean+Luc&genre=Masculin&limite=48&lettre=j"
  );
});

test("un lien depuis le catalogue conserve le lot déjà affiché", () => {
  assert.equal(
    creerUrlFicheDepuisCatalogue("jean-luc", {
      q: "",
      genre: null,
      lettre: null,
      limite: 72
    }),
    "/prenoms/jean-luc?retour_vue=catalogue&retour_limite=72"
  );
  assert.equal(
    creerUrlRetourNavigation({ retour_vue: "catalogue", retour_limite: "72" }),
    "/prenoms?limite=72"
  );
});

test("un lien depuis les favoris conserve la vue même sans filtre", () => {
  const url = creerUrlFicheDepuisFavoris("alice", {
    q: "",
    genre: null,
    tri: "enregistrement",
    limite: 24
  });

  assert.equal(url, "/prenoms/alice?retour_vue=favoris");
  assert.equal(
    creerUrlRetourNavigation({ retour_vue: "favoris" }),
    "/favoris"
  );
});

test("le retour aux favoris restaure recherche, genre, tri et pagination", () => {
  const url = creerUrlFicheDepuisFavoris("jean-luc", {
    q: "Jean Luc",
    genre: "Masculin",
    tri: "nom-desc",
    limite: 48
  });

  assert.equal(
    url,
    "/prenoms/jean-luc?retour_vue=favoris&retour_q=Jean+Luc&retour_genre=Masculin&retour_tri=nom-desc&retour_limite=48"
  );
  assert.equal(
    creerUrlRetourNavigation({
      retour_vue: "favoris",
      retour_q: "Jean Luc",
      retour_genre: "Masculin",
      retour_tri: "nom-desc",
      retour_limite: "48"
    }),
    "/favoris?q=Jean+Luc&genre=Masculin&limite=48&tri=nom-desc"
  );
});

test("les paramètres répétés utilisent leur première valeur et les valeurs invalides sont normalisées", () => {
  assert.deepEqual(
    lireContexteRetourNavigation({
      retour_vue: "favoris",
      retour_q: ["Alice", "ignoré"],
      retour_genre: ["Féminin", "Masculin"],
      retour_tri: "inconnu",
      retour_limite: "25"
    }),
    { vue: "favoris", q: "Alice", genre: "Féminin", tri: "enregistrement", limite: 24 }
  );
});

test("les suggestions conservent la provenance et le lot des favoris", () => {
  const contexte = lireContexteRetourNavigation({
    retour_vue: "favoris",
    retour_q: "Jean",
    retour_tri: "nom-asc",
    retour_limite: "96"
  });

  assert.equal(
    creerUrlFicheDepuisContexte("jean-pierre", contexte),
    "/prenoms/jean-pierre?retour_vue=favoris&retour_q=Jean&retour_tri=nom-asc&retour_limite=96"
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


test("la recherche compacte ouvre le catalogue avec le terme saisi", () => {
  assert.equal(creerUrlCatalogueDepuisRecherche("  Jean Luc  "), "/prenoms?q=Jean+Luc");
  assert.equal(creerUrlCatalogueDepuisRecherche("Éloïse & Anna"), "/prenoms?q=%C3%89lo%C3%AFse+%26+Anna");
  assert.equal(creerUrlCatalogueDepuisRecherche("   "), "/prenoms");
});
