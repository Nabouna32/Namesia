import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const component = await readFile(new URL("../components/features/catalog/NameSearch.tsx", import.meta.url), "utf8");
const styles = await readFile(new URL("../components/features/catalog/NameSearch.module.css", import.meta.url), "utf8");

test("le catalogue copie tous les résultats filtrés, pas uniquement les cartes visibles", () => {
  assert.ok(component.includes("resultats.map((prenom) => prenom.name).join"));
  assert.ok(component.includes('"Copier le prénom"'));
  assert.ok(component.includes("Copier les ${resultats.length} prénoms"));
  assert.ok(component.includes('Snackbar severity="success"'));
  assert.ok(component.includes('Snackbar severity="error"'));
});

test("la copie est réservée au catalogue complet et son action reste responsive", () => {
  assert.ok(component.includes("!compact && resultats.length > 0"));
  assert.ok(styles.includes(".resultActions"));
  assert.ok(styles.includes("flex-wrap: wrap"));
});
