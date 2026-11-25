import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const component = await readFile(new URL("../components/material3/TextField.tsx", import.meta.url), "utf8");
const styles = await readFile(new URL("../components/material3/TextField.module.css", import.meta.url), "utf8");
const admin = await readFile(new URL("../app/admin/admin-client.tsx", import.meta.url), "utf8");

test("le TextField applique un état structurel dédié aux champs multilignes", () => {
  assert.match(component, /multiline \? styles\.multiline : ""/);
  assert.match(component, /multiline\s*\? <textarea/);
});

test("le label d’un champ multiligne reste aligné en haut avant saisie", () => {
  assert.match(styles, /\.multiline \.label\s*\{\s*top:\s*8px;\s*transform:\s*none;/);
});

test("l’éditeur JSON administrateur utilise la primitive TextField multiligne", () => {
  assert.match(admin, /<TextField[^>]*multiline rows=\{18\}/);
  assert.doesNotMatch(admin, /<textarea/);
});
