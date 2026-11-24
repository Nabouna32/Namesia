import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const component = await readFile(new URL("../components/features/comparison/NameComparator.tsx", import.meta.url), "utf8");
const styles = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");

test("la comparaison aligne les prénoms en colonnes et les critères en lignes dans un tableau natif", () => {
  assert.match(component, /<table className="compare-table">/);
  assert.match(component, /<caption className="sr-only">/);
  assert.match(component, /<th scope="col"/);
  assert.match(component, /<th scope="row">Introduction<\/th>/);
  assert.match(component, /<th scope="row">Origine & signification<\/th>/);
  assert.match(component, /<th scope="row">Associations symboliques<\/th>/);
  assert.doesNotMatch(component, /className="compare-grid"/);
  assert.doesNotMatch(component, /components\/material3\/Card/);
});

test("le tableau reste consultable au clavier et horizontalement sur petit écran", () => {
  assert.match(component, /className="compare-table-scroll"[\s\S]*?tabIndex=\{0\}/);
  assert.match(styles, /\.compare-table-scroll\s*\{[^}]*overflow-x:\s*auto/s);
  assert.match(styles, /\.compare-table tbody th\[scope="row"\]\s*\{[^}]*position:\s*sticky;[^}]*left:\s*0;/s);
  assert.match(styles, /\.compare-table\s*\{[^}]*min-width:\s*700px;/s);
  assert.match(styles, /\\[tabindex="0"\\]:focus-visible/);
  assert.doesNotMatch(styles, /\\.compare-table-scroll:focus-visible/);
});
