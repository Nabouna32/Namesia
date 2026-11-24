import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const config = await readFile(new URL("../next.config.ts", import.meta.url), "utf8");

test("les en-têtes HTTP de sécurité couvrent toutes les routes Next.js", () => {
  assert.match(config, /async headers\(\)/);
  assert.match(config, /source: "\/:path\*"/);
  assert.match(config, /X-Content-Type-Options.*nosniff/);
  assert.match(config, /X-Frame-Options.*DENY/);
  assert.match(config, /Referrer-Policy.*strict-origin-when-cross-origin/);
  assert.match(config, /Permissions-Policy.*camera=\(\), microphone=\(\), geolocation=\(\)/);
});
