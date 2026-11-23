type ParametreUrl = string | string[] | undefined;

export type ContexteRetourCatalogue = {
  q: string;
  genre: string | null;
  lettre: string | null;
};

type ParametresFiche = {
  retour_q?: ParametreUrl;
  retour_genre?: ParametreUrl;
  retour_lettre?: ParametreUrl;
};

function premierParametre(value: ParametreUrl): string {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

export function creerUrlFicheDepuisCatalogue(
  slug: string,
  contexte: ContexteRetourCatalogue | null
): string {
  const url = `/prenoms/${encodeURIComponent(slug)}`;
  if (!contexte) return url;

  const parametres = new URLSearchParams();
  if (contexte.q.trim()) parametres.set("retour_q", contexte.q.trim());
  if (contexte.genre) parametres.set("retour_genre", contexte.genre);
  if (contexte.lettre) parametres.set("retour_lettre", contexte.lettre);

  const query = parametres.toString();
  return query ? `${url}?${query}` : url;
}

export function lireContexteRetourCatalogue(
  parametres: ParametresFiche
): ContexteRetourCatalogue | null {
  const q = premierParametre(parametres.retour_q);
  const genre = premierParametre(parametres.retour_genre);
  const lettre = premierParametre(parametres.retour_lettre);

  if (!q && !genre && !lettre) return null;
  return { q, genre: genre || null, lettre: lettre || null };
}

export function creerUrlRetourCatalogue(
  parametres: ParametresFiche
): string {
  const contexte = lireContexteRetourCatalogue(parametres);
  if (!contexte) return "/prenoms";

  const recherche = new URLSearchParams();
  if (contexte.q) recherche.set("q", contexte.q);
  if (contexte.genre) recherche.set("genre", contexte.genre);
  if (contexte.lettre) recherche.set("lettre", contexte.lettre);

  const query = recherche.toString();
  return query ? `/prenoms?${query}` : "/prenoms";
}
