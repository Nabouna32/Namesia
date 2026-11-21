import { createSupabaseServerClient } from "@/lib/supabase/server";

export type Source = { title: string; publisher: string | null; url: string };
export type Claim = {
  id: string;
  section: "origine" | "histoire" | "usage" | "statistique";
  content: string;
  claim_status: "etabli" | "discute";
  evidence_note: string | null;
  claim_sources: { sources: Source | null }[];
};
export type SymbolicAssociation = { id: string; category: string; value: string; context_note: string; disclaimer: string };
export type Prenom = {
  id: string; slug: string; nom: string; lettre: string; genre: string;
  introduction: string; origine: string | null; histoire: string | null;
  usage: string | null; claims: Claim[]; symboles: SymbolicAssociation[];
};
type JoinedName = {
  id: string; slug: string; display_name: string; first_letter: string; gender: string;
  name_profile_versions: {
    id: string; version: number; introduction: string; origin_text: string | null;
    history_text: string | null; usage_text: string | null; claims: Claim[]; symbolic_associations: SymbolicAssociation[];
  }[];
};
const selection = `
  id, slug, display_name, first_letter, gender,
  name_profile_versions!inner (
    id, version, introduction, origin_text, history_text, usage_text,
    claims (
      id, section, content, claim_status, evidence_note,
      claim_sources ( sources ( title, publisher, url ) )
    ),
    symbolic_associations ( id, category, value, context_note, disclaimer )
  )
`;
function convertir(row: JoinedName): Prenom {
  const profile = [...(row.name_profile_versions ?? [])].sort((a, b) => b.version - a.version)[0];
  const genres: Record<string, string> = { feminin: "Féminin", masculin: "Masculin", mixte: "Mixte" };
  return {
    id: row.id, slug: row.slug, nom: row.display_name, lettre: row.first_letter,
    genre: genres[row.gender] ?? "Prénom", introduction: profile?.introduction ?? "",
    origine: profile?.origin_text ?? null, histoire: profile?.history_text ?? null,
    usage: profile?.usage_text ?? null, claims: profile?.claims ?? [], symboles: profile?.symbolic_associations ?? []
  };
}
export async function getPrenoms(): Promise<Prenom[]> {
  const supabase = createSupabaseServerClient();
  if (!supabase) return [];
  const { data, error } = await supabase.from("names").select(selection)
    .eq("is_published", true)
    .eq("name_profile_versions.status", "publie")
    .not("name_profile_versions.published_at", "is", null)
    .order("display_name", { ascending: true });
  if (error || !data) return [];
  return (data as unknown as JoinedName[]).map(convertir);
}
export async function getPrenom(slug: string): Promise<Prenom | null> {
  const supabase = createSupabaseServerClient();
  if (!supabase) return null;
  const { data, error } = await supabase.from("names").select(selection)
    .eq("slug", slug).eq("is_published", true)
    .eq("name_profile_versions.status", "publie")
    .not("name_profile_versions.published_at", "is", null)
    .maybeSingle();
  if (error || !data) return null;
  return convertir(data as unknown as JoinedName);
}
