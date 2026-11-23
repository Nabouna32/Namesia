import { cache } from "react";
import { parseContenuFiche, type AssociationSymbolique, type ContenuFichePrenom } from "@/lib/fiche-prenom";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type Prenom = {
  id: string;
  slug: string;
  nom: string;
  lettre: string;
  genre: string;
} & ContenuFichePrenom;

export type PrenomIndex = Pick<Prenom, "id" | "slug" | "nom" | "lettre" | "genre">;

type JoinedAssociation = AssociationSymbolique & { position: number };

type JoinedProfile = {
  introduction: string;
  origin_text: string | null;
  history_text: string | null;
  usage_text: string | null;
  name_profile_associations: JoinedAssociation[];
};

const libellesGenres: Record<string, string> = {
  feminin: "Féminin",
  masculin: "Masculin",
  mixte: "Mixte",
  inconnu: "Genre non renseigné"
};

type JoinedName = {
  id: string;
  slug: string;
  display_name: string;
  gender: string;
  name_profiles: JoinedProfile[];
};

const selection = `
  id, slug, display_name, gender,
  name_profiles!inner (
    introduction, origin_text, history_text, usage_text,
    name_profile_associations ( category, value, context_note, position )
  )
`;

function obtenirInitiale(displayName: string): string {
  const initiale = Array.from(displayName.trim())[0];
  if (!initiale) throw new Error("Un prénom publié ne peut pas avoir un nom vide.");
  return initiale.toLocaleUpperCase("fr");
}

function obtenirLibelleGenre(genre: string): string {
  const libelle = libellesGenres[genre];
  if (!libelle) throw new Error(`Genre de prénom non pris en charge : "${genre}".`);
  return libelle;
}

function convertir(row: JoinedName): Prenom {
  const profiles = row.name_profiles;
  if (profiles.length !== 1) {
    throw new Error(`Le prénom "${row.slug}" doit avoir exactement une version publiée.`);
  }

  const [profile] = profiles;
  const content = {
    introduction: profile.introduction,
    ...(profile.origin_text ? { origin: profile.origin_text } : {}),
    ...(profile.history_text ? { history: profile.history_text } : {}),
    ...(profile.usage_text ? { usage: profile.usage_text } : {}),
    symbolic_associations: [...profile.name_profile_associations]
      .sort((a, b) => a.position - b.position)
      .map(({ category, value, context_note }) => ({ category, value, context_note }))
  };

  return {
    id: row.id,
    slug: row.slug,
    nom: row.display_name,
    lettre: obtenirInitiale(row.display_name),
    genre: obtenirLibelleGenre(row.gender),
    ...parseContenuFiche(content)
  };
}


type JoinedNameIndex = {
  id: string;
  slug: string;
  display_name: string;
  gender: string;
  name_profiles: { status: string; published_at: string | null }[];
};

function scoreSuggestion(slugFiche: string, slugCandidat: string): number {
  let hash = 2166136261;

  for (const caractere of `${slugFiche}:${slugCandidat}`) {
    hash ^= caractere.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

function convertirIndex(row: JoinedNameIndex): PrenomIndex {
  return {
    id: row.id,
    slug: row.slug,
    nom: row.display_name,
    lettre: obtenirInitiale(row.display_name),
    genre: obtenirLibelleGenre(row.gender)
  };
}

export const getPrenomsIndex = cache(async (): Promise<PrenomIndex[]> => {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("names")
    .select("id, slug, display_name, gender, name_profiles!inner(status, published_at)")
    .eq("name_profiles.status", "publie")
    .not("name_profiles.published_at", "is", null)
    .order("display_name", { ascending: true });

  if (error) {
    console.error("Échec du chargement de l’index des prénoms Namesia :", error);
    throw new Error("Le catalogue des prénoms est momentanément indisponible.");
  }

  return (data as unknown as JoinedNameIndex[]).map(convertirIndex);
});

export async function getPrenoms(): Promise<Prenom[]> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("names")
    .select(selection)
    .eq("name_profiles.status", "publie")
    .not("name_profiles.published_at", "is", null)
    .order("display_name", { ascending: true });

  if (error) {
    console.error("Échec du chargement du catalogue Namesia :", error);
    throw new Error("Le catalogue des prénoms est momentanément indisponible.");
  }

  return (data as unknown as JoinedName[]).map(convertir);
}

export async function getPrenomsParSlugs(slugs: string[]): Promise<Prenom[]> {
  if (slugs.length === 0) return [];

  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("names")
    .select(selection)
    .in("slug", slugs)
    .eq("name_profiles.status", "publie")
    .not("name_profiles.published_at", "is", null)
    .order("display_name", { ascending: true });

  if (error) {
    console.error("Échec du chargement des fiches du comparateur Namesia :", error);
    throw new Error("Les fiches sélectionnées sont momentanément indisponibles.");
  }

  return (data as unknown as JoinedName[]).map(convertir);
}

export const getPrenom = cache(async (slug: string): Promise<Prenom | null> => {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("names")
    .select(selection)
    .eq("slug", slug)
    .eq("name_profiles.status", "publie")
    .not("name_profiles.published_at", "is", null)
    .maybeSingle();

  if (error) {
    console.error(`Échec du chargement de la fiche "${slug}" :`, error);
    throw new Error("Cette fiche est momentanément indisponible.");
  }

  return data ? convertir(data as unknown as JoinedName) : null;
});

export const getAutresPrenomsIndexDuGenre = cache(async (genre: string, slug: string): Promise<PrenomIndex[]> => {
  const entreeGenre = Object.entries(libellesGenres).find(([, libelle]) => libelle === genre);
  if (!entreeGenre) throw new Error(`Libellé de genre non pris en charge : "${genre}".`);
  const [codeGenre] = entreeGenre;
  if (codeGenre === "inconnu") return [];

  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("names")
    .select("id, slug, display_name, gender, name_profiles!inner(status, published_at)")
    .eq("gender", codeGenre)
    .neq("slug", slug)
    .eq("name_profiles.status", "publie")
    .not("name_profiles.published_at", "is", null);

  if (error) {
    console.error(`Échec du chargement des suggestions de prénoms du genre "${genre}" :`, error);
    throw new Error("Les suggestions de prénoms sont momentanément indisponibles.");
  }

  return (data as unknown as JoinedNameIndex[])
    .sort((a, b) => scoreSuggestion(slug, a.slug) - scoreSuggestion(slug, b.slug)
      || a.slug.localeCompare(b.slug, "fr"))
    .slice(0, 3)
    .map(convertirIndex);
});
