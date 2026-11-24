import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = async (path) => readFile(new URL(path, import.meta.url), "utf8");
const icon = await read("../components/material3/Icon.tsx");
const genreMap = await read("../lib/genre-icons.ts");
const genreIcon = await read("../components/features/names/GenreIcon.tsx");
const genreStyles = await read("../components/features/names/GenreIcon.module.css");
const filterChip = await read("../components/material3/FilterChip.tsx");
const catalogue = await read("../components/features/catalog/NameSearch.tsx");
const featured = await read("../components/features/catalog/FeaturedNames.tsx");
const related = await read("../components/features/catalog/RelatedNames.tsx");
const history = await read("../components/features/history/RecentNames.tsx");
const favorites = await read("../components/features/favorites/FavoritesList.tsx");
const discovery = await read("../components/features/discovery/RandomDiscovery.tsx");
const discoveryStyles = await read("../components/features/discovery/RandomDiscovery.module.css");
const comparator = await read("../components/features/comparison/NameComparator.tsx");
const profile = await read("../app/prenoms/[slug]/page.tsx");
const openGraph = await read("../app/prenoms/[slug]/opengraph-image.tsx");
const favoriteButton = await read("../components/features/favorites/FavoriteButton.tsx");

test("les quatre genres ont une correspondance SVG exhaustive et centralisée", () => {
  for (const [label, name] of [
    ["Féminin", "gender-female"],
    ["Masculin", "gender-male"],
    ["Mixte", "gender-mixed"],
    ["Genre non renseigné", "gender-unknown"]
  ]) {
    assert.match(genreMap, new RegExp(`"${label}": "${name}"`));
    assert.match(icon, new RegExp(`"${name}":`));
  }
  assert.match(genreMap, /Record<GenrePrenom, IconName>/);
  assert.match(genreIcon, /role="img" aria-label=\{genre\}/);
  assert.match(genreStyles, /width: 24px/);
  assert.match(icon, /viewBox="0 -960 960 960"/);
});

test("les vues de prénoms affichent le pictogramme sans libellé visible", () => {
  for (const source of [catalogue, featured, related, history, favorites, comparator, profile]) {
    assert.match(source, /<GenreIcon[^>]*genre=\{prenom\.genre\}/);
    assert.doesNotMatch(source, /<small>\{prenom\.genre\}<\/small>/);
    assert.doesNotMatch(source, /className="profile-tag">\{prenom\.genre\}/);
  }
  assert.match(openGraph, /GENRE_ICONS\[prenom\.genre\]/);
  assert.doesNotMatch(openGraph, /\{prenom\.genre\}/);
});

test("la découverte aléatoire affiche le pictogramme du prénom sélectionné", () => {
  assert.match(discovery, /<GenreIcon genre=\{selection\.genre\}/);
  assert.match(discoveryStyles, /\.resultLine \{[^}]*display: inline-flex;[^}]*align-items: center;[^}]*flex-wrap: wrap;[^}]*gap: 8px 12px;/s);
});

test("les filtres de genre utilisent les pictogrammes et conservent un nom accessible", () => {
  for (const source of [catalogue, favorites]) {
    assert.match(source, /leadingIcon=\{<Icon name=\{GENRE_ICONS\[genre\]\}/);
    assert.match(source, /iconOnly/);
  }
  assert.match(filterChip, /aria-label=\{iconOnly \? label : undefined\}/);
  assert.match(filterChip, /title=\{iconOnly \? label : undefined\}/);
});

test("les cartes de découverte ne portent plus d'actions de favori ou de comparaison", () => {
  for (const source of [catalogue, featured, related, history, favorites, discovery, comparator]) {
    assert.doesNotMatch(source, /<FavoriteButton/);
    assert.doesNotMatch(source, /<ComparisonToggle/);
    assert.doesNotMatch(source, /<ComparisonBar/);
  }
  assert.match(profile, /<FavoriteButton slug=\{prenom\.slug\} name=\{prenom\.nom\}/);
  assert.match(profile, /Comparer ce prénom/);
  assert.match(comparator, /<Checkbox/);
  assert.doesNotMatch(comparator, /type="checkbox"/);
  assert.match(favoriteButton, /<Button/);
  assert.match(favoriteButton, /aria-label=\{label\}/);
});
