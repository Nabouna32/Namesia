export const NOMBRE_MAX_HISTORIQUE = 8;

export function ajouterConsultation(slugs: string[], slug: string): string[] {
  if (!slug) return slugs;
  return [slug, ...slugs.filter((element) => element !== slug)].slice(0, NOMBRE_MAX_HISTORIQUE);
}
