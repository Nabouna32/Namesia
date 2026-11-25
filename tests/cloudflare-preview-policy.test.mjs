import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const wrangler = JSON.parse(await readFile(new URL("../wrangler.jsonc", import.meta.url), "utf8"));
const adminAuth = await readFile(new URL("../lib/admin-auth.ts", import.meta.url), "utf8");
const adminPage = await readFile(new URL("../app/admin/page.tsx", import.meta.url), "utf8");
const workflow = await readFile(new URL("../.github/workflows/cloudflare-preview.yml", import.meta.url), "utf8");

test("les previews Cloudflare ont un environnement distinct de la production", () => {
  assert.equal(wrangler.vars.NAMESIA_DEPLOYMENT_ENVIRONMENT, "production");
  assert.equal(wrangler.previews.vars.NAMESIA_DEPLOYMENT_ENVIRONMENT, "preview");
  assert.deepEqual(Object.keys(wrangler.previews).sort(), ["observability", "vars"]);
});

test("les previews ne peuvent pas accéder aux opérations d'administration", () => {
  assert.match(adminAuth, /NAMESIA_DEPLOYMENT_ENVIRONMENT === "preview"/);
  assert.match(adminPage, /NAMESIA_DEPLOYMENT_ENVIRONMENT === "preview"/);
  assert.match(adminPage, /Administration indisponible/);
});

test("les previews sont déployées uniquement pour les PR du dépôt et supprimées à leur fermeture", () => {
  assert.match(workflow, /pull_request:\n    types: \[opened, synchronize, reopened, closed\]/);
  assert.match(workflow, /github\.event\.pull_request\.head\.repo\.full_name == github\.repository/);
  assert.match(workflow, /wrangler preview --name "pr-/);
  assert.match(workflow, /wrangler preview delete --name "pr-/);
  assert.match(workflow, /x-robots-tag:.*noindex/);
  assert.match(workflow, /gh pr comment/);
});
