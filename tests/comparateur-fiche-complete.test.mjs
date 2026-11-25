import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const source = await readFile(new URL("../components/features/comparison/NameComparator.tsx", import.meta.url), "utf8");
const styles = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");

test("chaque carte comparée donne accès à la fiche complète du prénom correspondant", () => {
  assert.ok(source.includes('import Link from "next/link"'));
  assert.ok(source.includes('import { creerUrlFicheDepuisComparateur } from "@/lib/navigation-prenoms"'));
  assert.ok(source.includes("href={creerUrlFicheDepuisComparateur(prenom.slug, selection)}"));
  assert.ok(source.includes("aria-label={`Lire la fiche complète de ${prenom.name}`}"));
  assert.ok(source.includes("Voir la fiche complète"));
});

test("le lien vers la fiche conserve une cible tactile et les tokens Fidelity", () => {
  assert.ok(styles.includes(".compare-profile-link,\n.compare-card-link {"));
  assert.ok(styles.includes("min-height: 48px"));
  assert.ok(styles.includes("color: var(--md-sys-color-primary)"));
  assert.ok(styles.includes("text-decoration: underline"));
});
