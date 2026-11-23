import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const source = await readFile(new URL("../components/comparateur-prenoms.tsx", import.meta.url), "utf8");

test("le comparateur réutilise les suggestions proches du moteur de recherche commun", () => {
  assert.match(source, /suggererPrenomsProches\(prenoms, recherche\)/);
  assert.match(source, /Aucun résultat exact pour/);
  assert.match(source, /resultats\.length > 0 \? resultats\.slice\(0, nombreVisible\) : suggestions/);
  assert.match(source, /Suggestions les plus proches|prénoms les plus proches/);
});
