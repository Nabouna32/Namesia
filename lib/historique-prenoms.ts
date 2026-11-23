export const NOMBRE_MAX_HISTORIQUE = 8;

export function lireHistorique(value: string | null): string[] {
  if (!value) return [];

  const parsed: unknown = JSON.parse(value);
  if (
    !Array.isArray(parsed)
    || !parsed.every((item): item is string => typeof item === "string" && item.length > 0)
  ) {
    throw new TypeError("Le contenu de l'historique est invalide.");
  }

  return [...new Set(parsed)].slice(0, NOMBRE_MAX_HISTORIQUE);
}

export function ajouterConsultation(slugs: string[], slug: string): string[] {
  if (!slug) return slugs.slice(0, NOMBRE_MAX_HISTORIQUE);
  return [slug, ...slugs.filter((element) => element !== slug)].slice(0, NOMBRE_MAX_HISTORIQUE);
}
