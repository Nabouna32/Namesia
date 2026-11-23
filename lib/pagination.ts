export const TAILLE_PAGE_PAR_DEFAUT = 500;

type ResultatPage<T> = {
  data: T[] | null;
  error: unknown;
};

export async function lireToutesLesPages<T>(
  chargerPage: (debut: number, fin: number) => Promise<ResultatPage<T>>,
  taillePage = TAILLE_PAGE_PAR_DEFAUT
): Promise<T[]> {
  if (!Number.isSafeInteger(taillePage) || taillePage < 1) {
    throw new RangeError("La taille de page doit être un entier strictement positif.");
  }

  const lignes: T[] = [];

  for (let debut = 0; ; debut += taillePage) {
    const { data, error } = await chargerPage(debut, debut + taillePage - 1);
    if (error) throw error;
    if (data === null) throw new Error("La page Supabase ne contient aucune donnée exploitable.");

    lignes.push(...data);
    if (data.length < taillePage) return lignes;
  }
}
