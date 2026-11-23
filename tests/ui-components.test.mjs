import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const bouton = await readFile(new URL("../components/ui/bouton.tsx", import.meta.url), "utf8");
const lienBouton = await readFile(new URL("../components/ui/lien-bouton.tsx", import.meta.url), "utf8");
const styles = await readFile(new URL("../components/ui/bouton.module.css", import.meta.url), "utf8");
const favoris = await readFile(new URL("../components/bouton-favori.tsx", import.meta.url), "utf8");
const decouverte = await readFile(new URL("../components/decouverte-aleatoire.tsx", import.meta.url), "utf8");
const vitrine = await readFile(new URL("../components/prenoms-vedette.tsx", import.meta.url), "utf8");
const notFound = await readFile(new URL("../app/not-found.tsx", import.meta.url), "utf8");

test("les primitives partagées exposent des variantes sémantiques et préservent les éléments natifs", () => {
  assert.match(bouton, /export function Bouton\(/);
  assert.match(bouton, /<button/);
  assert.match(lienBouton, /export function LienBouton\(/);
  assert.match(lienBouton, /<Link/);
  for (const variante of ["filled", "tonal", "outlined", "text"]) {
    assert.match(styles, new RegExp(`\\.${variante} \\{`));
  }
  assert.match(styles, /min-height: 48px/);
  assert.match(styles, /width: 48px/);
});

test("les composants métier réutilisent les primitives au lieu de redéfinir leurs boutons", () => {
  assert.match(favoris, /import \{ Bouton \} from "@\/components\/ui\/bouton"/);
  assert.match(favoris, /<Bouton/);
  assert.doesNotMatch(favoris, /<button/);
  assert.match(decouverte, /<Bouton/);
  assert.doesNotMatch(decouverte, /<button/);
  assert.match(notFound, /<LienBouton/);
});

test("la vitrine n'attribue aucune couleur selon l'index du prénom", () => {
  assert.match(vitrine, /prenoms\.map\(\(prenom\)/);
  assert.doesNotMatch(vitrine, /featured-\$\{index/);
  assert.doesNotMatch(vitrine, /featured-\d/);
});

const champ = await readFile(new URL("../components/ui/champ-recherche.tsx", import.meta.url), "utf8");
const champStyles = await readFile(new URL("../components/ui/champ-recherche.module.css", import.meta.url), "utf8");
const catalogue = await readFile(new URL("../components/recherche-prenoms.tsx", import.meta.url), "utf8");
const comparateur = await readFile(new URL("../components/comparateur-prenoms.tsx", import.meta.url), "utf8");
const listeFavoris = await readFile(new URL("../components/liste-favoris.tsx", import.meta.url), "utf8");
const globalStyles = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");

test("les trois parcours visiteurs utilisent le même champ de recherche accessible", () => {
  assert.match(champ, /export function ChampRecherche\(/);
  assert.match(champ, /<label[^>]+htmlFor=\{id\}/);
  assert.match(champ, /type="search"/);
  assert.match(champ, /aria-label=\{.Effacer/);
  assert.match(champStyles, /:focus-within/);
  assert.match(champStyles, /min-height: 48px/);
  assert.match(catalogue, /<ChampRecherche/);
  assert.match(comparateur, /<ChampRecherche/);
  assert.match(listeFavoris, /<ChampRecherche/);
  assert.doesNotMatch(globalStyles, /\.search-field\s*\{/);
  assert.doesNotMatch(globalStyles, /\.compare-search input\s*\{/);
});

const boutonComparaison = await readFile(new URL("../components/ui/bouton-comparaison.tsx", import.meta.url), "utf8");
const boutonComparaisonStyles = await readFile(new URL("../components/ui/bouton-comparaison.module.css", import.meta.url), "utf8");
const favorisComparaison = await readFile(new URL("../components/liste-favoris.module.css", import.meta.url), "utf8");
const catalogueComparaison = await readFile(new URL("../components/recherche-prenoms.module.css", import.meta.url), "utf8");

test("le contrôle de comparaison partagé couvre catalogue et favoris sans styles dupliqués", () => {
  assert.match(boutonComparaison, /export function BoutonComparaison\(/);
  assert.match(boutonComparaison, /ariaPressed=\{selectionne\}/);
  assert.match(boutonComparaison, /ariaLabel=\{/);
  assert.match(boutonComparaison, /variante=\{selectionne \? "tonal" : "outlined"\}/);
  assert.match(boutonComparaisonStyles, /@media \(max-width: 420px\)/);
  assert.match(boutonComparaisonStyles, /min-width: 48px/);
  assert.doesNotMatch(favorisComparaison, /\.compareToggle/);
  assert.doesNotMatch(catalogueComparaison, /\.compareToggle/);
});

const listeSelection = await readFile(new URL("../components/ui/liste-selection-comparaison.tsx", import.meta.url), "utf8");
const listeSelectionStyles = await readFile(new URL("../components/ui/liste-selection-comparaison.module.css", import.meta.url), "utf8");
const barreComparaison = await readFile(new URL("../components/barre-comparaison.tsx", import.meta.url), "utf8");
const comparateurSelection = await readFile(new URL("../components/comparateur-prenoms.tsx", import.meta.url), "utf8");
const icones = await readFile(new URL("../components/icone-material.tsx", import.meta.url), "utf8");

test("les listes de prénoms sélectionnés partagent un seul composant accessible", () => {
  assert.match(listeSelection, /export function ListeSelectionComparaison\(/);
  assert.match(listeSelection, /aria-label=\{label\}/);
  assert.match(listeSelection, /aria-label=\{\`Retirer/);
  assert.match(listeSelectionStyles, /min-height: 48px/);
  assert.match(barreComparaison, /<ListeSelectionComparaison/);
  assert.match(comparateurSelection, /<ListeSelectionComparaison/);
  assert.match(icones, /\| "close"/);
  assert.doesNotMatch(globalStyles, /\.compare-selected-item\s*\{/);
  assert.doesNotMatch(globalStyles, /\.compare-selected-list\s*\{/);
});
