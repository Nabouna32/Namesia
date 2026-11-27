import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const config = await readFile(new URL("../.github/dependabot.yml", import.meta.url), "utf8");

function ecosystemConfig(name) {
  const start = config.indexOf("- package-ecosystem: " + name);
  assert.notEqual(start, -1, "Configuration Dependabot absente pour " + name);
  const next = config.indexOf("\n  - package-ecosystem:", start + 1);
  return config.slice(start, next === -1 ? undefined : next);
}

test("npm et GitHub Actions sont vérifiés chaque jour à midi, heure de Paris", () => {
  for (const name of ["npm", "github-actions"]) {
    const section = ecosystemConfig(name);
    assert.match(section, /schedule:\s+interval: cron\s+cronjob: "0 12 \* \* \*"\s+timezone: Europe\/Paris/);
  }
});

test("chaque mise à jour reste isolée et conserve le refroidissement de sécurité", () => {
  for (const name of ["npm", "github-actions"]) {
    const section = ecosystemConfig(name);
    assert.match(section, /open-pull-requests-limit: 1000/);
    assert.match(section, /cooldown:\s+default-days: 7/);
    assert.doesNotMatch(section, /groups:/);
  }
});

test("la configuration ne regroupe pas les mises à jour", () => {
  assert.doesNotMatch(config, /groups:/);
});
