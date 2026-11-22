import { NextResponse } from "next/server";
import { parseFichePrenom } from "@/lib/fiche-prenom";
import { requireAdmin } from "@/lib/admin-auth";

type Props = { params: Promise<{ profileId: string }> };

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request, { params }: Props) {
  const access = await requireAdmin(request);
  if (access.error) {
    return NextResponse.json({ error: access.error.message }, { status: access.error.status });
  }

  const { profileId } = await params;
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(profileId)) {
    return NextResponse.json({ error: "Identifiant de version invalide." }, { status: 400 });
  }

  const { data: profile, error: profileError } = await access.supabase
    .from("name_profiles")
    .select("id, name_id, version, schema_version, status, introduction, origin_text, history_text, usage_text, name_profile_associations(category, value, context_note, position), name_profile_references(section, title, publisher, url, consulted_at, position)")
    .eq("id", profileId)
    .maybeSingle();

  if (profileError) {
    console.error("Échec du chargement d'une version Namesia :", profileError);
    return NextResponse.json({ error: "Cette version est momentanément indisponible." }, { status: 503 });
  }
  if (!profile) {
    return NextResponse.json({ error: "Cette version n'existe pas." }, { status: 404 });
  }

  const { data: name, error: nameError } = await access.supabase
    .from("names")
    .select("slug, display_name, gender")
    .eq("id", profile.name_id)
    .maybeSingle();

  if (nameError || !name) {
    console.error("Échec du chargement de l'identité d'une fiche Namesia :", nameError);
    return NextResponse.json({ error: "L'identité de cette fiche est indisponible." }, { status: 503 });
  }

  try {
    const fiche = parseFichePrenom({
      schema_version: "3.0.0",
      identity: {
        slug: name.slug,
        display_name: name.display_name,
        gender: name.gender
      },
      content: {
        introduction: profile.introduction,
        ...(profile.origin_text ? { origin: profile.origin_text } : {}),
        ...(profile.history_text ? { history: profile.history_text } : {}),
        ...(profile.usage_text ? { usage: profile.usage_text } : {}),
        symbolic_associations: [...(profile.name_profile_associations ?? [])]
          .sort((a, b) => a.position - b.position)
          .map(({ category, value, context_note }) => ({ category, value, context_note })),
        references: [...(profile.name_profile_references ?? [])]
          .sort((a, b) => a.position - b.position)
          .map(({ section, title, publisher, url, consulted_at }) => ({ section, title, publisher, url, consulted_at }))
      }
    });

    return NextResponse.json(
      { fiche, status: profile.status, version: profile.version },
      { headers: { "Cache-Control": "private, no-store" } }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Cette version ne respecte pas le contrat Namesia.";
    return NextResponse.json({ error: message }, { status: 409 });
  }
}
