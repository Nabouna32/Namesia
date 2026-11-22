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
    name_profile_associations ( category, value, context_note, position ),
  )
`;

function convertir(row: JoinedName): Prenom {
  const profiles = row.name_profiles ?? [];
  if (profiles.length !== 1) {
    throw new Error(`Le prénom "${row.slug}" doit avoir exactement une version publiée.`);
  }

  const [profile] = profiles;
  const content = {
    introduction: profile.introduction,
    ...(profile.origin_text ? { origin: profile.origin_text } : {}),
    ...(profile.history_text ? { history: profile.history_text } : {}),
    ...(profile.usage_text ? { usage: profile.usage_text } : {}),
    symbolic_associations: [...(profile.name_profile_associations ?? [])]
      .sort((a, b) => a.position - b.position)
      .map(({ category, value, context_note }) => ({ category, value, context_note })),

  };

  return {
    id: row.id,
    slug: row.slug,
    nom: row.display_name,
    lettre: Array.from(row.display_name.trim())[0]?.toLocaleUpperCase("fr") ?? "",
    genre: libellesGenres[row.gender] ?? "Genre non renseigné",
    ...parseContenuFiche(content)
  };
}

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

export const getAutresPrenomsDuGenre = cache(async (genre: string, slug: string): Promise<Prenom[]> => {
  const codeGenre = Object.entries(libellesGenres).find(([, libelle]) => libelle === genre)?.[0];
  if (!codeGenre || codeGenre === "inconnu") return [];

  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("names")
    .select(selection)
    .eq("gender", codeGenre)
    .neq("slug", slug)
    .eq("name_profiles.status", "publie")
    .not("name_profiles.published_at", "is", null)
    .order("display_name", { ascending: true })
    .limit(3);

  if (error) {
    console.error(`Échec du chargement des autres prénoms du genre "${genre}" :`, error);
    throw new Error("Les suggestions de prénoms sont momentanément indisponibles.");
  }

  return (data as unknown as JoinedName[]).map(convertir);
});
