import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const comparateur = await readFile(new URL("../components/features/comparison/NameComparator.tsx", import.meta.url), "utf8");
const fiche = await readFile(new URL("../app/prenoms/[slug]/page.tsx", import.meta.url), "utf8");

test("les cartes du comparateur transmettent la sélection à la fiche", () => {
  assert.match(comparateur, /creerUrlFicheDepuisComparateur\(name\.slug, selection\)/);
});

test("le fil d’Ariane et le retour de fiche reconnaissent le comparateur", () => {
  assert.match(fiche, /retour_prenoms\?: ParametreUrl/);
  assert.match(fiche, /returnContext\?\.vue === "comparateur" \? "Comparateur"/);
  assert.match(fiche, /Retour au comparateur/);
});
