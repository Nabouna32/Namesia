import { NextResponse } from "next/server";
import { parseFichePrenom, type FichePrenomImport } from "@/lib/fiche-prenom";
import { requireAdmin } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const access = await requireAdmin(request);
  if (access.error) {
    return NextResponse.json({ error: access.error.message }, { status: access.error.status });
  }

  const offset = Number(new URL(request.url).searchParams.get("offset") ?? "0");
  if (!Number.isSafeInteger(offset) || offset < 0 || offset > 1_000_000) {
    return NextResponse.json({ error: "Décalage de pagination invalide." }, { status: 400 });
  }

  const pageSize = 100;
  const { data, error, count } = await access.supabase
    .from("names")
    .select(`
      id, slug, display_name,
      name_profiles ( id, version, status, created_at )
    `, { count: "exact" })
    .order("display_name", { ascending: true })
    .order("slug", { ascending: true })
    .range(offset, offset + pageSize - 1);

  if (error) {
    console.error("Échec du chargement de l'administration Namesia :", error);
    return NextResponse.json({ error: "Le catalogue administrateur est momentanément indisponible." }, { status: 503 });
  }

  const names = data ?? [];
  const nextOffset = count !== null && names.length > 0 && offset + names.length < count
    ? offset + names.length
    : null;

  return NextResponse.json(
    { names, total: count ?? 0, nextOffset },
    { headers: { "Cache-Control": "private, no-store" } }
  );
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

  let fiche: FichePrenomImport;
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

  if (error) {
    console.error("Échec de l'import d'une fiche Namesia :", error);
    if (error.code === "42501") {
      return NextResponse.json({ error: "Cette opération nécessite un compte administrateur." }, { status: 403 });
    }
    if (error.code === "22023") {
      return NextResponse.json({ error: "L'identité d'un prénom existant (slug, graphie et genre) ne peut pas être modifiée par un import." }, { status: 409 });
    }
    if (error.code === "23505") {
      return NextResponse.json({ error: "Cette version existe déjà. Recharge le catalogue avant de réessayer." }, { status: 409 });
    }
    return NextResponse.json({ error: "La fiche n'a pas pu être enregistrée." }, { status: 500 });
  }
  if (!data?.[0]) {
    return NextResponse.json({ error: "La base n'a pas retourné la version créée." }, { status: 500 });
  }

  return NextResponse.json({
    profileId: data[0].profile_id,
    version: data[0].version,
    status: "brouillon"
  }, { status: 201 });
}
