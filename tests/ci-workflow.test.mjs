import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const workflow = await readFile(new URL("../.github/workflows/ci.yml", import.meta.url), "utf8");
const agents = await readFile(new URL("../AGENTS.md", import.meta.url), "utf8");\nconst actionsGuide = await readFile(new URL("../docs/platform/GITHUB-ACTIONS.md", import.meta.url), "utf8");

test("les actions GitHub sont épinglées sur des commits immuables", () => {
  const references = [...workflow.matchAll(/^\s*uses:\s*([^@\s]+)@([^\s#]+)(?:\s+#\s*(v[\w.-]+))?\s*$/gm)];
  assert.ok(references.length > 0, "Le workflow doit déclarer ses actions explicitement");
  for (const [, action, sha, version] of references) {
    assert.match(sha, /^[a-f0-9]{40}$/, `Référence mutable pour ${action}`);
    assert.match(version ?? "", /^v\d+(?:\.\d+(?:\.\d+)?)?$/, `Version amont absente pour ${action}`);
  }
  assert.match(actionsGuide, /Les actions tierces sont épinglées sur un SHA complet/);
  assert.match(workflow, /persist-credentials: false/);
  assert.match(workflow, /npm audit --omit=dev --audit-level=high/);
  assert.match(workflow, /npm audit --audit-level=high/);
  assert.match(workflow, /AUDIT_OUTCOME/);
  assert.match(workflow, /AUDIT_FULL_OUTCOME/);
});

test("la CI bloque sur un audit de production rouge et expose l'audit complet en diagnostic", () => {
  assert.match(workflow, /id: audit[\s\S]*npm audit --omit=dev --audit-level=high[\s\S]*continue-on-error: true/);
  assert.match(workflow, /id: audit_full[\s\S]*npm audit --audit-level=high[\s\S]*continue-on-error: true/);
  assert.match(workflow, /AUDIT_OUTCOME: \$\{\{ steps\.audit\.outcome \}\}/);
  assert.match(workflow, /AUDIT_FULL_OUTCOME: \$\{\{ steps\.audit_full\.outcome \}\}/);
  assert.match(workflow, /if \[\[ "\$AUDIT_OUTCOME" != "success"/);
  assert.doesNotMatch(workflow, /if \[\[ [^\n]*AUDIT_FULL_OUTCOME/);
});

test("la CI restaure le cache Next.js avec une action épinglée", () => {
  assert.ok(workflow.includes("actions/cache@55cc8345863c7cc4c66a329aec7e433d2d1c52a9 # v6.1.0"));
  assert.ok(workflow.includes("path: .next/cache"));
  assert.ok(workflow.includes("key: ${{ runner.os }}-nextjs-${{ hashFiles('package-lock.json') }}-${{ github.sha }}"));
  assert.ok(workflow.includes("restore-keys:"));
});

test("la charte impose d'attendre la fin de la CI avant toute fusion", () => {
  assert.match(agents, /attendre la fin de tous les contrôles requis avant de fusionner/);
  assert.match(agents, /Ne jamais fusionner tant qu'un contrôle requis est en cours, en attente ou en échec/);
  assert.match(agents, /Si un contrôle échoue[\s\S]*corriger la cause puis attendre une nouvelle exécution complète/);
});
