import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const catalogue = await readFile(new URL("../components/features/catalog/NameSearch.tsx", import.meta.url), "utf8");
const catalogueStyles = await readFile(new URL("../components/features/catalog/NameSearch.module.css", import.meta.url), "utf8");
const icons = await readFile(new URL("../components/material3/Icon.tsx", import.meta.url), "utf8");
const comparison = await readFile(new URL("../components/features/comparison/ComparisonToggle.tsx", import.meta.url), "utf8");
const comparisonStyles = await readFile(new URL("../components/features/comparison/ComparisonToggle.module.css", import.meta.url), "utf8");
const favorite = await readFile(new URL("../components/features/favorites/FavoriteButton.tsx", import.meta.url), "utf8");
const prenomModel = await readFile(new URL("../lib/prenoms.ts", import.meta.url), "utf8");

test("les cartes du catalogue représentent explicitement les quatre genres connus", () => {
  for (const [label, icon] of [
    ["Féminin", "gender-female"],
    ["Masculin", "gender-male"],
    ["Mixte", "gender-mixed"],
    ["Genre non renseigné", "gender-unknown"]
  ]) {
    assert.match(catalogue, new RegExp(`"${label}": "${icon}"`));
    assert.match(icons, new RegExp(`"${icon}":`));
  }
  assert.match(prenomModel, /export type GenrePrenom = "Féminin" \| "Masculin" \| "Mixte" \| "Genre non renseigné"/);
  assert.match(catalogue, /Record<GenrePrenom, IconName>/);
  assert.match(catalogue, /className="sr-only">\{prenom\.genre\}/);
  assert.doesNotMatch(catalogue, /\{prenom\.genre\}\s*·/);
  assert.doesNotMatch(catalogue, /Découvrir la fiche/);
  assert.equal((catalogue.match(/<Icon name=\{genderIcons\[prenom\.genre\]\}/g) ?? []).length, 2);
  assert.equal((catalogue.match(/<ComparisonToggle\\s+iconOnly/g) ?? []).length, 2);
});

test("les actions restent dans la carte sans être imbriquées dans le lien", () => {
  assert.equal((catalogue.match(/<Card as=\{Link\}/g) ?? []).length, 2);
  assert.equal((catalogue.match(/<\/Card>\s*<div className=\{styles\.resultActions\}>/g) ?? []).length, 2);
  assert.match(catalogueStyles, /\.resultActions\s*\{[^}]*position:\s*absolute/s);
  assert.match(catalogueStyles, /\.resultLink\.resultLink\s*\{[^}]*padding-top:\s*60px/s);
  assert.match(favorite, /<IconButton label=\{label\}/);
  assert.match(comparison, /aria-pressed=\{selected\}/);
  assert.match(comparison, /className="sr-only"/);
  assert.match(comparisonStyles, /width:\s*48px/);
  assert.match(comparisonStyles, /min-height:\s*48px/);
});
