import type { Metadata } from "next";
import { FavoritesList } from "@/components/features/favorites/FavoritesList";
import { lireNombreVisible, type TriFavoris } from "@/lib/navigation-prenoms";
import { getNamesIndex } from "@/lib/names";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Vos favoris",
  description: "Retrouvez les prénoms que vous avez enregistrés dans votre navigateur.",
  robots: { index: false, follow: false }
};

type ParametreUrl = string | string[] | undefined;
type Props = {
  searchParams: Promise<{
    q?: ParametreUrl;
    genre?: ParametreUrl;
    tri?: ParametreUrl;
    limite?: ParametreUrl;
  }>;
};

function getFirstParam(value: ParametreUrl): string {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function lireTri(value: string): TriFavoris {
  return value === "nom-asc" || value === "nom-desc" ? value : "enregistrement";
}

export default async function FavoritesPage({ searchParams }: Props) {
  const [params, names] = await Promise.all([searchParams, getNamesIndex()]);

  return (
    <main id="contenu" tabIndex={-1} className="page-main">
      <div className="container catalogue">
        <span className="eyebrow">Votre sélection</span>
        <h1>Vos prénoms<br /><em>préférés.</em></h1>
        <p className="page-intro">Retrouvez ici les prénoms enregistrés dans ce navigateur. Votre sélection reste privée, sans compte ni synchronisation entre appareils.</p>
        <FavoritesList
          names={names}
          initialSearch={getFirstParam(params.q)}
          initialGender={getFirstParam(params.genre)}
          initialSort={lireTri(getFirstParam(params.tri))}
          initialVisibleCount={lireNombreVisible(params.limite)}
        />
      </div>
    </main>
  );
}
