import { NextResponse } from "next/server";
import { getNamesBySlugs } from "@/lib/names";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const slugs = new URL(request.url).searchParams.getAll("slug");
  if (
    slugs.length < 2
    || slugs.length > 3
    || new Set(slugs).size !== slugs.length
    || slugs.some((slug) => slug.length > 120 || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))
  ) {
    return NextResponse.json(
      { error: "Sélection invalide : choisissez deux ou trois prénoms publiés." },
      { status: 400 }
    );
  }

  try {
    const prenoms = await getNamesBySlugs(slugs);
    return NextResponse.json(
      { prenoms },
      { headers: { "Cache-Control": "public, max-age=30, s-maxage=60, stale-while-revalidate=60" } }
    );
  } catch {
    return NextResponse.json(
      { error: "Les fiches sélectionnées sont momentanément indisponibles." },
      { status: 503 }
    );
  }
}
