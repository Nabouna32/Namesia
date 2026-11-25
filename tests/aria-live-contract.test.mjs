import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const snackbar = await readFile(new URL("../components/material3/Snackbar.tsx", import.meta.url), "utf8");
const favorites = await readFile(new URL("../components/features/favorites/FavoritesList.tsx", import.meta.url), "utf8");
const comparator = await readFile(new URL("../components/features/comparison/NameComparator.tsx", import.meta.url), "utf8");
const discovery = await readFile(new URL("../components/features/discovery/RandomDiscovery.tsx", import.meta.url), "utf8");

test("Snackbar s’appuie sur les annonces implicites des rôles status et alert", () => {
  assert.match(snackbar, /role={urgent \? "alert" : "status"}/);
  assert.doesNotMatch(snackbar, /aria-live=/);
});

test("les compteurs conservent status sans redéclarer aria-live", () => {
  assert.match(favorites, /className={styles\.count} role="status"/);
  assert.match(comparator, /<span role="status">/);
  assert.doesNotMatch(favorites, /role="status"[^>]*aria-live=/);
  assert.doesNotMatch(comparator, /role="status"[^>]*aria-live=/);
});

test("la région dynamique sans rôle conserve son annonce explicite", () => {
  assert.match(discovery, /aria-live="polite" aria-atomic="true"/);
});
