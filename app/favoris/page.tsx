import type { Metadata } from "next";
import { FavoriteList } from "@/components/FavoriteList";
import { lireNombreVisible, type TriFavoris } from "@/lib/navigation-prenoms";
import { getPrenomsIndex } from "@/lib/prenoms";

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

function premierParametre(value: ParametreUrl): string {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function lireTri(value: string): TriFavoris {
  return value === "nom-asc" || value === "nom-desc" ? value : "enregistrement";
}

export default async function FavorisPage({ searchParams }: Props) {
  const [parametres, prenoms] = await Promise.all([searchParams, getPrenomsIndex()]);

  return (
    <main id="contenu" tabIndex={-1} className="page-main">
      <div className="container catalogue">
        <span className="eyebrow">Votre sélection</span>
        <h1>Vos prénoms<br /><em>préférés.</em></h1>
        <p className="page-intro">Retrouvez ici les prénoms enregistrés dans ce navigateur. Votre sélection reste privée, sans compte ni synchronisation entre appareils.</p>
        <FavoriteList
          prenoms={prenoms}
          initialRecherche={premierParametre(parametres.q)}
          initialGenre={premierParametre(parametres.genre)}
          initialTri={lireTri(premierParametre(parametres.tri))}
          initialNombreVisible={lireNombreVisible(parametres.limite)}
        />
      </div>
    </main>
  );
}
