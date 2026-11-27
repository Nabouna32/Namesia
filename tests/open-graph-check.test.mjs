import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { extractOpenGraphImageUrl } from "../scripts/verify-open-graph.mjs";

const workflow = await readFile(new URL("../.github/workflows/cloudflare.yml", import.meta.url), "utf8");

const siteUrl = "https://namesia.nabouna.workers.dev";

test("extrait une image Open Graph absolue de même origine", () => {
  const html = '<html><head><meta property="og:image" content="https://namesia.nabouna.workers.dev/opengraph-image"></head></html>';
  assert.equal(
    extractOpenGraphImageUrl(html, siteUrl),
    "https://namesia.nabouna.workers.dev/opengraph-image"
  );
});

test("accepte les attributs dans un ordre différent et les guillemets simples", () => {
  const html = "<meta content='https://namesia.nabouna.workers.dev/social.png' property='og:image'>";
  assert.equal(
    extractOpenGraphImageUrl(html, siteUrl),
    "https://namesia.nabouna.workers.dev/social.png"
  );
});

test("refuse une page sans balise og:image", () => {
  assert.throws(
    () => extractOpenGraphImageUrl("<html><head><title>Alice</title></head></html>", siteUrl),
    /Aucune balise og:image trouvée/
  );
});

test("refuse une URL relative", () => {
  assert.throws(
    () => extractOpenGraphImageUrl('<meta property="og:image" content="/opengraph-image">', siteUrl),
    /Invalid URL/
  );
});

test("refuse une image servie depuis une autre origine", () => {
  assert.throws(
    () => extractOpenGraphImageUrl('<meta property="og:image" content="https://cdn.example.com/image.png">', siteUrl),
    /même origine/
  );
});

test("refuse une origine de site non HTTPS", () => {
  assert.throws(
    () => extractOpenGraphImageUrl('<meta property="og:image" content="https://namesia.nabouna.workers.dev/image.png">', "http://namesia.nabouna.workers.dev"),
    /doit utiliser HTTPS/
  );
});

test("le contrôle post-déploiement extrait og:image et vérifie le type MIME", () => {
  assert.equal(workflow.match(/node scripts\/verify-open-graph\.mjs/g)?.length, 2);
  assert.doesNotMatch(workflow, /grep -Fq "opengraph-image"/);
  assert.match(workflow, /profile_og_type/);
  assert.match(workflow, /test "\$profile_og_type" = "image\/png"/);
});
