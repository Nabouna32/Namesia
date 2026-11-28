import test from "node:test";
import assert from "node:assert/strict";
import { readdir, readFile, stat } from "node:fs/promises";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const rootReadme = await readFile(join(root, "README.md"), "utf8");
const agents = await readFile(join(root, "AGENTS.md"), "utf8");
const adrReadme = await readFile(join(root, "docs/decisions/README.md"), "utf8");

async function collectMarkdown(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue;
    const absolute = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await collectMarkdown(absolute));
    else if (entry.name.endsWith(".md")) files.push(absolute);
  }
  return files;
}

const documentationFiles = (await collectMarkdown(join(root, "docs")))
  .map((path) => relative(root, path))
  .sort();
const maintainedFiles = ["README.md", "AGENTS.md", ...documentationFiles];
const canonicalFiles = documentationFiles.filter((path) => !/^docs\/decisions\/ADR-\d{4}-/.test(path));
const adrFiles = documentationFiles.filter((path) => /^docs\/decisions\/ADR-\d{4}-/.test(path));

test("tous les documents Markdown maintenus portent une version et une date de mise à jour valides", async () => {
  for (const source of maintainedFiles) {
    const content = await readFile(join(root, source), "utf8");
    const versions = [...content.matchAll(/^- \*\*Version :\*\* (.+)$/gm)];
    const updates = [...content.matchAll(/^- \*\*Mis à jour le :\*\* (.+)$/gm)];
    assert.equal(versions.length, 1, source + " doit déclarer une seule version.");
    assert.match(versions[0][1], /^\d+(?:\.\d+)*$/, source + " possède une version invalide.");
    assert.equal(updates.length, 1, source + " doit déclarer une seule date de mise à jour.");
    assert.match(updates[0][1], /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2} \(Europe\/Paris\)$/, source + " possède une date de mise à jour invalide.");
  }
});

test("les noms descriptifs Markdown sont en majuscules et en kebab-case", () => {
  for (const source of documentationFiles) {
    const filename = source.slice(source.lastIndexOf("/") + 1);
    if (filename === "README.md") continue;
    assert.match(filename, /^[A-Z0-9]+(?:-[A-Z0-9]+)*\.md$/, "Nom de document non conforme : " + source);
  }
});

test("le README racine indexe chaque document canonique", () => {
  for (const path of canonicalFiles) {
    assert.ok(rootReadme.includes(path), "Document absent de l'index racine : " + path);
  }
  assert.ok(rootReadme.includes("docs/decisions/ADR-MAINTENANCE.md"), "La politique ADR doit être indexée dans le README racine.");
  assert.ok(agents.includes("docs/decisions/ADR-MAINTENANCE.md"), "AGENTS.md doit référencer la politique ADR.");
  assert.ok(adrReadme.includes("ADR-MAINTENANCE.md"), "Le registre doit référencer la politique ADR.");
});

test("l'index des décisions référence chaque ADR du dépôt", () => {
  for (const path of adrFiles) {
    const filename = path.slice(path.lastIndexOf("/") + 1);
    assert.ok(adrReadme.includes(filename), "ADR absente du registre : " + filename);
  }
});

test("tous les liens Markdown locaux du dépôt pointent vers une cible existante", async () => {
  for (const source of maintainedFiles) {
    const content = await readFile(join(root, source), "utf8");
    for (const [, href] of content.matchAll(/\]\(([^)]+)\)/g)) {
      if (/^(?:https?:|mailto:|#)/i.test(href)) continue;
      const target = decodeURIComponent(href.split(/[?#]/, 1)[0]);
      if (!target) continue;
      const absolute = resolve(root, dirname(source), target);
      await assert.doesNotReject(
        () => stat(absolute),
        source + " contient un lien local cassé : " + href
      );
    }
  }
});
