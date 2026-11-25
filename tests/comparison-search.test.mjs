import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const source = await readFile(new URL("../components/features/comparison/NameComparator.tsx", import.meta.url), "utf8");

test("le comparateur réutilise les suggestions proches du moteur de recherche commun", () => {
  assert.match(source, /suggestSimilarNames\(names, searchTerm\)/);
  assert.match(source, /Aucun résultat exact pour/);
  assert.match(source, /results\.length > 0 \? results\.slice\(0, visibleCount\) : suggestions/);
  assert.match(source, /Suggestions les plus proches|prénoms les plus proches/);
});
