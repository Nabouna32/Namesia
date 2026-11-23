import type { PrenomIndex } from "@/lib/prenoms";

export function normaliserRecherche(value: string): string {
  return value.trim()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLocaleLowerCase("fr")
    .replace(/œ/g, "oe")
    .replace(/æ/g, "ae")
    .replace(/(?<=[\p{L}\p{N}])[\s\p{P}\p{Z}]+(?=[\p{L}\p{N}])/gu, "");
}

export function comparerPertinence(a: PrenomIndex, b: PrenomIndex, terme: string): number {
  if (!terme) return a.nom.localeCompare(b.nom, "fr");
  const nomA = normaliserRecherche(a.nom);
  const nomB = normaliserRecherche(b.nom);
  const positionA = nomA.indexOf(terme);
  const positionB = nomB.indexOf(terme);
  const rangA = nomA === terme ? 0 : positionA === 0 ? 1 : 2;
  const rangB = nomB === terme ? 0 : positionB === 0 ? 1 : 2;

  return rangA - rangB
    || (rangA === 2 ? positionA - positionB : 0)
    || a.nom.localeCompare(b.nom, "fr");
}
