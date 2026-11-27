import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const globalCss = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");

test("le pied de page reste après le contenu sur les pages courtes", () => {
  assert.match(globalCss, /\.app-shell\s*\{[^}]*min-height:\s*100svh/s);
  assert.match(globalCss, /\.app-content\s*\{[^}]*flex:\s*1/s);
  assert.match(globalCss, /\.site-footer\s*\{[^}]*margin-top:\s*auto/s);
});

test("les noms longs peuvent revenir à la ligne sans être tronqués", () => {
  assert.match(globalCss, /\.name-card strong\s*\{[^}]*overflow-wrap:\s*anywhere/s);
  assert.match(globalCss, /\.featured-name\s*\{[^}]*min-width:\s*0/s);
  assert.match(globalCss, /\.featured-bottom strong\s*\{[^}]*overflow-wrap:\s*anywhere/s);
  assert.doesNotMatch(globalCss, /\.featured-card\s*\{[^}]*\n\s*height:\s*210px/s);
});

test("les règles responsive couvrent les trois classes de largeur", () => {
  assert.match(globalCss, /@media\s*\(max-width:\s*599px\)/);
  assert.match(globalCss, /@media\s*\(min-width:\s*600px\)\s*and\s*\(max-width:\s*839px\)/);
  assert.match(globalCss, /@media\s*\(min-width:\s*840px\)/);
});
