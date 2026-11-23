type ParametreUrl = string | string[] | undefined;

export type TriFavoris = "enregistrement" | "nom-asc" | "nom-desc";

export type ContexteRetourCatalogue = {
  vue: "catalogue";
  q: string;
  genre: string | null;
  lettre: string | null;
};

export type ContexteRetourFavoris = {
  vue: "favoris";
  q: string;
  genre: string | null;
  tri: TriFavoris;
};

export type ContexteRetourNavigation =
  | ContexteRetourCatalogue
  | ContexteRetourFavoris;

type ParametresFiche = {
  retour_vue?: ParametreUrl;
  retour_q?: ParametreUrl;
  retour_genre?: ParametreUrl;
  retour_lettre?: ParametreUrl;
  retour_tri?: ParametreUrl;
};

function premierParametre(value: ParametreUrl): string {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function creerUrlFiche(slug: string, parametres: URLSearchParams): string {
  const url = `/prenoms/${encodeURIComponent(slug)}`;
  const query = parametres.toString();
  return query ? `${url}?${query}` : url;
}

export function creerUrlFicheDepuisCatalogue(
  slug: string,
  contexte: Omit<ContexteRetourCatalogue, "vue"> | null
): string {
  if (!contexte || (!contexte.q.trim() && !contexte.genre && !contexte.lettre)) {
    return creerUrlFiche(slug, new URLSearchParams());
  }

  const parametres = new URLSearchParams({ retour_vue: "catalogue" });
  if (contexte.q.trim()) parametres.set("retour_q", contexte.q.trim());
  if (contexte.genre) parametres.set("retour_genre", contexte.genre);
  if (contexte.lettre) parametres.set("retour_lettre", contexte.lettre);
  return creerUrlFiche(slug, parametres);
}

export function creerUrlFicheDepuisFavoris(
  slug: string,
  contexte: Omit<ContexteRetourFavoris, "vue">
): string {
  const parametres = new URLSearchParams({ retour_vue: "favoris" });
  if (contexte.q.trim()) parametres.set("retour_q", contexte.q.trim());
  if (contexte.genre) parametres.set("retour_genre", contexte.genre);
  if (contexte.tri !== "enregistrement") parametres.set("retour_tri", contexte.tri);
  return creerUrlFiche(slug, parametres);
}

export function creerUrlFicheDepuisContexte(
  slug: string,
  contexte: ContexteRetourNavigation | null
): string {
  if (!contexte) return creerUrlFicheDepuisCatalogue(slug, null);
  if (contexte.vue === "favoris") return creerUrlFicheDepuisFavoris(slug, contexte);
  return creerUrlFicheDepuisCatalogue(slug, contexte);
}

export function lireContexteRetourNavigation(
  parametres: ParametresFiche
): ContexteRetourNavigation | null {
  const vue = premierParametre(parametres.retour_vue);
  const q = premierParametre(parametres.retour_q);
  const genre = premierParametre(parametres.retour_genre);

  if (vue === "favoris") {
    const tri = premierParametre(parametres.retour_tri);
    return {
      vue: "favoris",
      q,
      genre: genre || null,
      tri: tri === "nom-asc" || tri === "nom-desc" ? tri : "enregistrement"
    };
  }

  const lettre = premierParametre(parametres.retour_lettre);
  // Les anciens liens de la première version ne contenaient pas retour_vue.
  if (vue !== "catalogue" && !q && !genre && !lettre) return null;
  return { vue: "catalogue", q, genre: genre || null, lettre: lettre || null };
}

export function creerUrlRetourNavigation(parametres: ParametresFiche): string {
  const contexte = lireContexteRetourNavigation(parametres);
  if (!contexte) return "/prenoms";

  const recherche = new URLSearchParams();
  if (contexte.q) recherche.set("q", contexte.q);
  if (contexte.genre) recherche.set("genre", contexte.genre);

  if (contexte.vue === "favoris") {
    if (contexte.tri !== "enregistrement") recherche.set("tri", contexte.tri);
    const query = recherche.toString();
    return query ? `/favoris?${query}` : "/favoris";
  }

  if (contexte.lettre) recherche.set("lettre", contexte.lettre);
  const query = recherche.toString();
  return query ? `/prenoms?${query}` : "/prenoms";
}
