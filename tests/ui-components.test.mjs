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
  assert.doesNotMatch(globalStyles, /\.featured-[123]\b/);
  assert.match(globalStyles, /\.featured-card\s*\{[^}]*surface-container-low/s);
  assert.match(globalStyles, /\.featured-bottom strong\s*\{[^}]*on-surface/s);
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
  assert.match(listeSelection, /aria-label=\{.*Retirer/);
  assert.match(listeSelectionStyles, /min-height: 48px/);
  assert.match(barreComparaison, /<ListeSelectionComparaison/);
  assert.match(comparateurSelection, /<ListeSelectionComparaison/);
  assert.match(icones, /\| "close"/);
  assert.doesNotMatch(globalStyles, /\.compare-selected-item\s*\{/);
  assert.doesNotMatch(globalStyles, /\.compare-selected-list\s*\{/);
});

const chipFiltre = await readFile(new URL("../components/ui/chip-filtre.tsx", import.meta.url), "utf8");
const chipFiltreStyles = await readFile(new URL("../components/ui/chip-filtre.module.css", import.meta.url), "utf8");
const rechercheFiltres = await readFile(new URL("../components/recherche-prenoms.tsx", import.meta.url), "utf8");

test("les filtres de genre et d'initiale partagent des puces Fidelity", () => {
  assert.match(chipFiltre, /export function ChipFiltre\(/);
  assert.match(chipFiltre, /aria-pressed=\{selectionne\}/);
  assert.match(chipFiltre, /selectionne && <IconeMaterial name="check"/);
  assert.match(chipFiltreStyles, /secondary-container/);
  assert.match(chipFiltreStyles, /:focus-visible/);
  assert.match(rechercheFiltres, /<ChipFiltre/);
  assert.doesNotMatch(globalStyles, /filter-chip|filter-letter|Expressive/);
});

const champSelect = await readFile(new URL("../components/ui/champ-select.tsx", import.meta.url), "utf8");
const champSelectStyles = await readFile(new URL("../components/ui/champ-select.module.css", import.meta.url), "utf8");
const favorisSelects = await readFile(new URL("../components/liste-favoris.tsx", import.meta.url), "utf8");
const favorisSelectStyles = await readFile(new URL("../components/liste-favoris.module.css", import.meta.url), "utf8");

test("les sélecteurs des favoris utilisent un champ natif partagé", () => {
  assert.match(champSelect, /export function ChampSelect\(/);
  assert.match(champSelect, /<label htmlFor=\{id\}>/);
  assert.match(champSelect, /<select id=\{id\}/);
  assert.match(champSelect, /options\.map/);
  assert.match(champSelectStyles, /:focus-visible/);
  assert.match(favorisSelects, /<ChampSelect/);
  assert.doesNotMatch(favorisSelectStyles, /\.genre select|\.sort select/);
});

const adminActions = await readFile(new URL("../app/admin/admin-client.tsx", import.meta.url), "utf8");
const favorisActions = await readFile(new URL("../components/liste-favoris.tsx", import.meta.url), "utf8");
const comparateurActions = await readFile(new URL("../components/comparateur-prenoms.tsx", import.meta.url), "utf8");
const adminStyles = await readFile(new URL("../app/admin/admin.module.css", import.meta.url), "utf8");

test("les actions de l'administration et des visiteurs utilisent les boutons partagés", () => {
  assert.match(adminActions, /import \{ Bouton \} from "@\/components\/ui\/bouton"/);
  assert.match(adminActions, /<Bouton/);
  assert.match(favorisActions, /<Bouton/);
  assert.match(favorisActions, /<LienBouton/);
  assert.match(lienBouton, /^"use client";/);
  assert.match(comparateurActions, /<Bouton/);
  assert.doesNotMatch(adminActions, /button-dark|styles\.secondary/);
  assert.doesNotMatch(favorisActions, /button-dark/);
  assert.doesNotMatch(comparateurActions, /button-dark/);
  assert.doesNotMatch(globalStyles, /\.button\s*\{|\.button-dark/);
  assert.doesNotMatch(adminStyles, /\.secondary\s*\{/);
});


const navigation = await readFile(new URL("../components/navigation-adaptative.tsx", import.meta.url), "utf8");
const themeProvider = await readFile(new URL("../components/material-theme-provider.tsx", import.meta.url), "utf8");

test("la navigation reprend les modèles Material 3 compacts et rail sans tiroir propriétaire", () => {
  assert.match(navigation, /className="navigation-bar"/);
  assert.match(navigation, /className="navigation-rail"/);
  assert.match(navigation, /aria-current=\{active \? "page" : undefined\}/);
  assert.doesNotMatch(navigation, /navigation-rail-toggle|is-expanded|useState/);
  assert.match(globalStyles, /width: 80px;/);
  assert.match(globalStyles, /@media \(max-width: 599px\)/);
  assert.match(globalStyles, /@media \(min-width: 600px\)/);
  assert.match(globalStyles, /safe-area-inset-bottom/);
  assert.doesNotMatch(globalStyles, /navigation-rail\.is-expanded|navigation-rail-toggle/);
});

test("Fidelity et Rainbow sont calculés depuis la source Pixel documentée", () => {
  assert.match(themeProvider, /argbFromHex\("#005AC1"\)/);
  assert.match(themeProvider, /variant: Variant\.FIDELITY/);
  assert.match(themeProvider, /variant: Variant\.RAINBOW/);
  assert.match(globalStyles, /--md-sys-color-primary: #005ac1/);
  assert.match(globalStyles, /--motion-emphasized-decelerate/);
  assert.match(globalStyles, /prefers-reduced-motion: reduce/);
});
