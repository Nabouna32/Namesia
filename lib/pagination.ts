export const TAILLE_PAGE_PAR_DEFAUT = 500;

type ResultatPage<T> = {
  data: T[] | null;
  error: unknown;
  count?: number | null;
};

export async function lireToutesLesPages<T>(
  chargerPage: (debut: number, fin: number, compter: boolean) => Promise<ResultatPage<T>>,
  taillePage = TAILLE_PAGE_PAR_DEFAUT
): Promise<T[]> {
  if (!Number.isSafeInteger(taillePage) || taillePage < 1) {
    throw new RangeError("La taille de page doit être un entier strictement positif.");
  }

  const lignes: T[] = [];
  let total: number | null = null;
  let debut = 0;

  while (true) {
    const { data, error, count } = await chargerPage(debut, debut + taillePage - 1, debut === 0);
    if (error) throw error;
    if (data === null) throw new Error("La page Supabase ne contient aucune donnée exploitable.");
    if (debut === 0 && count !== undefined && count !== null) {
      if (!Number.isSafeInteger(count) || count < 0) {
        throw new Error("Le nombre total de lignes retourné par Supabase est invalide.");
      }
      total = count;
    }

    if (data.length === 0 && total !== null && debut < total) {
      throw new Error("La pagination Supabase n’a pas progressé avant la fin du catalogue.");
    }

    lignes.push(...data);
    debut += data.length;

    if (total !== null ? debut >= total : data.length < taillePage) return lignes;
  }
}
