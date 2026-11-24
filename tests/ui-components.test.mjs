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
const errorBoundary = await readFile(new URL("../app/error.tsx", import.meta.url), "utf8");
const historique = await readFile(new URL("../components/historique-prenoms.tsx", import.meta.url), "utf8");

test("les primitives partagées exposent des variantes sémantiques et préservent les éléments natifs", () => {
  assert.match(bouton, /export function Bouton\(/);
  assert.match(bouton, /<button/);
  assert.match(lienBouton, /export function LienBouton\(/);
  assert.match(lienBouton, /<Link/);
  for (const variante of ["filled", "tonal", "outlined", "text"]) {
    assert.match(styles, new RegExp(`\\.${variante} \\{`));
  }
  assert.match(styles, /min-height: 48px/);
  assert.match(styles, /min-width: 58px/);
  assert.match(styles, /width: 48px/);
  assert.match(styles, /inset: 4px 0/);
  assert.match(styles, /corner-small/);
  assert.match(styles, /outline-variant/);
  assert.match(styles, /on-surface-variant/);
  assert.match(styles, /\.text\s*\{[^}]*md-sys-color-primary/s);
  assert.match(styles, /\.text\.icon\s*\{[^}]*on-surface-variant/s);
  assert.match(styles, /button:not\(\.icon\):active/);
  assert.match(styles, /color-mix\(in srgb, var\(--md-sys-color-on-surface\) 10%, transparent\)/);
  assert.match(styles, /color-mix\(in srgb, var\(--md-sys-color-on-surface-variant\) 38%, transparent\)/);
  assert.match(styles, /box-shadow: 0 1px 2px 0 color-mix/);
  assert.doesNotMatch(styles, /overflow:\s*hidden/);
  assert.match(styles, /filled:active::before[\s\S]*?box-shadow: none/);
});

test("les composants métier réutilisent les primitives au lieu de redéfinir leurs boutons", () => {
  assert.match(favoris, /import \{ Bouton \} from "@\/components\/ui\/bouton"/);
  assert.match(favoris, /<Bouton/);
  assert.doesNotMatch(favoris, /<button/);
  assert.match(decouverte, /<Bouton/);
  assert.match(decouverte, /IconeMaterial name="shuffle" size=\{18\}/);
  assert.match(favoris, /size=\{compact ? 24 : 18\}/);
  assert.match(historique, /IconeMaterial name="close" size=\{24\}/);
  assert.doesNotMatch(decouverte, /<button/);
  assert.match(notFound, /<LienBouton/);
});

test("la page d'erreur ne prétend pas transmettre une erreur journalisée localement", () => {
  assert.match(errorBoundary, /console\.error/);
  assert.match(errorBoundary, /Vous pouvez réessayer ou revenir à l’accueil/);
  assert.doesNotMatch(errorBoundary, /problème a été signalé/);
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
  assert.match(champ, /ariaLabel=\{.Effacer/);
  assert.match(champ, /<Bouton[\s\S]*?taille="icon"/);
  assert.match(champ, /IconeMaterial name="close"/);
  assert.match(champ, /useRef<HTMLInputElement>\(null\)/);
  assert.match(champ, /champRef\.current\?\.focus\(\)/);
  assert.match(champ, /ref=\{champRef\}/);
  assert.doesNotMatch(champ, /<button/);
  assert.match(champStyles, /height: 56px/);
  assert.match(champStyles, /corner-full/);
  assert.match(champStyles, /surface-container-high/);
  assert.match(champStyles, /body-large-(?:font|size|weight|line-height|tracking)/);
  assert.match(champStyles, /\.icon\s*\{[^}]*on-surface\s*\}/s);
  assert.match(champStyles, /\.control \.clearButton\s*\{[^}]*on-surface-variant/s);
  assert.match(champStyles, /:focus-within/);
  assert.match(champStyles, /::-webkit-search-cancel-button/);
  assert.doesNotMatch(champStyles, /\.compact/);
  assert.doesNotMatch(champ, /compact\??:/);
  assert.doesNotMatch(champStyles, /\.clear\s*\{/);
  assert.match(styles, /min-height: 48px/);
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
  assert.match(chipFiltreStyles, /transition: border-color var\(--md-sys-motion-duration-short\)/);
  assert.match(chipFiltreStyles, /\.chip:active/);
  const mediaSurvol = chipFiltreStyles.indexOf("@media (hover: hover) and (pointer: fine)");
  const regleSurvol = chipFiltreStyles.indexOf(".chip:hover");
  assert.ok(mediaSurvol >= 0 && regleSurvol > mediaSurvol, "Le survol des filtres doit être réservé aux pointeurs fins");
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
const materialTheme = await readFile(new URL("../lib/material-theme.ts", import.meta.url), "utf8");

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

test("Fidelity et Rainbow sont calculés depuis la source baseline Material documentée", () => {
  assert.match(materialTheme, /argbFromHex\("#6750A4"\)/);
  assert.match(materialTheme, /Variant\.FIDELITY/);
  assert.match(materialTheme, /Variant\.RAINBOW/);
  assert.match(materialTheme, /specVersion: "2021"/);
  assert.match(materialTheme, /--md-sys-color-/);
  assert.match(globalStyles, /--md-sys-motion-easing-emphasized-decelerate/);
  assert.match(globalStyles, /prefers-reduced-motion: reduce/);
});


test("Rainbow ne colore plus les titres ou les surfaces générales", () => {
  const titre = globalStyles.slice(globalStyles.lastIndexOf("h1 em, h2 em {"));
  const profil = globalStyles.slice(globalStyles.lastIndexOf(".profile-hero h1 span {"));
  const surfaceSymbolique = globalStyles.slice(globalStyles.lastIndexOf(".symbolic-card {"));
  assert.doesNotMatch(globalStyles, /\.hero::after\s*\{/);
  assert.doesNotMatch(globalStyles, /var\(--rainbow\)|color-rainbow-text/);
  assert.doesNotMatch(titre.slice(0, titre.indexOf("\n}")), /color-rainbow/);
  assert.doesNotMatch(profil.slice(0, profil.indexOf("\n}")), /color-rainbow/);
  assert.match(titre, /--md-sys-color-primary/);
  assert.match(surfaceSymbolique, /var\(--namesia-color-category-container/);
  assert.match(surfaceSymbolique, /surface-container-low/);
});


test("les cartes évitent les effets décoratifs et les boutons utilisent les couches d’état Material", () => {
  const nomBase = globalStyles.indexOf(".name-card { min-height: 76px;");
  const nomHover = globalStyles.slice(globalStyles.indexOf(".name-card:hover {", nomBase));
  const vedetteHover = globalStyles.slice(globalStyles.lastIndexOf(".featured-card:hover {"));
  assert.match(styles, /\.button::after/);
  assert.match(styles, /opacity: 0\.08/);
  assert.match(styles, /opacity: 0\.12/);
  assert.doesNotMatch(styles, /filter:\s*brightness/);
  assert.match(nomHover, /surface-container-high/);
  assert.match(vedetteHover, /surface-container-high/);
  assert.doesNotMatch(nomHover.slice(0, nomHover.indexOf("\n}")), /translateY|box-shadow:\s*var/);
  assert.doesNotMatch(vedetteHover.slice(0, vedetteHover.indexOf("\n}")), /translateY|box-shadow:\s*var/);
  assert.doesNotMatch(globalStyles, /button:active[^}]*scale\(/);
});


const adminClient = await readFile(new URL("../app/admin/admin-client.tsx", import.meta.url), "utf8");
const adminFormStyles = await readFile(new URL("../app/admin/admin.module.css", import.meta.url), "utf8");
const partage = await readFile(new URL("../components/partager-fiche.tsx", import.meta.url), "utf8");

test("les quatre destinations de navigation utilisent les SVG Material Symbols adaptés", () => {
  assert.match(icones, /viewBox="0 -960 960 960"/);
  assert.match(icones, /fill="currentColor"/);
  assert.doesNotMatch(icones, /search-filled|compare-arrows-filled/);
  assert.match(navigation, /icon: "home", activeIcon: "home-filled"/);
  assert.match(navigation, /icon: "search" \}/);
  assert.match(navigation, /icon: "compare-arrows" \}/);
  assert.match(navigation, /icon: "favorite", activeIcon: "favorite-filled"/);
  assert.match(navigation, /const icon = active && "activeIcon" in destination/);
  assert.match(navigation, /name=\{icon\}/);
});

test("les formulaires administratifs utilisent les surfaces, formes et dimensions Fidelity", () => {
  assert.match(adminFormStyles, /surface-container-low/);
  assert.match(adminFormStyles, /outline-variant/);
  assert.match(adminFormStyles, /corner-extra-large/);
  assert.match(adminFormStyles, /min-height: 56px/);
  assert.match(adminFormStyles, /:focus-visible/);
  assert.match(adminFormStyles, /::file-selector-button/);
  assert.doesNotMatch(adminFormStyles, /var\(--color-(?:border|surface|text|accent)/);
  assert.match(adminClient, /htmlFor="fiche-fichier"/);
  assert.match(adminClient, /id="fiche-fichier"/);
});

test("le partage réutilise le bouton commun et ne garde pas un style concurrent", () => {
  assert.match(partage, /import \{ Bouton \} from "@\/components\/ui\/bouton"/);
  assert.match(partage, /<Bouton variante="tonal"/);
  assert.doesNotMatch(partage, /share-button/);
  assert.doesNotMatch(globalStyles, /\.share-button\s*\{/);
});


test("la navigation applique des couches d'état Material, pas des surfaces opaques au survol", () => {
  const navigationStyles = globalStyles.slice(
    globalStyles.indexOf(".navigation-item {"),
    globalStyles.indexOf(".navigation-rail .navigation-items")
  );
  assert.match(navigationStyles, /@media \(hover: hover\) and \(pointer: fine\)/);
  assert.match(navigationStyles, /on-surface-variant\) 8%, transparent/);
  assert.match(navigationStyles, /on-secondary-container\) 8%, var\(--md-sys-color-secondary-container\)/);
  assert.match(navigationStyles, /on-surface-variant\) 12%, transparent/);
  assert.match(navigationStyles, /on-secondary-container\) 12%, var\(--md-sys-color-secondary-container\)/);
  assert.doesNotMatch(navigationStyles, /\.navigation-item:hover[^}]*surface-container-high/);
  assert.doesNotMatch(navigationStyles, /transition:[^;]*(?:180|250)ms/);
});


test("la typographie suit une échelle Material 3 unique sans surcharges responsives concurrentes", () => {
  assert.match(globalStyles, /--md-sys-typescale-display-small-size: 36px/);
  assert.match(globalStyles, /--md-sys-typescale-headline-large-size: 32px/);
  assert.match(globalStyles, /--md-sys-typescale-headline-medium-size: 28px/);
  assert.match(globalStyles, /--md-sys-typescale-headline-small-size: 24px/);
  assert.match(globalStyles, /\.hero h1 \{[^}]*var\(--md-sys-typescale-display-small-size\)/s);
  assert.match(globalStyles, /\.profile-hero h1 \{[^}]*var\(--md-sys-typescale-headline-large-size\)/s);
  assert.match(globalStyles, /\.section-heading h2 \{[^}]*var\(--md-sys-typescale-headline-medium-size\)/s);
  assert.match(globalStyles, /\.profile-lead \{[^}]*var\(--md-sys-typescale-body-large-size\)/s);
  assert.doesNotMatch(globalStyles, /\.profile-lead \{[^}]*1\.125rem/);
  assert.equal((globalStyles.match(/\.hero h1\s*\{/g) ?? []).length, 1);
  assert.equal((globalStyles.match(/\.profile-hero h1\s*\{/g) ?? []).length, 1);
  assert.equal((globalStyles.match(/\.section-heading h2\s*\{/g) ?? []).length, 1);
  assert.doesNotMatch(globalStyles, /--font-serif|var\(--serif\)/);
  assert.match(globalStyles, /--md-sys-typescale-body-large-font: Roboto;/);
  assert.match(globalStyles, /--md-sys-typescale-headline-large-font: Roboto;/);
  assert.doesNotMatch(globalStyles, /Google Sans|--font-(?:sans|display):[^;]*(?:Arial|system-ui|sans-serif)/);
});


test("les cartes Rainbow utilisent la couleur de premier plan de leur propre catégorie", () => {
  const symbolicCard = globalStyles.slice(globalStyles.indexOf(".symbolic-card {"));
  const categoryBadge = globalStyles.slice(
    globalStyles.indexOf(".symbolic-card > span,\n.compare-association span {"),
    globalStyles.indexOf(".compare-association {")
  );
  assert.equal((globalStyles.match(/\.symbolic-card\s*\{/g) ?? []).length, 1);
  assert.match(symbolicCard, /var\(--namesia-color-category\)/);
  assert.match(symbolicCard, /var\(--namesia-color-category-container/);
  assert.match(categoryBadge, /var\(--namesia-color-category-on-container/);
  assert.doesNotMatch(globalStyles, /\.symbolic-card > span \{[^}]*on-tertiary-container/);
  assert.doesNotMatch(symbolicCard, /linear-gradient/);
});


test("les surfaces principales Material sont définies à leur emplacement canonique", () => {
  assert.match(globalStyles, /\.hero \{[^}]*surface-container-low/s);
  assert.match(globalStyles, /\.featured-card \{[^}]*surface-container-low/s);
  assert.match(globalStyles, /\.profile-hero \{[^}]*surface-container-low/s);
  assert.match(globalStyles, /\.site-footer \{[^}]*surface-container/s);
  assert.doesNotMatch(globalStyles, /Couche Material 3 Fidelity/);
  assert.doesNotMatch(globalStyles, /radial-gradient\(ellipse at 88% 15%/);
  assert.doesNotMatch(globalStyles, /linear-gradient\(118deg/);
});


const rechercheActions = await readFile(new URL("../components/recherche-prenoms.tsx", import.meta.url), "utf8");
const favorisActions = await readFile(new URL("../components/liste-favoris.tsx", import.meta.url), "utf8");
const comparateurActions = await readFile(new URL("../components/comparateur-prenoms.tsx", import.meta.url), "utf8");

test("les actions de catalogue, favoris et comparaison utilisent le bouton commun", () => {
  for (const source of [rechercheActions, favorisActions, comparateurActions]) {
    assert.doesNotMatch(source, /<button\b/);
    assert.match(source, /<Bouton\s+variante="text"/);
    assert.match(source, /className="filter-action"/);
  }
  assert.match(favorisActions, /<Bouton\s+variante="tonal"/);
  assert.doesNotMatch(globalStyles, /\.filter-reset|\.compare-selection-footer > button/);
  assert.doesNotMatch(globalStyles, /\.copyButton\s*\{/);
  assert.match(globalStyles, /\.filter-action\s*\{[^}]*width: max-content/s);
});

test("les options de comparaison ont des états tactiles Material sans survol collant", () => {
  assert.match(globalStyles, /@media \(hover: hover\) and \(pointer: fine\) \{\s*\.compare-option:hover/);
  assert.match(globalStyles, /@media \(hover: hover\) and \(pointer: fine\) \{\s*\.name-card:hover/);
  assert.match(globalStyles, /@media \(hover: hover\) and \(pointer: fine\) \{\s*\.featured-card:hover/);
  assert.match(globalStyles, /\.compare-option:active:not\(:has\(input:disabled\)\)/);
  assert.match(globalStyles, /\.compare-option:has\(input:checked\):active/);
  assert.match(globalStyles, /\.compare-option:has\(input:checked\)\s*\{[^}]*primary-container/s);
  assert.match(globalStyles, /\.compare-option:has\(input:checked\) \.compare-option-initial\s*\{[^}]*on-primary/s);
  assert.match(globalStyles, /\.compare-option input\s*\{[^}]*accent-color: var\(--md-sys-color-primary\)/s);
});


test("les surfaces du catalogue et du comparateur ne dépendent plus de la couche Fidelity finale", () => {
  assert.match(globalStyles, /\.catalogue-filters\s*\{[^}]*surface-container-low/s);
  assert.match(globalStyles, /\.compare-selector\s*\{[^}]*surface-container-low/s);
  assert.match(globalStyles, /\.empty-results\s*\{[^}]*outline-variant/s);
  assert.match(globalStyles, /\.name-card\s*\{[^}]*surface-container-low/s);
  assert.match(globalStyles, /\.compare-option\s*\{[^}]*surface-container-low/s);
  assert.match(globalStyles, /\.compare-card\s*\{[^}]*surface-container-low/s);
  assert.match(globalStyles, /\.profile-note\s*\{[^}]*surface-container/s);
  assert.doesNotMatch(globalStyles, /Couche Material 3 Fidelity/);
  assert.doesNotMatch(globalStyles, /linear-gradient\(135deg, var\(--color-surface/);
});

test("la fiche prénom applique Material 3 dans ses règles canoniques", () => {
  assert.match(globalStyles, /\.profile-toc a\s*\{[^}]*min-height: 48px/s);
  assert.match(globalStyles, /\.profile-toc a:focus-visible\s*\{[^}]*outline: 3px solid var\(--md-sys-color-primary\)/s);
  assert.match(globalStyles, /\.profile-section\s*\{[^}]*scroll-margin-top: 88px/s);
  assert.match(globalStyles, /\.profile-copy\s*\{[^}]*color: var\(--md-sys-color-on-surface\)/s);
  assert.match(globalStyles, /\.profile-section \+ \.profile-section\s*\{[^}]*outline-variant/s);
  assert.doesNotMatch(globalStyles, /Couche Material 3 Fidelity/);
  assert.doesNotMatch(globalStyles, /linear-gradient\(125deg, var\(--md-sys-color-surface-container/);
});

const historiqueActions = await readFile(new URL("../components/historique-prenoms.tsx", import.meta.url), "utf8");
const barreComparaisonActions = await readFile(new URL("../components/barre-comparaison.tsx", import.meta.url), "utf8");
const historiqueStyles = await readFile(new URL("../components/historique-prenoms.module.css", import.meta.url), "utf8");
const barreComparaisonStyles = await readFile(new URL("../components/barre-comparaison.module.css", import.meta.url), "utf8");

test("les actions d'effacement de l'accueil et de comparaison utilisent les primitives communes", () => {
  assert.match(historiqueActions, /<Bouton variante="text"[^>]*onClick=\{effacer\}/);
  assert.match(barreComparaisonActions, /<Bouton variante="text"[^>]*onClick=\{onEffacer\}/);
  assert.match(barreComparaisonActions, /<LienBouton[^>]*variante="filled"/);
  assert.doesNotMatch(historiqueActions, /<button\b/);
  assert.doesNotMatch(barreComparaisonActions, /<button\b|<Link\b/);
  assert.doesNotMatch(historiqueStyles, /\.clear\s*\{/);
  assert.doesNotMatch(barreComparaisonStyles, /\.actions button|\.link\s*\{/);
});
