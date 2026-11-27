import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const provider = await readFile(new URL("../components/features/history/HistoryProvider.tsx", import.meta.url), "utf8");
const component = await readFile(new URL("../components/features/history/RecentNames.tsx", import.meta.url), "utf8");
const recordVisit = await readFile(new URL("../components/features/history/RecordVisit.tsx", import.meta.url), "utf8");

test("aucun historique local n'est lu, écrit ou supprimé", () => {
  for (const source of [provider, component, recordVisit]) {
    assert.doesNotMatch(source, /localStorage|sessionStorage/);
  }
});

test("l'historique reste inactif tant que son activation liée au compte n'est pas arbitrée", () => {
  assert.match(provider, /slugs: \[\]/);
  assert.match(provider, /recordVisit: \(\) => undefined/);
  assert.match(component, /arbitrage #405/);
  assert.match(recordVisit, /return null/);
});
