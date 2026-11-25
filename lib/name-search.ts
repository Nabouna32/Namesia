import type { NameIndexEntry } from "@/lib/names";

export function normalizeSearchTerm(value: string): string {
  const normalized = value.trim()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLocaleLowerCase("fr")
    .replace(/œ/g, "oe")
    .replace(/æ/g, "ae")
    .replace(/(?<=[\p{L}\p{N}])[\s\p{P}\p{Z}]+(?=[\p{L}\p{N}])/gu, "");

  // Un séparateur tapé après un préfixe ne doit pas bloquer l'autocomplétion.
  // Un terme composé uniquement de ponctuation reste toutefois une recherche distincte.
  return /[\p{L}\p{N}]/u.test(normalized)
    ? normalized.replace(/^[\s\p{P}\p{Z}]+|[\s\p{P}\p{Z}]+$/gu, "")
    : normalized;
}

export function compareRelevance(a: NameIndexEntry, b: NameIndexEntry, term: string): number {
  if (!term) return a.name.localeCompare(b.name, "fr");
  const nameA = normalizeSearchTerm(a.name);
  const nameB = normalizeSearchTerm(b.name);
  const positionA = nameA.indexOf(term);
  const positionB = nameB.indexOf(term);
  const rankA = nameA === term ? 0 : positionA === 0 ? 1 : 2;
  const rankB = nameB === term ? 0 : positionB === 0 ? 1 : 2;

  return rankA - rankB
    || (rankA === 2 ? positionA - positionB : 0)
    || a.name.localeCompare(b.name, "fr");
}

export function boundedEditDistance(left: string, right: string, limit: number): number {
  if (!Number.isSafeInteger(limit) || limit < 0) {
    throw new RangeError("La limite de distance doit être un entier positif ou nul.");
  }

  const leftCharacters = Array.from(left);
  const rightCharacters = Array.from(right);
  const leftLength = leftCharacters.length;
  const rightLength = rightCharacters.length;

  if (Math.abs(leftLength - rightLength) > limit) return limit + 1;
  if (leftLength === 0) return Math.min(rightLength, limit + 1);
  if (rightLength === 0) return Math.min(leftLength, limit + 1);

  let previousRow = new Map<number, number>();
  for (let index = 0; index <= Math.min(rightLength, limit); index += 1) {
    previousRow.set(index, index);
  }

  for (let i = 1; i <= leftLength; i += 1) {
    const start = Math.max(1, i - limit);
    const end = Math.min(rightLength, i + limit);
    const currentRow = new Map<number, number>();
    if (i <= limit) currentRow.set(0, i);

    let minimumDistance = i <= limit ? i : limit + 1;
    for (let j = start; j <= end; j += 1) {
      const deletion = (previousRow.get(j) ?? limit + 1) + 1;
      const insertion = (currentRow.get(j - 1) ?? limit + 1) + 1;
      const substitution = (previousRow.get(j - 1) ?? limit + 1)
        + (leftCharacters[i - 1] === rightCharacters[j - 1] ? 0 : 1);
      const distance = Math.min(deletion, insertion, substitution);
      currentRow.set(j, distance);
      minimumDistance = Math.min(minimumDistance, distance);
    }

    if (minimumDistance > limit) return limit + 1;
    previousRow = currentRow;
  }

  return Math.min(previousRow.get(rightLength) ?? limit + 1, limit + 1);
}

/**
 * Retourne jusqu'à cinq prénoms proches d'une recherche sans correspondance.
 * Les candidats doivent déjà respecter les filtres actifs de l'écran appelant.
 */
export function suggestSimilarNames(names: NameIndexEntry[], searchTerm: string): NameIndexEntry[] {
  const term = normalizeSearchTerm(searchTerm);
  if (term.length < 4) return [];

  if (names.some((name) => normalizeSearchTerm(name.name) === term)) return [];

  const limit = term.length >= 8 ? 2 : 1;
  return names
    .flatMap((name) => {
      const normalizedName = normalizeSearchTerm(name.name);
      if (normalizedName.includes(term)) return [];
      const distance = boundedEditDistance(term, normalizedName, limit);
      return distance <= limit ? [{ name, distance }] : [];
    })
    .sort((a, b) => a.distance - b.distance || a.name.name.localeCompare(b.name.name, "fr"))
    .slice(0, 5)
    .map(({ name }) => name);
}
