import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const prenoms = await readFile(new URL("../lib/prenoms.ts", import.meta.url), "utf8");
const publication = await readFile(new URL("../lib/publication-prenom.ts", import.meta.url), "utf8");
const sitemap = await readFile(new URL("../app/sitemap.ts", import.meta.url), "utf8");

test("le sitemap expose la date réelle de publication de chaque fiche", () => {
  assert.match(prenoms, /type JoinedNameSitemap/);
  assert.match(publication, /published_at: string \| null/);
  assert.match(prenoms, /\.eq\("name_profiles\.status", "publie"\)/);
  assert.match(prenoms, /\.not\("name_profiles\.published_at", "is", null\)/);
  assert.match(publication, /new Date\(profil\.published_at\)/);
  assert.match(publication, /Number\.isNaN\(datePublication\.getTime\(\)\)/);
  assert.match(sitemap, /getPrenomsSitemap/);
  assert.match(sitemap, /lastModified: prenom\.publishedAt/);
  assert.doesNotMatch(sitemap, /new Date\(\)/);
});

test("la lecture du sitemap est complète, stable et paginée", () => {
  assert.match(prenoms, /lireToutesLesPages<JoinedNameSitemap>/);
  assert.match(prenoms, /\.order\("slug", \{ ascending: true \}\)/);
  assert.match(prenoms, /\.order\("id", \{ ascending: true \}\)/);
  assert.match(prenoms, /compter \? \{ count: "exact" \} : undefined/);
});
