import test from "node:test";
import assert from "node:assert/strict";
import { readdir, readFile, stat } from "node:fs/promises";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const rootReadme = await readFile(join(root, "README.md"), "utf8");
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
  .map((path) => relative(root, path).replaceAll("\\", "/"))
  .sort();
const canonicalFiles = documentationFiles.filter((path) => !/^docs\/decisions\/ADR-\d{4}-/.test(path));
const adrFiles = documentationFiles.filter((path) => /^docs\/decisions\/ADR-\d{4}-/.test(path));

test("le README racine indexe chaque document canonique", () => {
  for (const path of canonicalFiles) {
    assert.ok(rootReadme.includes(path), "Document absent de l'index racine : " + path);
  }
});

test("l'index des décisions référence chaque ADR du dépôt", () => {
  for (const path of adrFiles) {
    const filename = path.slice(path.lastIndexOf("/") + 1);
    assert.ok(adrReadme.includes(filename), "ADR absent du registre : " + filename);
  }
});

test("tous les liens Markdown locaux du dépôt pointent vers une cible existante", async () => {
  const sources = ["README.md", "AGENTS.md", ...documentationFiles.map((path) => path)];
  for (const source of sources) {
    const content = await readFile(join(root, source), "utf8");
    for (const [, href] of content.matchAll(/\]\(([^)]+)\)/g)) {
      if (/^(?:https?:|mailto:|#)/i.test(href)) continue;
      const target = decodeURIComponent(href.split(/[?#]/, 1)[0]);
      if (!target) continue;
      const absolute = resolve(root, dirname(source), target);
      await assert.doesNotReject(
        stat(absolute),
        source + " contient un lien local cassé : " + href
      );
    }
  }
});
