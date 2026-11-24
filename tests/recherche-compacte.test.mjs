"use client";

import { readFileSync } from "node:fs";
import assert from "node:assert/strict";
import test from "node:test";

const source = readFileSync(new URL("../components/NameSearch.tsx", import.meta.url), "utf8");

test("la recherche compacte dirige les résultats supplémentaires vers le catalogue", () => {
  assert.match(source, /\{compact && resultats\.length > nombreVisible && \(/);
  assert.match(source, /creerUrlCatalogueDepuisRecherche\(recherche\)/);
  assert.match(
    source,
    /\{!compact && resultats\.length > nombreVisible && \(\s*<Button[\s\S]*?Afficher les \{/,
    "la pagination par lots doit rester réservée au catalogue"
  );
});
