export const NOMBRE_MAX_HISTORIQUE = 8;

export function ajouterConsultation(slugs: string[], slug: string): string[] {
  if (!slug) return slugs;
  return [slug, ...slugs.filter((element) => element !== slug)].slice(0, NOMBRE_MAX_HISTORIQUE);
}

export function lireHistoriqueSession(value: string | null): string[] {
  if (value === null) return [];
  const contenu: unknown = JSON.parse(value);
  if (!Array.isArray(contenu) || !contenu.every(
    (slug): slug is string => typeof slug === "string" && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)
  )) {
    throw new TypeError("Le contenu de l’historique est invalide.");
  }
  return [...new Set(contenu)].slice(0, NOMBRE_MAX_HISTORIQUE);
}
