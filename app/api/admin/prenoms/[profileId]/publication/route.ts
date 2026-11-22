import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";

type Props = { params: Promise<{ profileId: string }> };

export const runtime = "nodejs";

export async function POST(request: Request, { params }: Props) {
  const access = await requireAdmin(request);
  if (access.error) {
    return NextResponse.json({ error: access.error.message }, { status: access.error.status });
  }

  const { profileId } = await params;
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(profileId)) {
    return NextResponse.json({ error: "Identifiant de version invalide." }, { status: 400 });
  }

  const { error } = await access.supabase.rpc("publish_name_profile", {
    p_profile_id: profileId
  });

  if (error) {
    console.error("Échec de la publication d'une fiche Namesia :", error);
    if (error.code === "42501") {
      return NextResponse.json({ error: "Cette opération nécessite un compte administrateur." }, { status: 403 });
    }
    if (error.code === "22023" || error.code === "P0002") {
      return NextResponse.json({ error: "Seule une version existante en brouillon peut être publiée." }, { status: 409 });
    }
    return NextResponse.json({ error: "La fiche n'a pas pu être publiée." }, { status: 500 });
  }

  return NextResponse.json({ status: "publie" });
}
