import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = async (path) => readFile(new URL(path, import.meta.url), "utf8");
const icon = await read("../components/material3/Icon.tsx");
const genderMap = await read("../lib/gender-icons.ts");
const genderIcon = await read("../components/features/names/GenderIcon.tsx");
const genderStyles = await read("../components/features/names/GenderIcon.module.css");
const filterChip = await read("../components/material3/FilterChip.tsx");
const catalogue = await read("../components/features/catalog/NameSearch.tsx");
const featured = await read("../components/features/catalog/FeaturedNames.tsx");
const related = await read("../components/features/catalog/RelatedNames.tsx");
const favorites = await read("../components/features/favorites/FavoritesList.tsx");
const discovery = await read("../components/features/discovery/RandomDiscovery.tsx");
const discoveryStyles = await read("../components/features/discovery/RandomDiscovery.module.css");
const comparator = await read("../components/features/comparison/NameComparator.tsx");
const profile = await read("../app/prenoms/[slug]/page.tsx");
const favoriteButton = await read("../components/features/favorites/FavoriteButton.tsx");

test("les quatre genres ont une correspondance SVG exhaustive dans leur composant métier", () => {
  for (const [label, marker] of [
    ["Féminin", "M480-800q-91"],
    ["Masculin", "M360-660a260"],
    ["Mixte", "M360-520q-66"],
    ["Genre non renseigné", "M480-880q-83"]
  ]) {
    assert.match(genderMap, new RegExp(`"${label}": \\{[\\s\\S]*?path: "${marker}`));
  }
  assert.match(genderMap, /Record<NameGender, GenderIconDefinition>/);
  assert.match(genderIcon, /GENDER_ICON_PATHS\[gender\]/);
  assert.match(genderIcon, /role=\\{decorative \\? undefined : "img"\\}/);
  assert.match(genderStyles, /width: 24px/);
  assert.match(genderIcon, /viewBox="0 -960 960 960"/);
  assert.doesNotMatch(icon, /gender-(female|male|mixed|unknown)/);
});

test("les vues de prénoms affichent le pictogramme sans libellé visible", () => {
  for (const source of [catalogue, featured, related, favorites, comparator, profile]) {
    assert.match(source, /<GenderIcon[^>]*gender=\{name\.gender\}/);
    assert.doesNotMatch(source, /<small>\{name\.gender\}<\/small>/);
    assert.doesNotMatch(source, /className="profile-tag">\{name\.gender\}/);
  }
  assert.match(profile, /new URL\("\/opengraph-image", siteUrl\)/);
  assert.match(profile, /images: \[\{ url: imageUrl/);
});

test("la découverte aléatoire affiche le pictogramme du prénom sélectionné", () => {
  assert.match(discovery, /<GenderIcon gender=\{selection\.gender\}/);
  assert.match(discoveryStyles, /\.resultLine \{[^}]*display: inline-flex;[^}]*align-items: center;[^}]*flex-wrap: wrap;[^}]*gap: 8px 12px;/s);
});

test("les filtres de genre utilisent le pictogramme métier en mode décoratif", () => {
  for (const source of [catalogue, favorites]) {
    assert.match(source, /leadingIcon=\{<GenderIcon gender=\{genre\} size=\{18\} decorative \/>/);
    assert.match(source, /iconOnly/);
  }
  assert.match(genderIcon, /<svg[\s\S]*?aria-hidden="true"/);
  assert.match(filterChip, /aria-label=\{iconOnly \? label : undefined\}/);
  assert.match(filterChip, /title=\{iconOnly \? label : undefined\}/);
});

test("les cartes de découverte ne portent plus d'actions de favori ou de comparaison", () => {
  for (const source of [catalogue, featured, related, favorites, discovery, comparator]) {
    assert.doesNotMatch(source, /<FavoriteButton/);
    assert.doesNotMatch(source, /<ComparisonToggle/);
    assert.doesNotMatch(source, /<ComparisonBar/);
  }
  assert.match(profile, /<FavoriteButton slug=\{name\.slug\} name=\{name\.name\}/);
  assert.match(profile, /Comparer ce prénom/);
  assert.match(comparator, /<Checkbox/);
  assert.doesNotMatch(comparator, /type="checkbox"/);
  assert.match(favoriteButton, /<Button/);
  assert.match(favoriteButton, /aria-label=\{label\}/);
});
