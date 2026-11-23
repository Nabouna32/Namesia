export const TAILLE_ECHANTILLON_SUGGESTIONS = 64;

function hashStable(value: string): number {
  let hash = 2166136261;

  for (const caractere of value) {
    hash ^= caractere.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

export function calculerFenetreSuggestions(
  slug: string,
  nombreCandidats: number
): { debut: number; taille: number } {
  if (!slug.trim()) throw new TypeError("Le slug de la fiche est obligatoire.");
  if (!Number.isSafeInteger(nombreCandidats) || nombreCandidats < 0) {
    throw new RangeError("Le nombre de candidats doit être un entier positif ou nul.");
  }

  const taille = Math.min(nombreCandidats, TAILLE_ECHANTILLON_SUGGESTIONS);
  const dernierDepart = nombreCandidats - taille;
  const debut = dernierDepart === 0 ? 0 : hashStable(slug) % (dernierDepart + 1);

  return { debut, taille };
}
