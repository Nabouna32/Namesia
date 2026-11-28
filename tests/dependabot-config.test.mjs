import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const config = await readFile(new URL("../.github/dependabot.yml", import.meta.url), "utf8");
const standards = await readFile(new URL("../docs/platform/DEPENDABOT.md", import.meta.url), "utf8");
const adr = await readFile(new URL("../docs/decisions/ADR-0052-DAILY-DEPENDABOT-UPDATES.md", import.meta.url), "utf8");

function ecosystemConfig(name) {
  const start = config.indexOf(`- package-ecosystem: ${name}`);
  assert.notEqual(start, -1, `Configuration Dependabot absente pour ${name}`);
  const next = config.indexOf("\n  - package-ecosystem:", start + 1);
  return config.slice(start, next === -1 ? undefined : next);
}

test("npm et GitHub Actions sont vérifiés chaque jour calendaire à midi, heure de Paris", () => {
  for (const name of ["npm", "github-actions"]) {
    const section = ecosystemConfig(name);
    assert.match(section, /schedule:\s+interval: cron\s+cronjob: "0 12 \* \* \*"\s+timezone: Europe\/Paris/);
  }
  assert.match(adr, /tous les jours calendaires à 12 h/);
  assert.match(standards, /chaque jour calendaire à 12 h/);
});

test("chaque mise à jour reste isolée et conserve le refroidissement de sécurité", () => {
  for (const name of ["npm", "github-actions"]) {
    const section = ecosystemConfig(name);
    assert.match(section, /open-pull-requests-limit: 1000/);
    assert.match(section, /cooldown:\s+default-days: 7/);
    assert.doesNotMatch(section, /groups:/);
  }
  assert.match(adr, /aucun groupe/);
  assert.match(standards, /chaque mise à jour dans une PR distincte/);
});

test("les mises à jour de sécurité ne sont pas retardées par le cooldown des versions", () => {
  assert.match(adr, /mécanisme distinct de security updates/);
  assert.doesNotMatch(config, /groups:/);
});
