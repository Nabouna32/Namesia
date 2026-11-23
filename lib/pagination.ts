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
  let total = 0;
  let debut = 0;

  while (true) {
    const { data, error, count } = await chargerPage(debut, debut + taillePage - 1, debut === 0);
    if (error) throw error;
    if (data === null) throw new Error("La page Supabase ne contient aucune donnée exploitable.");

    if (debut === 0) {
      if (count === undefined || count === null) {
        throw new Error("Le compte exact du catalogue n’a pas été retourné par Supabase.");
      }
      if (!Number.isSafeInteger(count) || count < 0) {
        throw new Error("Le nombre total de lignes retourné par Supabase est invalide.");
      }
      total = count;
      if (data.length > total) {
        throw new Error("La première page contient plus de lignes que le compte exact Supabase.");
      }
    }

    if (data.length === 0 && debut < total) {
      throw new Error("La pagination Supabase n’a pas progressé avant la fin du catalogue.");
    }
    if (debut + data.length > total) {
      throw new Error("Les pages Supabase dépassent le compte exact du catalogue.");
    }

    lignes.push(...data);
    debut += data.length;

    if (debut >= total) return lignes;
  }
}
