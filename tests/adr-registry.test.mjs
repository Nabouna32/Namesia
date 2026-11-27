import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import { test } from "node:test";

test("les identifiants ADR sont uniques, leurs liens valides et le registre exhaustif", async () => {
  const directory = new URL("../docs/decisions/", import.meta.url);
  const files = (await readdir(directory))
    .filter((file) => /^ADR-\d{4}-.+\.md$/.test(file))
    .sort();
  const fileSet = new Set(files);
  const identifiers = files.map((file) => file.match(/^ADR-(\d{4})-/)[1]);
  const registry = await readFile(new URL("README.md", directory), "utf8");
  const indexedFiles = [...registry.matchAll(/\]\((ADR-\d{4}-[^)#]+\.md)(?:#[^)]*)?\)/g)]
    .map(([, file]) => file);

  assert.equal(new Set(identifiers).size, files.length, "Deux ADR partagent le même identifiant.");
  assert.equal(new Set(indexedFiles).size, indexedFiles.length, "Une ADR apparaît plusieurs fois dans le registre.");
  assert.deepEqual(
    [...indexedFiles].sort(),
    files,
    "Le registre doit référencer chaque ADR du dossier, sans oubli ni entrée absente.",
  );

  for (const file of files) {
    const [, identifier] = file.match(/^ADR-(\d{4})-/);
    const content = await readFile(new URL(file, directory), "utf8");

    assert.ok(content.startsWith("# ADR-" + identifier), file + " doit déclarer son identifiant.");

    for (const [, target] of content.matchAll(/\]\((?:\.\/)?(ADR-\d{4}-[^)#]+\.md)(?:#[^)]*)?\)/g)) {
      assert.ok(fileSet.has(target), file + " référence un ADR absent : " + target);
    }
  }
});
