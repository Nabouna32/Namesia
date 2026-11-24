import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const button = await readFile(new URL("../components/material3/Button.tsx", import.meta.url), "utf8");
const buttonStyles = await readFile(new URL("../components/material3/Button.module.css", import.meta.url), "utf8");
const favoriteButton = await readFile(new URL("../components/features/favorites/FavoriteButton.tsx", import.meta.url), "utf8");
const discovery = await readFile(new URL("../components/features/discovery/RandomDiscovery.tsx", import.meta.url), "utf8");
const featured = await readFile(new URL("../components/features/catalog/FeaturedNames.tsx", import.meta.url), "utf8");
const notFound = await readFile(new URL("../app/not-found.tsx", import.meta.url), "utf8");
const errorBoundary = await readFile(new URL("../app/error.tsx", import.meta.url), "utf8");
const history = await readFile(new URL("../components/features/history/RecentNames.tsx", import.meta.url), "utf8");
const globalStyles = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
const materialTokens = await readFile(new URL("../styles/material3/tokens.css", import.meta.url), "utf8");
const styles = buttonStyles;
const icones = await readFile(new URL("../components/material3/Icon.tsx", import.meta.url), "utf8");
const favoritesStyles = await readFile(new URL("../components/features/favorites/FavoritesList.module.css", import.meta.url), "utf8");

test("Button suit l’anatomie AndroidX et conserve les éléments HTML natifs", () => {
  assert.match(button, /export function Button\(/);
  assert.match(button, /<button/);
  assert.match(button, /<Link/);
  assert.match(button, /type LinkProps = SharedProps/);
  assert.match(button, /disabled\?: never/);
  assert.match(button, /onClick\?: never/);
  assert.doesNotMatch(button, /aria-disabled/);
  assert.doesNotMatch(buttonStyles, /aria-disabled/);
  assert.ok(["filled", "tonal", "outlined", "text"].every((variant) => buttonStyles.includes("." + variant + " {")));
  assert.match(buttonStyles, /min-height: 48px/);
  assert.match(buttonStyles, /min-width: 58px/);
  assert.match(buttonStyles, /inset: 4px 0/);
  assert.match(buttonStyles, /corner-small/);
  assert.match(buttonStyles, /outline-variant/);
  assert.match(buttonStyles, /on-surface-variant/);
  assert.match(buttonStyles, /--md-sys-state-hover-state-layer-opacity/);
  assert.match(buttonStyles, /--md-sys-state-focus-state-layer-opacity/);
  assert.match(buttonStyles, /--md-sys-state-pressed-state-layer-opacity/);
  assert.doesNotMatch(buttonStyles, /\.button:disabled\s*\{[^}]*opacity:/s);
  assert.match(buttonStyles, /box-shadow: 0 1px 2px 0 color-mix/);
});

test("les fonctions métier composent les composants Material 3 sans réimplémenter les boutons", () => {
  assert.match(favoriteButton, /import \{ Button \} from "@\/components\/material3\/Button"/);
  assert.match(favoriteButton, /<Button/);
  assert.match(favoriteButton, /aria-label=\{label\}/);
  assert.match(favoriteButton, /aria-pressed=\{selected\}/);
  assert.match(discovery, /<Button/);
  assert.doesNotMatch(featured, /<FavoriteButton/);
  assert.match(featured, /<GenreIcon/);
  assert.match(history, /<IconButton/);
  assert.match(notFound, /<Button href=/);
  assert.doesNotMatch(discovery, /<button/);
});

test("la page d'erreur ne prétend pas transmettre une erreur journalisée localement", () => {
  assert.match(errorBoundary, /console\.error/);
  assert.match(errorBoundary, /Vous pouvez réessayer ou revenir à l’accueil/);
  assert.doesNotMatch(errorBoundary, /problème a été signalé/);
});

test("la vitrine n'attribue aucune couleur selon l'index du prénom", () => {
  assert.match(featured, /prenoms\.map\(\(prenom\)/);
  assert.doesNotMatch(featured, /featured-\$\{index/);
  assert.doesNotMatch(featured, /featured-\d/);
  assert.doesNotMatch(globalStyles, /\.featured-[123]\b/);
  assert.match(globalStyles, /\.featured-card\s*\{[^}]*min-height:\s*210px/s);
  assert.match(globalStyles, /\.featured-bottom strong\s*\{[^}]*on-surface/s);
});

const searchBar = await readFile(new URL("../components/material3/SearchBar.tsx", import.meta.url), "utf8");
const searchBarStyles = await readFile(new URL("../components/material3/SearchBar.module.css", import.meta.url), "utf8");
const catalogue = await readFile(new URL("../components/features/catalog/NameSearch.tsx", import.meta.url), "utf8");
const comparator = await readFile(new URL("../components/features/comparison/NameComparator.tsx", import.meta.url), "utf8");
const favorites = await readFile(new URL("../components/features/favorites/FavoritesList.tsx", import.meta.url), "utf8");

test("SearchBar applique le champ replié AndroidX et reste accessible dans les trois parcours", () => {
  assert.match(searchBar, /export function SearchBar\(/);
  assert.match(searchBar, /<label[^>]+htmlFor=\{id\}/);
  assert.match(searchBar, /type="search"/);
  assert.match(searchBar, /<IconButton/);
  assert.match(searchBar, /label=\{\`Effacer/);
  assert.match(searchBar, /inputRef\.current\?\.focus\(\)/);
  assert.match(searchBarStyles, /height: 56px/);
  assert.match(searchBarStyles, /corner-full/);
  assert.match(searchBarStyles, /surface-container-high/);
  assert.match(searchBarStyles, /body-large-(?:font|size|weight|line-height|tracking)/);
  assert.match(searchBarStyles, /leadingIcon/);
  assert.doesNotMatch(searchBarStyles, /:focus-within|outline:/);
  assert.match(globalStyles, /input:focus-visible/);
  assert.match(catalogue, /<SearchBar/);
  assert.match(comparator, /<SearchBar/);
  assert.match(favorites, /<SearchBar/);
  assert.doesNotMatch(globalStyles, /\.search-field\s*\{/);
  assert.doesNotMatch(globalStyles, /\.compare-search input\s*\{/);
});

const comparisonSelection = await readFile(new URL("../components/features/comparison/ComparisonSelection.tsx", import.meta.url), "utf8");
const comparisonSelectionStyles = await readFile(new URL("../components/features/comparison/ComparisonSelection.module.css", import.meta.url), "utf8");
const comparatorSelection = await readFile(new URL("../components/features/comparison/NameComparator.tsx", import.meta.url), "utf8");

test("la sélection du comparateur utilise InputChip et les composants Material 3", () => {
  assert.match(comparisonSelection, /export function ComparisonSelection\(/);
  assert.match(comparisonSelection, /<InputChip/);
  assert.match(comparisonSelection, /onRemove=/);
  assert.match(comparisonSelectionStyles, /list-style: none/);
  assert.match(comparatorSelection, /<ComparisonSelection/);
});

const inputChip = await readFile(new URL("../components/material3/InputChip.tsx", import.meta.url), "utf8");
const inputChipStyles = await readFile(new URL("../components/material3/InputChip.module.css", import.meta.url), "utf8");
const filterChip = await readFile(new URL("../components/material3/FilterChip.tsx", import.meta.url), "utf8");
const filterChipStyles = await readFile(new URL("../components/material3/FilterChip.module.css", import.meta.url), "utf8");
const searchFilters = await readFile(new URL("../components/features/catalog/NameSearch.tsx", import.meta.url), "utf8");

test("InputChip fournit le retrait individuel de la sélection avec la géométrie AndroidX", () => {
  assert.match(inputChip, /export function InputChip\(/);
  assert.match(inputChip, /aria-label=/);
  assert.match(inputChip, /data-selected=\{selected\}/);
  assert.match(inputChipStyles, /min-height: 48px/);
  assert.match(inputChipStyles, /inset: 8px 0/);
  assert.match(inputChipStyles, /outline-variant/);
  assert.match(inputChipStyles, /secondary-container/);
  assert.match(inputChipStyles, /--md-sys-state-pressed-state-layer-opacity/);
});

test("FilterChip suit la géométrie et les états AndroidX", () => {
  assert.match(filterChip, /export function FilterChip\(/);
  assert.match(filterChip, /aria-pressed=\{selected\}/);
  assert.match(filterChip, /selected && <Icon name="check"/);
  assert.match(filterChipStyles, /secondary-container/);
  assert.match(filterChipStyles, /:focus-visible/);
  assert.match(filterChipStyles, /border-color var\(--md-sys-motion-duration-short3\)/);
  assert.match(filterChipStyles, /var\(--md-sys-state-pressed-state-layer-opacity\)/);
  assert.match(filterChipStyles, /\.chip:active/);
  const hoverMedia = filterChipStyles.indexOf("@media (hover: hover) and (pointer: fine)");
  const hoverRule = filterChipStyles.indexOf(".chip:hover");
  assert.ok(hoverMedia >= 0 && hoverRule > hoverMedia);
  assert.match(searchFilters, /<FilterChip/);
  assert.doesNotMatch(globalStyles, /filter-chip|filter-letter|Expressive/);
});

test("les filtres de genre des favoris sont icon-only et le tri reste natif", () => {
  assert.match(favorites, /leadingIcon=\{<Icon name=\{GENRE_ICONS\[genre\]\}/);
  assert.match(favorites, /iconOnly/);
  assert.match(favorites, /<FilterChip label="Tous"/);
  assert.match(favorites, /<label htmlFor="tri-favoris">/);
  assert.match(favorites, /<select id="tri-favoris"/);
  assert.match(favoritesStyles, /\.selectField select\s*\{[^}]*surface-container-low/s);
  assert.doesNotMatch(favoritesStyles, /\.selectField select:focus-visible/);
  assert.match(globalStyles, /select:focus-visible/);
});

const adminActions = await readFile(new URL("../app/admin/admin-client.tsx", import.meta.url), "utf8");
const favoriteActions = await readFile(new URL("../components/features/favorites/FavoritesList.tsx", import.meta.url), "utf8");
const comparatorActions = await readFile(new URL("../components/features/comparison/NameComparator.tsx", import.meta.url), "utf8");
const adminStyles = await readFile(new URL("../app/admin/admin.module.css", import.meta.url), "utf8");

test("l’administration et les parcours visiteurs utilisent Button et Snackbar", () => {
  assert.match(adminActions, /import \{ Button \} from "@\/components\/material3\/Button"/);
  assert.match(adminActions, /<Button/);
  assert.match(adminActions, /<Snackbar severity=/);
  assert.match(favoriteActions, /<Button/);
  assert.match(favoriteActions, /<Snackbar severity=/);
  assert.match(comparatorActions, /<Button/);
  assert.doesNotMatch(adminActions, /button-dark|styles\.secondary/);
  assert.doesNotMatch(favoriteActions, /button-dark/);
  assert.doesNotMatch(comparatorActions, /button-dark/);
  assert.doesNotMatch(globalStyles, /\.button\s*\{|\.button-dark/);
  assert.doesNotMatch(adminStyles, /\.secondary\s*\{/);
});

const navigationBar = await readFile(new URL("../components/material3/NavigationBar.tsx", import.meta.url), "utf8");
const navigationRail = await readFile(new URL("../components/material3/NavigationRail.tsx", import.meta.url), "utf8");
const navigation = await readFile(new URL("../components/material3/NavigationDestinations.tsx", import.meta.url), "utf8");
const materialTheme = await readFile(new URL("../lib/material-theme.ts", import.meta.url), "utf8");

test("la navigation reprend les modèles Material 3 compacts et rail sans tiroir propriétaire", () => {
  assert.match(navigationBar, /className="navigation-bar"/);
  assert.match(navigationRail, /className="navigation-rail"/);
  assert.match(navigation, /aria-current=\{active \? "page" : undefined\}/);
  assert.doesNotMatch(navigation, /navigation-rail-toggle|is-expanded|useState/);
  assert.match(globalStyles, /width: 80px;/);
  assert.match(globalStyles, /@media \(max-width: 599px\)/);
  assert.match(globalStyles, /@media \(min-width: 600px\)/);
  assert.match(globalStyles, /safe-area-inset-bottom/);
  assert.doesNotMatch(globalStyles, /navigation-rail\.is-expanded|navigation-rail-toggle/);
});

test("Fidelity et Rainbow sont calculés depuis la source Google Blue retenue", () => {
  assert.match(materialTheme, /argbFromHex\("#0B57D0"\)/);
  assert.match(materialTheme, /Variant\.FIDELITY/);
  assert.match(materialTheme, /Variant\.RAINBOW/);
  assert.match(materialTheme, /specVersion: "2021"/);
  assert.match(materialTheme, /--md-sys-color-/);
  assert.match(materialTokens, /--md-sys-motion-easing-emphasized-decelerate/);
  assert.match(globalStyles, /prefers-reduced-motion: reduce/);
});


test("Rainbow ne colore plus les titres ou les surfaces générales", () => {

  const profil = globalStyles.slice(globalStyles.lastIndexOf(".profile-hero h1 span {"));
  const surfaceSymbolique = globalStyles.slice(globalStyles.lastIndexOf(".symbolic-card {"));
  assert.doesNotMatch(globalStyles, /\.hero::after\s*\{/);
  assert.doesNotMatch(globalStyles, /var\(--rainbow\)|color-rainbow-text/);
  assert.match(globalStyles, /h1 em,\s*h2 em\s*\{[^}]*color:\s*var\(--md-sys-color-primary\)/s);
  assert.doesNotMatch(globalStyles, /h1 em,\s*h2 em\s*\{[^}]*color:\s*var\(--namesia-color-category/);
  assert.doesNotMatch(profil.slice(0, profil.indexOf("\n}")), /color-rainbow/);
  assert.match(surfaceSymbolique, /var\(--namesia-color-category-container/);
  assert.match(surfaceSymbolique, /surface-container-low/);
});


test("les cartes évitent les effets décoratifs et les boutons utilisent les couches d’état Material", () => {
  assert.match(styles, /\.button::after/);
  assert.match(styles, /--md-sys-state-hover-state-layer-opacity/);
  assert.match(styles, /--md-sys-state-focus-state-layer-opacity/);
  assert.match(styles, /--md-sys-state-pressed-state-layer-opacity/);
  assert.doesNotMatch(styles, /filter:\s*brightness/);
  assert.doesNotMatch(globalStyles, /\.name-card:hover|\.featured-card:hover/);
  assert.doesNotMatch(globalStyles, /button:active[^}]*scale\(/);
});


const adminClient = await readFile(new URL("../app/admin/admin-client.tsx", import.meta.url), "utf8");
const adminFormStyles = await readFile(new URL("../app/admin/admin.module.css", import.meta.url), "utf8");
const partage = await readFile(new URL("../components/features/sharing/ShareLink.tsx", import.meta.url), "utf8");

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
  assert.match(partage, /import \{ Button \} from "@\/components\/material3\/Button"/);
  assert.match(partage, /<Button variant="tonal"/);
  assert.doesNotMatch(partage, /share-button/);
  assert.doesNotMatch(globalStyles, /\.share-button\s*\{/);
});


test("la navigation applique des couches d'état Material, pas des surfaces opaques au survol", () => {
  const navigationStyles = globalStyles.slice(
    globalStyles.indexOf(".navigation-item {"),
    globalStyles.indexOf(".navigation-rail .navigation-items")
  );
  assert.match(navigationStyles, /@media \(hover: hover\) and \(pointer: fine\)/);
  assert.match(navigationStyles, /on-surface-variant\) var\(--md-sys-state-hover-state-layer-opacity\), transparent/);
  assert.match(navigationStyles, /on-secondary-container\) var\(--md-sys-state-hover-state-layer-opacity\), var\(--md-sys-color-secondary-container\)/);
  assert.match(navigationStyles, /on-surface-variant\) var\(--md-sys-state-focus-state-layer-opacity\), transparent/);
  assert.match(navigationStyles, /on-secondary-container\) var\(--md-sys-state-pressed-state-layer-opacity\), var\(--md-sys-color-secondary-container\)/);
  assert.doesNotMatch(navigationStyles, /\.navigation-item:hover[^}]*surface-container-high/);
  assert.doesNotMatch(navigationStyles, /transition:[^;]*(?:180|250)ms/);
});


test("la typographie suit une échelle Material 3 unique sans surcharges responsives concurrentes", () => {
  assert.match(materialTokens, /--md-sys-typescale-display-small-size: 36px/);
  assert.match(materialTokens, /--md-sys-typescale-headline-large-size: 32px/);
  assert.match(materialTokens, /--md-sys-typescale-headline-medium-size: 28px/);
  assert.match(materialTokens, /--md-sys-typescale-headline-small-size: 24px/);
  assert.match(globalStyles, /\.hero h1 \{[^}]*var\(--md-sys-typescale-display-small-size\)/s);
  assert.match(globalStyles, /\.profile-hero h1 \{[^}]*var\(--md-sys-typescale-headline-large-size\)/s);
  assert.match(globalStyles, /\.section-heading h2 \{[^}]*var\(--md-sys-typescale-headline-medium-size\)/s);
  assert.match(globalStyles, /\.profile-lead \{[^}]*var\(--md-sys-typescale-body-large-size\)/s);
  assert.doesNotMatch(globalStyles, /\.profile-lead \{[^}]*1\.125rem/);
  assert.equal((globalStyles.match(/\.hero h1\s*\{/g) ?? []).length, 1);
  assert.equal((globalStyles.match(/\.profile-hero h1\s*\{/g) ?? []).length, 1);
  assert.equal((globalStyles.match(/\.section-heading h2\s*\{/g) ?? []).length, 1);
  assert.doesNotMatch(globalStyles, /--font-serif|var\(--serif\)/);
  assert.match(materialTokens, /--md-sys-typescale-body-large-font: var\(--font-roboto\);/);
  assert.match(materialTokens, /--md-sys-typescale-headline-large-font: var\(--font-roboto\);/);
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
  assert.doesNotMatch(globalStyles, /\.featured-card\s*\{[^}]*background:/s);
  assert.match(globalStyles, /\.profile-hero \{[^}]*surface-container-low/s);
  assert.match(globalStyles, /\.site-footer \{[^}]*surface-container/s);
  assert.doesNotMatch(globalStyles, /Couche Material 3 Fidelity/);
  assert.doesNotMatch(globalStyles, /radial-gradient\(ellipse at 88% 15%/);
  assert.doesNotMatch(globalStyles, /linear-gradient\(118deg/);
});


const rechercheActions = await readFile(new URL("../components/features/catalog/NameSearch.tsx", import.meta.url), "utf8");

test("les actions de catalogue, favoris et comparaison utilisent le bouton commun", () => {
  for (const source of [rechercheActions, favorites, comparator]) {
    assert.doesNotMatch(source, /<button\b/);
    assert.match(source, /<Button\s+variant="text"/);
    assert.match(source, /className="filter-action"/);
  }
  assert.match(favorites, /<Button\s+variant="tonal"/);
  assert.doesNotMatch(globalStyles, /\.filter-reset|\.compare-selection-footer > button/);
  assert.doesNotMatch(globalStyles, /\.copyButton\s*\{/);
  assert.match(globalStyles, /\.filter-action\s*\{[^}]*width: max-content/s);
});

test("les options de comparaison ont des états tactiles Material sans survol collant", () => {
  assert.match(globalStyles, /@media \(hover: hover\) and \(pointer: fine\) \{\s*\.compare-option:hover/);
  assert.doesNotMatch(globalStyles, /\.name-card:hover|\.featured-card:hover/);
  assert.match(globalStyles, /\.compare-option\s*\{[^}]*min-height: 62px/s);
  assert.match(globalStyles, /\.compare-option:active:not\(:has\(input:disabled\)\)/);
  assert.match(globalStyles, /\.compare-option:has\(input:checked\):active/);
  assert.match(globalStyles, /\.compare-option:has\(input:checked\)\s*\{[^}]*primary-container/s);
  assert.match(globalStyles, /\.compare-option:has\(input:checked\) \.compare-option-initial\s*\{[^}]*on-primary/s);
  assert.doesNotMatch(globalStyles, /\.compare-option input\s*\{[^}]*accent-color:/s);
});


test("les surfaces du catalogue et du comparateur ne dépendent plus de la couche Fidelity finale", () => {
  assert.match(globalStyles, /\.catalogue-filters\s*\{[^}]*surface-container-low/s);
  assert.match(globalStyles, /\.compare-selector\s*\{[^}]*surface-container-low/s);
  assert.match(globalStyles, /\.empty-results\s*\{[^}]*outline-variant/s);
  assert.doesNotMatch(globalStyles, /\.name-card\s*\{[^}]*background:/s);
  assert.match(globalStyles, /\.compare-option\s*\{[^}]*surface-container-low/s);
  assert.doesNotMatch(globalStyles, /\.compare-card\s*\{[^}]*background:/s);
  assert.match(globalStyles, /\.profile-note\s*\{[^}]*surface-container/s);
  assert.doesNotMatch(globalStyles, /Couche Material 3 Fidelity/);
  assert.doesNotMatch(globalStyles, /linear-gradient\(135deg, var\(--color-surface/);
});

test("la fiche prénom applique Material 3 dans ses règles canoniques", () => {
  assert.match(globalStyles, /\.profile-toc a\s*\{[^}]*min-height: 48px/s);
  assert.match(globalStyles, /a:focus-visible, button:focus-visible, input:focus-visible, select:focus-visible, textarea:focus-visible, \[tabindex="0"\]:focus-visible\s*\{[^}]*outline: 3px solid var\(--md-sys-color-primary\)/s);
  assert.match(globalStyles, /\.profile-section\s*\{[^}]*scroll-margin-top: 88px/s);
  assert.match(globalStyles, /\.profile-copy\s*\{[^}]*color: var\(--md-sys-color-on-surface\)/s);
  assert.match(globalStyles, /\.profile-section \+ \.profile-section\s*\{[^}]*outline-variant/s);
  assert.doesNotMatch(globalStyles, /Couche Material 3 Fidelity/);
  assert.doesNotMatch(globalStyles, /linear-gradient\(125deg, var\(--md-sys-color-surface-container/);
});

const historiqueActions = await readFile(new URL("../components/features/history/RecentNames.tsx", import.meta.url), "utf8");
test("les actions de découverte sont concentrées sur la fiche et le comparateur garde sa sélection native", () => {
  assert.match(historiqueActions, /<Button variant="text"[^>]*onClick=/);
  assert.doesNotMatch(historiqueActions, /<FavoriteButton/);
  assert.match(comparatorActions, /<ComparisonSelection/);
  assert.match(comparatorActions, /<Checkbox/);
  assert.doesNotMatch(comparatorActions, /type="checkbox"/);
  assert.doesNotMatch(comparatorActions, /ComparisonBar|ComparisonToggle/);
  assert.match(comparisonSelection, /<InputChip/);
});


const checkbox = await readFile(new URL("../components/material3/Checkbox.tsx", import.meta.url), "utf8");
const checkboxStyles = await readFile(new URL("../components/material3/Checkbox.module.css", import.meta.url), "utf8");

test("Checkbox porte le contrat AndroidX dans le comparateur sans contrôle concurrent", () => {
  assert.match(checkbox, /export function Checkbox/);
  assert.match(checkbox, /type="checkbox"/);
  assert.match(checkbox, /checked: boolean/);
  assert.match(checkbox, /disabled: boolean/);
  assert.match(checkbox, /onChange: \(checked: boolean\) => void/);
  assert.match(checkboxStyles, /width: 40px/);
  assert.match(checkboxStyles, /height: 40px/);
  assert.match(checkboxStyles, /width: 18px/);
  assert.match(checkboxStyles, /height: 18px/);
  assert.match(checkboxStyles, /border-radius: 2px/);
  assert.match(checkboxStyles, /md-sys-color-primary/);
  assert.match(checkboxStyles, /md-sys-color-on-primary/);
  assert.match(checkboxStyles, /md-sys-color-on-surface-variant/);
  assert.match(checkboxStyles, /focus-visible/);
  assert.match(comparatorActions, /<Checkbox/);
  assert.doesNotMatch(comparatorActions, /type="checkbox"/);
  assert.doesNotMatch(globalStyles, /\.compare-option input\s*\{[^}]*accent-color:/s);
});

const card = await readFile(new URL("../components/material3/Card.tsx", import.meta.url), "utf8");
const cardStyles = await readFile(new URL("../components/material3/Card.module.css", import.meta.url), "utf8");
const textField = await readFile(new URL("../components/material3/TextField.tsx", import.meta.url), "utf8");
const textFieldStyles = await readFile(new URL("../components/material3/TextField.module.css", import.meta.url), "utf8");

test("Card centralise les surfaces AndroidX et préserve l’élément HTML choisi", async () => {
  assert.match(card, /export function Card</);
  assert.match(card, /variant: CardVariant/);
  assert.match(card, /as: T;/);
  assert.match(card, /as: Component/);
  assert.match(card, /interactive: boolean/);
  assert.doesNotMatch(card, /as\?:|\?\?\s*["']div["']|interactive = false/);
  assert.match(cardStyles, /\.elevated\s*\{[^}]*surface-container-low/s);
  assert.match(cardStyles, /\.filled\s*\{[^}]*surface-container-highest/s);
  assert.match(cardStyles, /\.outlined\s*\{[^}]*outline-variant/s);
  assert.match(cardStyles, /\.interactive\.elevated:hover\s*\{[^}]*on-surface[^}]*hover-state-layer-opacity/s);
  for (const file of [
    "../components/features/catalog/RelatedNames.tsx",
    "../components/features/catalog/FeaturedNames.tsx",
    "../components/features/catalog/NameSearch.tsx",
    "../components/features/history/RecentNames.tsx",
    "../components/features/favorites/FavoritesList.tsx"
  ]) {
    const source = await readFile(new URL(file, import.meta.url), "utf8");
    assert.match(source, /<Card\s+as=\{Link\}\s+variant="elevated"\s+interactive/);
  }
  assert.match(cardStyles, /\.interactive\.elevated:active\s*\{[^}]*on-surface[^}]*pressed-state-layer-opacity[^}]*box-shadow: 0 1px 2px 0/s);
  assert.match(cardStyles, /\.interactive\.filled:active\s*\{[^}]*on-surface[^}]*pressed-state-layer-opacity/s);
  assert.match(cardStyles, /\.interactive\.outlined:active\s*\{[^}]*on-surface[^}]*pressed-state-layer-opacity/s);
  assert.doesNotMatch(cardStyles, /\.interactive\.(?:elevated|filled|outlined):active\s*\{[^}]*md-sys-color-primary/s);
  assert.match(cardStyles, /--md-sys-state-pressed-state-layer-opacity/);
  assert.match(checkboxStyles, /\.input:checked:not\(:disabled\):active \+ \.indicator\s*\{[^}]*md-sys-color-primary[^}]*pressed-state-layer-opacity/s);
  assert.match(checkboxStyles, /\.input:not\(:disabled\):hover \+ \.indicator\s*\{[^}]*border-color: var\(--md-sys-color-on-surface\)/s);
  assert.match(checkboxStyles, /\.input:not\(:disabled\):active \+ \.indicator\s*\{[^}]*border-color: var\(--md-sys-color-on-surface\)/s);
  assert.match(checkboxStyles, /\.input:checked:not\(:disabled\):hover \+ \.indicator\s*\{[^}]*md-sys-color-primary[^}]*hover-state-layer-opacity/s);
  assert.match(checkboxStyles, /\.input:focus-visible \+ \.indicator\s*\{[^}]*md-sys-color-on-surface[^}]*md-sys-color-secondary/s);
});

test("TextField reprend l’anatomie et les états AndroidX sans style local concurrent", () => {
  assert.match(textField, /export function TextField/);
  assert.match(textField, /variant: TextFieldVariant/);
  assert.match(textField, /aria-describedby/);
  assert.match(textField, /aria-invalid/);
  assert.match(textFieldStyles, /min-height: 56px/);
  assert.match(textFieldStyles, /placeholder-shown/);
  assert.match(textFieldStyles, /focus-within\.outlined/);
  assert.match(textFieldStyles, /md-sys-color-error/);
  assert.match(adminClient, /@\/components\/material3\/TextField/);
  assert.match(adminClient, /@\/components\/material3\/Snackbar/);
  assert.doesNotMatch(adminClient, /components\/ui\//);
});
