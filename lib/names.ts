import { cache } from "react";
import { parseContenuFiche as parseNameProfileContent, type ContenuFichePrenom as NameProfileContent } from "@/lib/fiche-prenom";
import type { Tables } from "@/lib/supabase/database.types";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { lireToutesLesPages as readAllPages } from "@/lib/pagination";
import { calculerFenetreSuggestions as calculateSuggestionWindow } from "@/lib/suggestions-prenoms";
import { obtenirDatePublicationUnique as getUniquePublishedDate, type ProfilPublication as PublishedProfile } from "@/lib/publication-prenom";

export type NameGender = "Féminin" | "Masculin" | "Mixte" | "Genre non renseigné";

export type Name = {
  id: string;
  slug: string;
  name: string;
  initial: string;
  gender: NameGender;
} & NameProfileContent;

export type NameIndexEntry = Pick<Name, "id" | "slug" | "name" | "initial" | "gender">;

type JoinedAssociation = Pick<Tables<"name_profile_associations">, "category" | "value" | "context_note" | "position">;

type JoinedProfile = Pick<Tables<"name_profiles">, "introduction" | "origin_text" | "history_text" | "usage_text"> & {
  name_profile_associations: JoinedAssociation[];
};

const genderLabels: Record<string, NameGender> = {
  feminin: "Féminin",
  masculin: "Masculin",
  mixte: "Mixte",
  inconnu: "Genre non renseigné"
};

type JoinedName = Pick<Tables<"names">, "id" | "slug" | "display_name" | "gender"> & {
  name_profiles: JoinedProfile[];
};

const NAME_SELECTION = `
  id, slug, display_name, gender,
  name_profiles!inner (
    introduction, origin_text, history_text, usage_text,
    name_profile_associations ( category, value, context_note, position )
  )
`;

function getInitial(displayName: string): string {
  const initial = Array.from(displayName.trim())[0];
  if (!initial) throw new Error("Un prénom publié ne peut pas avoir un nom vide.");
  return initial.toLocaleUpperCase("fr");
}

function getGenderLabel(genderCode: string): NameGender {
  const label = genderLabels[genderCode];
  if (!label) throw new Error(`Genre de prénom non pris en charge : "${genderCode}".`);
  return label;
}

function mapNameProfile(row: JoinedName): Name {
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
    name: row.display_name,
    initial: getInitial(row.display_name),
    gender: getGenderLabel(row.gender),
    ...parseNameProfileContent(content)
  };
}

type JoinedNameIndex = Pick<Tables<"names">, "id" | "slug" | "display_name" | "gender"> & {
  name_profiles: PublishedProfile[];
};

function getSuggestionScore(nameSlug: string, candidateSlug: string): number {
  let hash = 2166136261;

  for (const character of `${nameSlug}:${candidateSlug}`) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

function mapNameIndex(row: JoinedNameIndex): NameIndexEntry {
  getUniquePublishedDate(row.slug, row.name_profiles);
  return {
    id: row.id,
    slug: row.slug,
    name: row.display_name,
    initial: getInitial(row.display_name),
    gender: getGenderLabel(row.gender)
  };
}

const NAME_INDEX_PAGE_SIZE = 500;

export const getNamesIndex = cache(async (): Promise<NameIndexEntry[]> => {
  const supabase = createSupabaseServerClient();

  try {
    const rows = await readAllPages<JoinedNameIndex>(async (start, end, countExact) => {
      const { data, error, count } = await supabase
        .from("names")
        .select("id, slug, display_name, gender, name_profiles!inner(status, published_at)", countExact ? { count: "exact" } : undefined)
        .eq("name_profiles.status", "publie")
        .not("name_profiles.published_at", "is", null)
        .order("display_name", { ascending: true })
        .order("id", { ascending: true })
        .range(start, end);

      return { data, error, count };
    }, NAME_INDEX_PAGE_SIZE);

    return rows.map(mapNameIndex);
  } catch (error) {
    console.error("Échec du chargement de l’index des prénoms Namesia :", error);
    throw new Error("Le catalogue des prénoms est momentanément indisponible.");
  }
});

type JoinedNameSitemap = Pick<Tables<"names">, "id" | "slug"> & {
  name_profiles: PublishedProfile[];
};

export const getNamesSitemap = cache(async (): Promise<{ slug: string; publishedAt: Date }[]> => {
  const supabase = createSupabaseServerClient();

  try {
    const rows = await readAllPages<JoinedNameSitemap>(async (start, end, countExact) => {
      const { data, error, count } = await supabase
        .from("names")
        .select("id, slug, name_profiles!inner(status, published_at)", countExact ? { count: "exact" } : undefined)
        .eq("name_profiles.status", "publie")
        .not("name_profiles.published_at", "is", null)
        .order("slug", { ascending: true })
        .order("id", { ascending: true })
        .range(start, end);

      return { data, error, count };
    }, NAME_INDEX_PAGE_SIZE);

    return rows.map((row) => ({
      slug: row.slug,
      publishedAt: getUniquePublishedDate(row.slug, row.name_profiles)
    }));
  } catch (error) {
    console.error("Échec du chargement des dates de publication du sitemap Namesia :", error);
    throw new Error("Le sitemap des prénoms est momentanément indisponible.");
  }
});

export async function getNamesBySlugs(slugs: string[]): Promise<Name[]> {
  if (slugs.length === 0) return [];

  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("names")
    .select(NAME_SELECTION)
    .in("slug", slugs)
    .eq("name_profiles.status", "publie")
    .not("name_profiles.published_at", "is", null)
    .order("display_name", { ascending: true });

  if (error) {
    console.error("Échec du chargement des fiches du comparateur Namesia :", error);
    throw new Error("Les fiches sélectionnées sont momentanément indisponibles.");
  }

  if (!data) throw new Error("La lecture des fiches sélectionnées a retourné une réponse vide.");
  return data.map(mapNameProfile);
}

export type NameOpenGraph = Pick<Name, "slug" | "name" | "initial" | "gender">;

export const getNameOpenGraphBySlug = cache(async (slug: string): Promise<NameOpenGraph | null> => {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("names")
    .select("slug, display_name, gender, name_profiles!inner(status, published_at)")
    .eq("slug", slug)
    .eq("name_profiles.status", "publie")
    .not("name_profiles.published_at", "is", null)
    .maybeSingle();

  if (error) {
    console.error(`Échec du chargement de l’aperçu Open Graph "${slug}" :`, error);
    throw new Error("L’aperçu de cette fiche est momentanément indisponible.");
  }

  if (!data) return null;
  if (data.name_profiles.length !== 1) {
    throw new Error(`Le prénom "${slug}" doit avoir exactement une version publiée.`);
  }

  return {
    slug: data.slug,
    name: data.display_name,
    initial: getInitial(data.display_name),
    gender: getGenderLabel(data.gender)
  };
});

export const getNameBySlug = cache(async (slug: string): Promise<Name | null> => {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("names")
    .select(NAME_SELECTION)
    .eq("slug", slug)
    .eq("name_profiles.status", "publie")
    .not("name_profiles.published_at", "is", null)
    .maybeSingle();

  if (error) {
    console.error(`Échec du chargement de la fiche "${slug}" :`, error);
    throw new Error("Cette fiche est momentanément indisponible.");
  }

  return data ? mapNameProfile(data) : null;
});

export const getOtherNamesByGender = cache(async (gender: NameGender, slug: string): Promise<NameIndexEntry[]> => {
  const genderEntry = Object.entries(genderLabels).find(([, label]) => label === gender);
  if (!genderEntry) throw new Error(`Libellé de genre non pris en charge : "${gender}".`);
  const [genderCode] = genderEntry;
  if (genderCode === "inconnu") return [];

  const supabase = createSupabaseServerClient();
  const { count, error: countError } = await supabase
    .from("names")
    .select("id, name_profiles!inner(status, published_at)", { count: "exact", head: true })
    .eq("gender", genderCode)
    .eq("name_profiles.status", "publie")
    .not("name_profiles.published_at", "is", null)
    .neq("slug", slug);

  if (countError) {
    console.error("Échec du comptage des suggestions Namesia :", countError);
    throw new Error("Les suggestions de prénoms sont momentanément indisponibles.");
  }
  if (count === null || !Number.isSafeInteger(count) || count < 0) {
    throw new Error("Le compte exact des suggestions de prénoms est invalide.");
  }
  if (count === 0) return [];

  const { debut: start, taille: size } = calculateSuggestionWindow(slug, count);
  const { data, error } = await supabase
    .from("names")
    .select("id, slug, display_name, gender, name_profiles!inner(status, published_at)")
    .eq("gender", genderCode)
    .eq("name_profiles.status", "publie")
    .not("name_profiles.published_at", "is", null)
    .neq("slug", slug)
    .order("id", { ascending: true })
    .range(start, start + size - 1);

  if (error || data === null) {
    console.error("Échec du chargement des suggestions Namesia :", error);
    throw new Error("Les suggestions de prénoms sont momentanément indisponibles.");
  }

  return data
    .map(mapNameIndex)
    .sort((a, b) => getSuggestionScore(slug, a.slug) - getSuggestionScore(slug, b.slug)
      || a.slug.localeCompare(b.slug, "fr"))
    .slice(0, 3);
});
