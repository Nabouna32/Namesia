import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { jsonLd } from "../lib/json-ld.ts";

const config = await readFile(new URL("../next.config.ts", import.meta.url), "utf8");

test("les en-têtes HTTP de sécurité couvrent toutes les routes Next.js", () => {
  assert.match(config, /async headers\(\)/);
  assert.match(config, /source: "\/:path\*"/);
  assert.match(config, /X-Content-Type-Options.*nosniff/);
  assert.match(config, /X-Frame-Options.*DENY/);
  assert.match(config, /Referrer-Policy.*strict-origin-when-cross-origin/);
  assert.match(config, /Permissions-Policy.*camera=\(\), microphone=\(\), geolocation=\(\)/);
});


test("le JSON-LD ne peut pas fermer son élément script", () => {
  const payload = { name: "</script><script>alert(1)</script>" };
  const serialized = jsonLd(payload);

  assert.equal(serialized.includes("</script>"), false);
  assert.equal(JSON.parse(serialized).name, payload.name);
  assert.match(serialized, /\\u003c/);
});

test("les pages publiques sérialisent leurs données structurées avec le helper sécurisé", async () => {
  const layout = await readFile(new URL("../app/layout.tsx", import.meta.url), "utf8");
  const catalogue = await readFile(new URL("../app/prenoms/page.tsx", import.meta.url), "utf8");
  const profile = await readFile(new URL("../app/prenoms/[slug]/page.tsx", import.meta.url), "utf8");

  assert.match(layout, /jsonLd\(siteWebData\)/);
  assert.match(catalogue, /jsonLd\(catalogueData\)/);
  assert.match(profile, /jsonLd\(ficheData\)/);
});
