import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const workflow = await readFile(new URL("../.github/workflows/ci.yml", import.meta.url), "utf8");
const agents = await readFile(new URL("../AGENTS.md", import.meta.url), "utf8");

test("les actions GitHub sont épinglées sur des commits immuables", () => {
  const references = [...workflow.matchAll(/^\s*uses:\s*([^@\s]+)@([^\s#]+)(?:\s+#\s*(v[\w.-]+))?\s*$/gm)];
  assert.ok(references.length > 0, "Le workflow doit déclarer ses actions explicitement");
  for (const [, action, sha, version] of references) {
    assert.match(sha, /^[a-f0-9]{40}$/, `Référence mutable pour ${action}`);
    assert.match(version ?? "", /^v\d+(?:\.\d+(?:\.\d+)?)?$/, `Version amont absente pour ${action}`);
  }
  assert.match(agents, /Toutes les actions GitHub.*SHA de commit complet à 40 caractères/);
  assert.match(workflow, /persist-credentials: false/);
  assert.match(workflow, /npm audit --omit=dev --audit-level=high/);
  assert.match(workflow, /AUDIT_OUTCOME/);
});
