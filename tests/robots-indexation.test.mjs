import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const robots = await readFile(new URL("../app/robots.ts", import.meta.url), "utf8");
const admin = await readFile(new URL("../app/admin/page.tsx", import.meta.url), "utf8");
const workflow = await readFile(new URL("../.github/workflows/cloudflare.yml", import.meta.url), "utf8");

test("les robots peuvent lire le noindex de l’administration sans explorer les API", () => {
  assert.match(admin, /robots:\s*\{\s*index:\s*false,\s*follow:\s*false\s*\}/s);
  assert.doesNotMatch(robots, /disallow:\s*\[[^\]]*["']\/admin["']/s);
  assert.match(robots, /disallow:\s*\[[^\]]*["']\/api["']/s);
});

test("le contrôle post-déploiement respecte la politique noindex de l'administration", () => {
  assert.doesNotMatch(workflow, /Disallow: \/admin/);
  assert.match(workflow, /Disallow: \/api/);
  assert.match(workflow, /Sitemap: \$SITE_URL\/sitemap\.xml/);
});
