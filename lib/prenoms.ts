import { parseContenuFiche, type ContenuFichePrenom } from "@/lib/fiche-prenom";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type Prenom = {
  id: string;
  slug: string;
  nom: string;
  lettre: string;
  genre: string;
} & ContenuFichePrenom;

type JoinedName = {
  id: string;
  slug: string;
  display_name: string;
  gender: string;
  name_profiles: {
    content: unknown;
  }[];
};

const selection = `
  id, slug, display_name, gender,
  name_profiles!inner ( content )
`;

function convertir(row: JoinedName): Prenom {
  const profiles = row.name_profiles ?? [];
  if (profiles.length !== 1) {
    throw new Error(`Le prénom "${row.slug}" doit avoir exactement une version publiée.`);
  }

  const [profile] = profiles;

  const genres: Record<string, string> = {
    feminin: "Féminin",
    masculin: "Masculin",
    mixte: "Mixte",
    inconnu: "Genre non renseigné"
  };

  return {
    id: row.id,
    slug: row.slug,
    nom: row.display_name,
    lettre: Array.from(row.display_name.trim())[0]?.toLocaleUpperCase("fr") ?? "",
    genre: genres[row.gender] ?? "Genre non renseigné",
    ...parseContenuFiche(profile.content)
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

export async function getPrenom(slug: string): Promise<Prenom | null> {
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
}
