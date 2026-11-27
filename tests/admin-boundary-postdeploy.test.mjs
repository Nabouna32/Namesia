import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const workflow = await readFile(new URL("../.github/workflows/cloudflare.yml", import.meta.url), "utf8");
const adminAuth = await readFile(new URL("../lib/admin-auth.ts", import.meta.url), "utf8");

test("la vérification de production distingue authentification et protection CSRF", () => {
  assert.match(adminAuth, /origin !== new URL\(request\.url\)\.origin/);
  assert.match(workflow, /get_status=.*request GET/);
  assert.match(workflow, /test "\$get_status" = "401"/);
  assert.match(workflow, /post_without_origin_status=.*request POST/);
  assert.match(workflow, /test "\$post_without_origin_status" = "403"/);
  assert.match(workflow, /Origin: \$SITE_URL/);
  assert.match(workflow, /test "\$post_with_origin_status" = "401"/);
});
