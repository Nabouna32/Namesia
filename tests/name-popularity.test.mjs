import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  NAME_POPULARITY_2025,
  NAME_POPULARITY_2025_SOURCE_URL,
  getNamePopularity2025
} from "../lib/name-popularity.ts";

const page = await readFile(new URL("../app/tendances/page.tsx", import.meta.url), "utf8");
const sitemap = await readFile(new URL("../app/sitemap.ts", import.meta.url), "utf8");
const profileCard = await readFile(new URL("../components/features/popularity/NamePopularityCard.tsx", import.meta.url), "utf8");

test("le classement Insee 2025 contient dix prénoms par genre", () => {
  const femaleNames = NAME_POPULARITY_2025.filter((entry) => entry.gender === "Féminin");
  const maleNames = NAME_POPULARITY_2025.filter((entry) => entry.gender === "Masculin");
  assert.equal(femaleNames.length, 10);
  assert.equal(maleNames.length, 10);
  assert.deepEqual(femaleNames.map((entry) => entry.rank), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  assert.deepEqual(maleNames.map((entry) => entry.rank), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
});

test("les entrées du classement ont des slugs uniques et des effectifs positifs", () => {
  const slugs = NAME_POPULARITY_2025.map((entry) => entry.slug);
  assert.equal(new Set(slugs).size, 20);
  assert.ok(NAME_POPULARITY_2025.every((entry) => entry.births > 0));
  assert.equal(getNamePopularity2025("alice")?.rank, 10);
  assert.equal(getNamePopularity2025("gabriel")?.rank, 1);
  assert.equal(getNamePopularity2025("lina"), undefined);
});

test("la page expose les profils publiés sans masquer les entrées hors catalogue", () => {
  assert.match(page, /export const dynamic = "force-dynamic"/);
  assert.match(page, /publishedSlugs\.has\(entry\.slug\)/);
  assert.match(page, /Fiche non publiée sur Namesia/);
  assert.match(page, /NAME_POPULARITY_2025_SOURCE_URL/);
  assert.match(sitemap, /new URL\("\/tendances", siteUrl\)/);
  assert.match(profileCard, /getNamePopularity2025\(slug\)/);
  assert.match(profileCard, /popularity\.name !== name \|\| popularity\.gender !== gender/);
  assert.match(page, /publishedName\.nom !== entry\.name \|\| publishedName\.genre !== entry\.gender/);
});

test("le classement renvoie directement vers la publication officielle de l’Insee", () => {
  assert.match(NAME_POPULARITY_2025_SOURCE_URL, /^https:\/\/www\.insee\.fr\//);
});
