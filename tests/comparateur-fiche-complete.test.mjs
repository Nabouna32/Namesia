import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const source = await readFile(new URL("../components/features/comparison/NameComparator.tsx", import.meta.url), "utf8");
const styles = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");

test("chaque carte comparée donne accès à la fiche complète du prénom correspondant", () => {
  assert.match(source, /import Link from "next\/link"/);
  assert.match(source, /import \{ creerUrlFicheDepuisComparateur \} from "@\/lib\/navigation-prenoms"/);
  assert.match(source, /href=\{creerUrlFicheDepuisComparateur\(prenom\.slug, selection\)\}/);
  assert.match(source, /aria-label=\{`Lire la fiche complète de \$\{prenom\.nom\}`\}/);
  assert.match(source, /Voir la fiche complète/);
});

test("le lien vers la fiche conserve une cible tactile et les tokens Fidelity", () => {
  assert.match(styles, /\.compare-card-link\s*\{[^}]*min-height:\s*48px/s);
  assert.match(styles, /\.compare-card-link\s*\{[^}]*color:\s*var\(--md-sys-color-primary\)/s);
  assert.match(styles, /\.compare-card-link\s*\{[^}]*text-decoration:\s*underline/s);
});
