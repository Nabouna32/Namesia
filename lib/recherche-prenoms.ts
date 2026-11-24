import type { PrenomIndex } from "@/lib/prenoms";

export function normaliserRecherche(value: string): string {
  const normalisee = value.trim()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLocaleLowerCase("fr")
    .replace(/œ/g, "oe")
    .replace(/æ/g, "ae")
    .replace(/(?<=[\p{L}\p{N}])[\s\p{P}\p{Z}]+(?=[\p{L}\p{N}])/gu, "");

  // Un séparateur tapé après un préfixe ne doit pas bloquer l'autocomplétion.
  // Un terme composé uniquement de ponctuation reste toutefois une recherche distincte.
  return /[\p{L}\p{N}]/u.test(normalisee)
    ? normalisee.replace(/^[\s\p{P}\p{Z}]+|[\s\p{P}\p{Z}]+$/gu, "")
    : normalisee;
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

export function distanceEditionBornee(a: string, b: string, limite: number): number {
  if (!Number.isSafeInteger(limite) || limite < 0) {
    throw new RangeError("La limite de distance doit être un entier positif ou nul.");
  }

  const caracteresA = Array.from(a);
  const caracteresB = Array.from(b);
  const longueurA = caracteresA.length;
  const longueurB = caracteresB.length;

  if (Math.abs(longueurA - longueurB) > limite) return limite + 1;
  if (longueurA === 0) return Math.min(longueurB, limite + 1);
  if (longueurB === 0) return Math.min(longueurA, limite + 1);

  let precedent = new Map<number, number>();
  for (let index = 0; index <= Math.min(longueurB, limite); index += 1) {
    precedent.set(index, index);
  }

  for (let i = 1; i <= longueurA; i += 1) {
    const debut = Math.max(1, i - limite);
    const fin = Math.min(longueurB, i + limite);
    const courant = new Map<number, number>();
    if (i <= limite) courant.set(0, i);

    let minimum = i <= limite ? i : limite + 1;
    for (let j = debut; j <= fin; j += 1) {
      const suppression = (precedent.get(j) ?? limite + 1) + 1;
      const insertion = (courant.get(j - 1) ?? limite + 1) + 1;
      const substitution = (precedent.get(j - 1) ?? limite + 1)
        + (caracteresA[i - 1] === caracteresB[j - 1] ? 0 : 1);
      const distance = Math.min(suppression, insertion, substitution);
      courant.set(j, distance);
      minimum = Math.min(minimum, distance);
    }

    if (minimum > limite) return limite + 1;
    precedent = courant;
  }

  return Math.min(precedent.get(longueurB) ?? limite + 1, limite + 1);
}

/**
 * Retourne jusqu'à cinq prénoms proches d'une recherche sans correspondance.
 * Les candidats doivent déjà respecter les filtres actifs de l'écran appelant.
 */
export function suggererPrenomsProches(prenoms: PrenomIndex[], recherche: string): PrenomIndex[] {
  const terme = normaliserRecherche(recherche);
  if (terme.length < 4) return [];

  const limite = terme.length >= 8 ? 2 : 1;
  return prenoms
    .flatMap((prenom) => {
      const nom = normaliserRecherche(prenom.nom);
      if (nom.includes(terme)) return [];
      const distance = distanceEditionBornee(terme, nom, limite);
      return distance <= limite ? [{ prenom, distance }] : [];
    })
    .sort((a, b) => a.distance - b.distance || a.prenom.nom.localeCompare(b.prenom.nom, "fr"))
    .slice(0, 5)
    .map(({ prenom }) => prenom);
}
