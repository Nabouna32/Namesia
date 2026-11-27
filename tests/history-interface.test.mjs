import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const component = await readFile(new URL("../components/features/history/RecentNames.tsx", import.meta.url), "utf8");
const provider = await readFile(new URL("../components/features/history/HistoryProvider.tsx", import.meta.url), "utf8");
const recordVisit = await readFile(new URL("../components/features/history/RecordVisit.tsx", import.meta.url), "utf8");

test("chaque fiche de l’historique propose un retrait individuel accessible", () => {
  assert.match(component, /label=.*Retirer .* de l’historique/);
  assert.match(component, /onClick=\{\(\) => removeVisit\(name\.slug\)\}/);
  assert.match(component, /Icon name="close"/);
});

test("l’historique est écrit avant toute mise à jour de l’état React", () => {
  const writeIndex = provider.indexOf("window.sessionStorage.setItem(HISTORY_KEY, JSON.stringify(nextSlugs))");
  const stateIndex = provider.indexOf("setSlugs(nextSlugs)");
  const refIndex = provider.indexOf("historyRef.current = nextSlugs");
  assert.ok(writeIndex >= 0);
  assert.ok(stateIndex > writeIndex);
  assert.ok(refIndex > writeIndex);
  assert.doesNotMatch(provider, /useEffect\(\(\) => \{\s*if \(!ready\)[\s\S]*?sessionStorage\.setItem/);
});

test("un échec du stockage est exposé sans conserver un historique volatile", () => {
  assert.match(provider, /catch \{\s*setError\(true\);\s*\}/);
  assert.match(component, /L’historique est indisponible\. Réinitialisez-le pour réessayer/);
  assert.doesNotMatch(provider, /setSlugs\(\(current|setSlugs\(\(courants/);
});

test("une lecture invalide suspend les visites automatiques jusqu’à une réinitialisation explicite", () => {
  assert.match(recordVisit, /if \(ready && !error\) recordVisit\(slug\)/);
  assert.match(component, /\(slugs\.length > 0 \|\| error\)/);
  assert.match(component, /onClick=\{clearHistory\}/);
  assert.match(component, /Réinitialiser l’historique/);
});
