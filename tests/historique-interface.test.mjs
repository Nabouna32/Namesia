import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const component = await readFile(new URL("../components/features/history/RecentNames.tsx", import.meta.url), "utf8");
const provider = await readFile(new URL("../components/features/history/HistoryProvider.tsx", import.meta.url), "utf8");

test("chaque fiche de l’historique propose un retrait individuel accessible", () => {
  assert.match(component, /label=.*Retirer .* de l’historique/);
  assert.match(component, /onClick=\{\(\) => retirer\(prenom\.slug\)\}/);
  assert.match(component, /Icon name="close"/);
});

test("le retrait individuel passe par le fournisseur et persiste dans sessionStorage", () => {
  assert.match(provider, /retirerConsultation\(courants, slug\)/);
  assert.match(provider, /sessionStorage\.setItem\(CLE_HISTORIQUE, JSON\.stringify\(slugs\)\)/);
});
