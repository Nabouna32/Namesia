import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const workflow = await readFile(new URL("../.github/workflows/cloudflare.yml", import.meta.url), "utf8");
const wrangler = await readFile(new URL("../wrangler.jsonc", import.meta.url), "utf8");

test("les déploiements Cloudflare distants sont réservés à main", () => {
  assert.match(workflow, /pull_request:\s*\n\s*types:\s*\[labeled, closed\]/);
  assert.match(workflow, /github\.event_name == 'push' && github\.ref == 'refs\/heads\/main'/);
  assert.match(workflow, /github\.event_name == 'workflow_dispatch' && github\.ref == 'refs\/heads\/main'/);
  assert.doesNotMatch(workflow, /wrangler preview --name/);
  assert.doesNotMatch(workflow, /comment-preview:/);
  assert.doesNotMatch(wrangler, /"previews"\s*:/);
});

test("le diagnostic Playwright déclenché par label utilise un Worker local", () => {
  assert.match(workflow, /github\.event\.action == 'labeled' && github\.event\.label\.name == 'diagnostic-playwright'/);
  assert.match(workflow, /wrangler dev (local par défaut, sans --remote) --ip 127\.0\.0\.1 --port 8787/);
  assert.match(workflow, /PLAYWRIGHT_BASE_URL: \$\{\{ steps\.local_worker\.outputs\.test_url \}\}/);
  assert.match(workflow, /diagnostics-playwright-pr-/);
  assert.match(workflow, /retention-days: 1/);
});

test("les anciennes previews sont seulement supprimées à la fermeture d’une PR", () => {
  assert.match(workflow, /cleanup:\s*\n\s*name: Nettoyer une ancienne Preview Cloudflare/);
  assert.match(workflow, /github\.event\.action == 'closed'/);
  assert.match(workflow, /wrangler preview delete/);
  assert.match(workflow, /cancel-in-progress: true/);
});
