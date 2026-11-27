import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const siteUrl = await readFile(new URL("../lib/site-url.ts", import.meta.url), "utf8");
const environments = await readFile(new URL("../docs/platform/ENVIRONMENTS-AND-SECRETS.md", import.meta.url), "utf8");
const envExample = await readFile(new URL("../.env.example", import.meta.url), "utf8");
const workflow = await readFile(new URL("../.github/workflows/ci.yml", import.meta.url), "utf8");

test("l'origine canonique est explicite, validée et sans fallback", () => {
  assert.match(siteUrl, /if \(!configuredSiteUrl\)/);
  assert.match(siteUrl, /throw new Error\("NEXT_PUBLIC_SITE_URL est obligatoire\."/);
  assert.match(siteUrl, /new URL\(configuredSiteUrl\)/);
  assert.match(siteUrl, /siteUrl\.protocol !== "https:"/);
  assert.doesNotMatch(siteUrl, /\?\?/);
  assert.match(readme, /NEXT_PUBLIC_SITE_URL` \(requise/);
  assert.match(envExample, /NEXT_PUBLIC_SITE_URL=https:\/\/namesia\.nabouna\.workers\.dev/);
  assert.match(workflow, /NEXT_PUBLIC_SITE_URL: https:\/\/namesia\.nabouna\.workers\.dev/);
});
