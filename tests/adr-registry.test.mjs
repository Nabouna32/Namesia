import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import { test } from "node:test";

const directory = new URL("../docs/decisions/", import.meta.url);
const registry = await readFile(new URL("README.md", directory), "utf8");
const allowedStatuses = new Set(["active", "remplacée", "retirée", "obsolète"]);

function metadata(content, label) {
  const prefix = "- **" + label + " :** ";
  const matches = content.split("\n").filter((line) => line.startsWith(prefix));
  assert.equal(matches.length, 1, "Métadonnée absente ou dupliquée : " + label);
  return matches[0].slice(prefix.length);
}

test("les ADR ont un nom normalisé, un identifiant unique et des métadonnées valides", async () => {
  const entries = await readdir(directory);
  const candidates = entries.filter((file) => file.startsWith("ADR-") && file.endsWith(".md") && file !== "ADR-MAINTENANCE.md").sort();

  assert.ok(candidates.length > 0, "Aucune ADR numérotée trouvée.");
  for (const file of candidates) {
    assert.match(file, /^ADR-\d{4}-[A-Z0-9]+(?:-[A-Z0-9]+)*\.md$/, "Nom ADR non conforme : " + file);
  }

  const identifiers = candidates.map((file) => file.match(/^ADR-(\d{4})-/)[1]);
  assert.equal(new Set(identifiers).size, candidates.length, "Deux ADR partagent le même identifiant.");

  const statusesByFile = new Map();
  for (const file of candidates) {
    const [, identifier] = file.match(/^ADR-(\d{4})-/);
    const content = await readFile(new URL(file, directory), "utf8");
    const title = content.split("\n", 1)[0];
    assert.ok(title.startsWith("# ADR-" + identifier + " "), file + " doit déclarer son identifiant dans le titre.");

    const status = metadata(content, "Statut");
    assert.ok(allowedStatuses.has(status), file + " possède un statut invalide : " + status);
    assert.match(metadata(content, "Version"), /^\d+(?:\.\d+)*$/, file + " possède une version invalide.");
    assert.match(metadata(content, "Mis à jour le"), /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2} \(Europe\/Paris\)$/, file + " possède une date de mise à jour invalide.");
    assert.match(metadata(content, "Décision prise le"), /^\d{4}-\d{2}-\d{2}(?: \d{2}:\d{2}:\d{2} \(Europe\/Paris\)| \(heure non consignée\))$/, file + " possède une date de décision invalide.");
    statusesByFile.set(file, status);

    for (const [, target] of content.matchAll(/\]\((?:\.\/)?(ADR-\d{4}-[^)#]+\.md)(?:#[^)]*)?\)/g)) {
      assert.ok(candidates.includes(target), file + " référence un ADR absent : " + target);
    }
  }

  const registryEntries = [...registry.matchAll(/^- \[ADR-(\d{4})[^\]]*\]\((ADR-[^)]+\.md)\) — \x60([^\x60]+)\x60$/gm)];
  assert.equal(registryEntries.length, candidates.length, "Le registre contient un nombre d'entrées différent des ADR présentes.");
  const indexedFiles = registryEntries.map(([, identifier, file, status]) => {
    assert.equal(file.match(/^ADR-(\d{4})-/)?.[1], identifier, "Identifiant et nom de fichier incohérents dans le registre : " + file);
    assert.ok(candidates.includes(file), "Le registre référence une ADR absente : " + file);
    assert.ok(allowedStatuses.has(status), "Statut invalide dans le registre : " + status);
    assert.equal(statusesByFile.get(file), status, "Statut du registre différent de celui de " + file);
    return file;
  });
  assert.equal(new Set(indexedFiles).size, indexedFiles.length, "Le registre référence plusieurs fois une même ADR.");
  assert.deepEqual([...indexedFiles].sort(), [...candidates].sort(), "Le registre et les ADR présentes ne correspondent pas exactement.");
});
