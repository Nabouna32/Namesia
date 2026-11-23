type ParametreUrl = string | string[] | undefined;

export type TriFavoris = "enregistrement" | "nom-asc" | "nom-desc";

export type ContexteRetourCatalogue = {
  vue: "catalogue";
  q: string;
  genre: string | null;
  lettre: string | null;
  limite: number;
};

export type ContexteRetourFavoris = {
  vue: "favoris";
  q: string;
  genre: string | null;
  tri: TriFavoris;
  limite: number;
};

export type ContexteRetourComparateur = {
  vue: "comparateur";
  prenoms: string[];
};

export type ContexteRetourNavigation =
  | ContexteRetourCatalogue
  | ContexteRetourFavoris
  | ContexteRetourComparateur;

type ParametresFiche = {
  retour_vue?: ParametreUrl;
  retour_q?: ParametreUrl;
  retour_genre?: ParametreUrl;
  retour_lettre?: ParametreUrl;
  retour_tri?: ParametreUrl;
  retour_limite?: ParametreUrl;
  retour_prenoms?: ParametreUrl;
};

function premierParametre(value: ParametreUrl): string {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

export function lireNombreVisible(value: ParametreUrl, maximum = Number.MAX_SAFE_INTEGER): number {
  const nombre = Number(premierParametre(value));
  const limite = Number.isSafeInteger(nombre) && nombre >= 24
    ? Math.floor(nombre / 24) * 24
    : 24;
  return Math.min(Math.max(24, maximum), limite);
}

export function creerUrlCatalogueDepuisRecherche(recherche: string): string {
  const terme = recherche.trim();
  if (!terme) return "/prenoms";
  const parametres = new URLSearchParams({ q: terme });
  return `/prenoms?${parametres.toString()}`;
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
  if (!contexte || (!contexte.q.trim() && !contexte.genre && !contexte.lettre && contexte.limite <= 24)) {
    return creerUrlFiche(slug, new URLSearchParams());
  }

  const parametres = new URLSearchParams({ retour_vue: "catalogue" });
  if (contexte.q.trim()) parametres.set("retour_q", contexte.q.trim());
  if (contexte.genre) parametres.set("retour_genre", contexte.genre);
  if (contexte.lettre) parametres.set("retour_lettre", contexte.lettre);
  if (contexte.limite > 24) parametres.set("retour_limite", String(contexte.limite));
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
  if (contexte.limite > 24) parametres.set("retour_limite", String(contexte.limite));
  return creerUrlFiche(slug, parametres);
}

export function creerUrlFicheDepuisComparateur(slug: string, prenoms: string[]): string {
  const selection = normaliserSlugsComparateur(prenoms);
  if (selection.length < 2 || !selection.includes(slug)) return creerUrlFiche(slug, new URLSearchParams());

  const parametres = new URLSearchParams({
    retour_vue: "comparateur",
    retour_prenoms: selection.join(",")
  });
  return creerUrlFiche(slug, parametres);
}

export function creerUrlFicheDepuisContexte(
  slug: string,
  contexte: ContexteRetourNavigation | null
): string {
  if (!contexte) return creerUrlFicheDepuisCatalogue(slug, null);
  if (contexte.vue === "favoris") return creerUrlFicheDepuisFavoris(slug, contexte);
  if (contexte.vue === "comparateur") return creerUrlFicheDepuisComparateur(slug, contexte.prenoms);
  return creerUrlFicheDepuisCatalogue(slug, contexte);
}

export function lireContexteRetourNavigation(
  parametres: ParametresFiche
): ContexteRetourNavigation | null {
  const vue = premierParametre(parametres.retour_vue);
  const q = premierParametre(parametres.retour_q);
  const genre = premierParametre(parametres.retour_genre);
  const limite = lireNombreVisible(parametres.retour_limite);

  if (vue === "comparateur") {
    const prenoms = normaliserSlugsComparateur(premierParametre(parametres.retour_prenoms).split(","));
    return prenoms.length >= 2 ? { vue: "comparateur", prenoms } : null;
  }

  if (vue === "favoris") {
    const tri = premierParametre(parametres.retour_tri);
    return {
      vue: "favoris",
      q,
      genre: genre || null,
      tri: tri === "nom-asc" || tri === "nom-desc" ? tri : "enregistrement",
      limite
    };
  }

  const lettre = premierParametre(parametres.retour_lettre);
  // Les anciens liens de la première version ne contenaient pas retour_vue.
  if (vue !== "catalogue" && !q && !genre && !lettre && limite <= 24) return null;
  return { vue: "catalogue", q, genre: genre || null, lettre: lettre || null, limite };
}

export function creerUrlRetourNavigation(parametres: ParametresFiche): string {
  const contexte = lireContexteRetourNavigation(parametres);
  if (!contexte) return "/prenoms";
  if (contexte.vue === "comparateur") {
    const parametres = new URLSearchParams({ prenoms: contexte.prenoms.join(",") });
    return `/comparer?${parametres.toString()}`;
  }

  const recherche = new URLSearchParams();
  if (contexte.q) recherche.set("q", contexte.q);
  if (contexte.genre) recherche.set("genre", contexte.genre);
  if (contexte.limite > 24) recherche.set("limite", String(contexte.limite));

  if (contexte.vue === "favoris") {
    if (contexte.tri !== "enregistrement") recherche.set("tri", contexte.tri);
    const query = recherche.toString();
    return query ? `/favoris?${query}` : "/favoris";
  }

  if (contexte.lettre) recherche.set("lettre", contexte.lettre);
  const query = recherche.toString();
  return query ? `/prenoms?${query}` : "/prenoms";
}
