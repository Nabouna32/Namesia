import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const adminAuth = await readFile(new URL("../lib/admin-auth.ts", import.meta.url), "utf8");
const adminPage = await readFile(new URL("../app/admin/page.tsx", import.meta.url), "utf8");
const workflow = await readFile(new URL("../.github/workflows/cloudflare.yml", import.meta.url), "utf8");
const wrangler = JSON.parse(await readFile(new URL("../wrangler.jsonc", import.meta.url), "utf8"));

test("l'administration est désactivée dans les Previews", () => {
  assert.match(adminAuth, /NAMESIA_DEPLOYMENT_ENVIRONMENT === "preview"/);
  assert.match(adminPage, /NAMESIA_DEPLOYMENT_ENVIRONMENT === "preview"/);
  assert.match(adminPage, /Administration indisponible/);
  assert.match(adminPage, /robots: \{ index: false, follow: false \}/);
});

test("les Previews ne disposent que de leur indicateur d'environnement", () => {
  assert.deepEqual(Object.keys(wrangler.previews).sort(), ["vars"]);
  assert.equal(wrangler.previews.vars.NAMESIA_DEPLOYMENT_ENVIRONMENT, "preview");
  assert.doesNotMatch(JSON.stringify(wrangler.previews), /SECRET|TOKEN|SERVICE_ROLE/i);
});

test("les forks et Dependabot ne reçoivent jamais les secrets de déploiement", () => {
  const previewStep = workflow.match(/- name: Créer ou mettre à jour la Preview Cloudflare[\s\S]*?(?=\n      - name: Vérifier la Preview Cloudflare)/)?.[0];
  assert.ok(previewStep, "L'étape de création de Preview doit exister");
  assert.match(previewStep, /head\.repo\.full_name == github\.repository/);
  assert.match(previewStep, /user\.login != 'dependabot\[bot\]'/);
  assert.match(previewStep, /CLOUDFLARE_API_TOKEN: \$\{\{ secrets\.CLOUDFLARE_API_TOKEN \}\}/);
  assert.match(workflow, /github\.event\.pull_request\.user\.login != 'dependabot\[bot\]'/);
});
