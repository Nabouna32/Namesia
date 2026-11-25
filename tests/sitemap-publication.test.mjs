import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const namesSource = await readFile(new URL("../lib/names.ts", import.meta.url), "utf8");
const publication = await readFile(new URL("../lib/publication-prenom.ts", import.meta.url), "utf8");
const sitemap = await readFile(new URL("../app/sitemap.ts", import.meta.url), "utf8");

test("le sitemap expose la date réelle de publication de chaque fiche", () => {
  assert.match(namesSource, /type JoinedNameSitemap/);
  assert.match(publication, /Tables<"name_profiles">/);
  assert.match(namesSource, /\.eq\("name_profiles\.status", "publie"\)/);
  assert.match(namesSource, /\.not\("name_profiles\.published_at", "is", null\)/);
  assert.match(publication, /new Date\(profil\.published_at\)/);
  assert.match(publication, /Number\.isNaN\(datePublication\.getTime\(\)\)/);
  assert.match(sitemap, /getNamesSitemap/);
  assert.match(sitemap, /lastModified: prenom\.publishedAt/);
  assert.doesNotMatch(sitemap, /new Date\(\)/);
});

test("la lecture du sitemap est complète, stable et paginée", () => {
  assert.match(namesSource, /readAllPages<JoinedNameSitemap>/);
  assert.match(namesSource, /\.order\("slug", \{ ascending: true \}\)/);
  assert.match(namesSource, /\.order\("id", \{ ascending: true \}\)/);
  assert.match(namesSource, /countExact \? \{ count: "exact" \} : undefined/);
});
