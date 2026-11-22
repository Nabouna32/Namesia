import type { Metadata } from "next";
import { ListeFavoris } from "@/components/liste-favoris";
import { getPrenoms } from "@/lib/prenoms";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Vos favoris",
  description: "Retrouvez les prénoms que vous avez enregistrés dans votre navigateur.",
  robots: { index: false, follow: false }
};

export default async function FavorisPage() {
  const prenoms = await getPrenoms();

  return (
    <main id="contenu" tabIndex={-1} className="page-main">
      <div className="container catalogue">
        <span className="eyebrow">Votre sélection</span>
        <h1>Vos prénoms<br /><em>préférés.</em></h1>
        <p className="page-intro">Retrouvez ici les prénoms enregistrés dans ce navigateur. Votre sélection reste privée, sans compte ni synchronisation entre appareils.</p>
        <ListeFavoris prenoms={prenoms} />
      </div>
    </main>
  );
}
