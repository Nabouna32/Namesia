import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const config = await readFile(new URL("../.github/dependabot.yml", import.meta.url), "utf8");
const standards = await readFile(new URL("../docs/standards-techniques.md", import.meta.url), "utf8");

function ecosystemConfig(name) {
  const start = config.indexOf(`- package-ecosystem: ${name}`);
  assert.notEqual(start, -1, `Configuration Dependabot absente pour ${name}`);
  const next = config.indexOf("\n  - package-ecosystem:", start + 1);
  return config.slice(start, next === -1 ? undefined : next);
}

test("npm et GitHub Actions sont vérifiés chaque lundi à midi, heure de Paris", () => {
  for (const name of ["npm", "github-actions"]) {
    const section = ecosystemConfig(name);
    assert.match(section, /schedule:\s+interval: weekly\s+day: monday\s+time: "12:00"\s+timezone: Europe\/Paris/);
  }
});

test("les mises à jour mineures et correctives sont regroupées avec un cooldown de sept jours", () => {
  for (const name of ["npm", "github-actions"]) {
    const section = ecosystemConfig(name);
    assert.match(section, /open-pull-requests-limit: 1/);
    assert.match(section, /cooldown:\s+default-days: 7/);
    assert.match(section, /groups:\s+minor-and-patch:\s+update-types:\s+- minor\s+- patch/);
  }
    assert.match(standards, /Dependabot regroupe chaque semaine les mises à jour mineures\/patch de npm et des actions GitHub, avec un délai de refroidissement de 7 jours et au plus une PR ouverte par écosystème/);
});

test("la configuration ne réintroduit ni cadence quotidienne ni limite massive de PR", () => {
  assert.doesNotMatch(config, /interval: (?:daily|cron)/);
  assert.doesNotMatch(config, /open-pull-requests-limit: (?:[2-9]|[1-9]\d+)/);
});
