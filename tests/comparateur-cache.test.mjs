import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const route = await readFile(new URL("../app/api/prenoms/route.ts", import.meta.url), "utf8");
const comparateur = await readFile(new URL("../components/features/comparison/NameComparator.tsx", import.meta.url), "utf8");

test("les fiches publiques du comparateur ont une durée de cache courte et explicite", () => {
  assert.match(route, /Cache-Control": "public, max-age=30, s-maxage=60, stale-while-revalidate=60"/);
});

test("le navigateur peut réutiliser une réponse de comparaison identique", () => {
  assert.doesNotMatch(comparateur, /cache:\s*"no-store"/);
  assert.match(comparateur, /fetch\(`\/api\/prenoms\?\$\{parametres\.toString\(\)\}`/);
});
