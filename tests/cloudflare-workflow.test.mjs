import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const workflow = await readFile(new URL("../.github/workflows/cloudflare.yml", import.meta.url), "utf8");
const wrangler = JSON.parse(await readFile(new URL("../wrangler.jsonc", import.meta.url), "utf8"));

test("les PR internes humaines créent une Preview Wrangler à chaque mise à jour", () => {
  assert.match(workflow, /pull_request:\s*\n\s*types:\s*\[opened, synchronize, reopened, labeled, closed\]/);
  assert.match(workflow, /wrangler preview --name/);
  assert.match(workflow, /github\.event\.pull_request\.head\.repo\.full_name == github\.repository/);
  assert.match(workflow, /github\.event\.pull_request\.user\.login != 'dependabot\[bot\]'/);
  assert.match(workflow, /vars\.CLOUDFLARE_DEPLOY_ENABLED == 'true'/);
  assert.match(workflow, /steps\.preview\.outputs\.preview_url/);
  assert.match(workflow, /comment-preview:/);
  assert.match(workflow, /--edit-last --create-if-none/);
  assert.match(workflow, /wrangler preview delete --name/);
});

test("la Preview est contrôlée et les parcours Playwright utilisent son URL", () => {
  assert.match(workflow, /x-robots-tag:.*noindex/i);
  assert.match(workflow, /Administration indisponible/);
  assert.match(workflow, /test "\$admin_status" = "403"/);
  assert.match(workflow, /PLAYWRIGHT_BASE_URL: \$\{\{ steps\.preview\.outputs\.preview_url \}\}/);
  assert.match(workflow, /PLAYWRIGHT_DIAGNOSTICS:.*diagnostic-playwright/);
  assert.match(workflow, /diagnostics-playwright-pr-/);
  assert.match(workflow, /retention-days: 1/);
});

test("la production reste déployée uniquement depuis main par OpenNext", () => {
  assert.match(workflow, /github\.event_name == 'push' && github\.ref == 'refs\/heads\/main'/);
  assert.match(workflow, /github\.event_name == 'workflow_dispatch' && github\.ref == 'refs\/heads\/main'/);
  assert.match(workflow, /opennextjs-cloudflare deploy/);
  assert.doesNotMatch(workflow, /wrangler deploy/);
  assert.match(workflow, /cancel-in-progress: \\$\\{\\{ github\\.event\\.action != 'closed' \\}\\}/);
});

test("les variables Wrangler séparent explicitement production et Preview", () => {
  assert.equal(wrangler.vars.NAMESIA_DEPLOYMENT_ENVIRONMENT, "production");
  assert.deepEqual(wrangler.previews.vars, { NAMESIA_DEPLOYMENT_ENVIRONMENT: "preview" });
  assert.deepEqual(Object.keys(wrangler.previews).sort(), ["vars"]);
});
