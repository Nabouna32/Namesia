import { NextResponse } from "next/server";
import { getPrenomsParSlugs } from "@/lib/prenoms";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const slugs = new URL(request.url).searchParams.getAll("slug");
  if (
    slugs.length < 1
    || slugs.length > 3
    || new Set(slugs).size !== slugs.length
    || slugs.some((slug) => slug.length > 120 || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))
  ) {
    return NextResponse.json(
      { error: "Sélection invalide : choisissez un à trois prénoms publiés." },
      { status: 400 }
    );
  }

  try {
    const prenoms = await getPrenomsParSlugs(slugs);
    return NextResponse.json(
      { prenoms },
      { headers: { "Cache-Control": "private, no-store" } }
    );
  } catch {
    return NextResponse.json(
      { error: "Les fiches sélectionnées sont momentanément indisponibles." },
      { status: 503 }
    );
  }
}
