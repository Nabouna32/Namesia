import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const wrangler = JSON.parse(await readFile(new URL("../wrangler.jsonc", import.meta.url), "utf8"));
const adminAuth = await readFile(new URL("../lib/admin-auth.ts", import.meta.url), "utf8");
const adminPage = await readFile(new URL("../app/admin/page.tsx", import.meta.url), "utf8");
const workflow = await readFile(new URL("../.github/workflows/cloudflare.yml", import.meta.url), "utf8");

test("les previews Cloudflare ont un environnement distinct de la production", () => {
  assert.equal(wrangler.vars.NAMESIA_DEPLOYMENT_ENVIRONMENT, "production");
  assert.equal(wrangler.previews.vars.NAMESIA_DEPLOYMENT_ENVIRONMENT, "preview");
  assert.deepEqual(Object.keys(wrangler.previews).sort(), ["observability", "vars"]);
});

test("les previews ne peuvent pas accéder aux opérations d'administration", () => {
  assert.match(adminAuth, /NAMESIA_DEPLOYMENT_ENVIRONMENT === "preview"/);
  assert.match(adminPage, /NAMESIA_DEPLOYMENT_ENVIRONMENT === "preview"/);
  assert.match(adminPage, /dynamic = "force-dynamic"/);
  assert.match(adminPage, /Administration indisponible/);
});

test("les previews sont déployées uniquement pour les PR internes humaines et supprimées à leur fermeture", () => {
  assert.match(workflow, /pull_request:\n    types: \[opened, synchronize, reopened, labeled, closed\]/);
  assert.match(workflow, /github\.event\.pull_request\.head\.repo\.full_name == github\.repository/);
  assert.equal(workflow.split("github.event.pull_request.user.login != 'dependabot[bot]'").length - 1, 2);
  assert.match(workflow, /github\.event\.action != 'labeled' \|\| github\.event\.label\.name == 'diagnostic-playwright'/);
  assert.match(workflow, /wrangler preview --name "pr-/);
  assert.match(workflow, /wrangler preview delete --name "pr-/);
  assert.match(workflow, /x-robots-tag:.*noindex/);
  assert.match(workflow, /sed -n '\/\^\{/);
  assert.match(workflow, /Administration indisponible/);
  assert.match(workflow, /test "\$admin_status" = "403"/);
  assert.match(workflow, /gh pr comment/);
});

test("la production vérifie SSR, catalogue, SEO, Open Graph et refuse l'administration sans jeton", () => {
  assert.match(workflow, /Vérifier les parcours publics et la frontière administrateur/);
  assert.match(workflow, /check_html "\/prenoms"/);
  assert.match(workflow, /check_html "\/prenoms\/alice"/);
  assert.match(workflow, /\$SITE_URL\/robots\.txt/);
  assert.match(workflow, /\$SITE_URL\/sitemap\.xml/);
  assert.match(workflow, /api\/prenoms\?slug=alice&slug=emma/);
  assert.match(workflow, /auth\/v1\/settings/);
  assert.match(workflow, /\.external\.email == true/);
  assert.match(workflow, /opengraph-image/);
  assert.match(workflow, /\$SITE_URL\/opengraph-image/);
  assert.match(workflow, /test "\$status" = "401"/);
});
