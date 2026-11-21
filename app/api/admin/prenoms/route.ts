import { NextResponse } from "next/server";
import { parseFichePrenom } from "@/lib/fiche-prenom";
import { requireAdmin } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const access = await requireAdmin(request);
  if (access.error) {
    return NextResponse.json({ error: access.error.message }, { status: access.error.status });
  }

  const { data, error } = await access.supabase
    .from("names")
    .select(`
      id, slug, display_name, gender,
      name_profiles ( id, version, schema_version, status, created_at, published_at, content )
    `)
    .order("display_name", { ascending: true })
    .limit(500);

  if (error) {
    console.error("Échec du chargement de l'administration Namesia :", error);
    return NextResponse.json({ error: "Le catalogue administrateur est momentanément indisponible." }, { status: 503 });
  }

  return NextResponse.json({ names: data ?? [] }, { headers: { "Cache-Control": "private, no-store" } });
}

export async function POST(request: Request) {
  const access = await requireAdmin(request);
  if (access.error) {
    return NextResponse.json({ error: access.error.message }, { status: access.error.status });
  }

  const declaredLength = Number(request.headers.get("content-length") ?? 0);
  if (declaredLength > 64 * 1024) {
    return NextResponse.json({ error: "Le fichier JSON dépasse la limite de 64 Ko." }, { status: 413 });
  }

  let payload: unknown;
  try {
    const raw = await request.text();
    if (Buffer.byteLength(raw, "utf8") > 64 * 1024) {
      return NextResponse.json({ error: "Le fichier JSON dépasse la limite de 64 Ko." }, { status: 413 });
    }
    payload = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Le corps de la requête doit être un JSON valide." }, { status: 400 });
  }

  let fiche;
  try {
    fiche = parseFichePrenom(payload);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Le format de la fiche est invalide.";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const { data, error } = await access.supabase.rpc("import_name_profile", {
    p_slug: fiche.identity.slug,
    p_display_name: fiche.identity.display_name,
    p_gender: fiche.identity.gender,
    p_content: fiche.content,
    p_schema_version: fiche.schema_version
  });

  if (error || !data?.[0]) {
    console.error("Échec de l'import d'une fiche Namesia :", error);
    return NextResponse.json({ error: "La fiche n'a pas pu être enregistrée." }, { status: 500 });
  }

  return NextResponse.json({
    profileId: data[0].profile_id,
    version: data[0].version,
    status: "brouillon"
  }, { status: 201 });
}
