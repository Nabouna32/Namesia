import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/material3/Icon";
import { NameSearch } from "@/components/features/catalog/NameSearch";
import { jsonLd } from "@/lib/json-ld";
import { getNamesIndex } from "@/lib/names";
import { lireNombreVisible } from "@/lib/navigation-prenoms";
import { siteUrl } from "@/lib/site-url";

export const dynamic = "force-dynamic";

const catalogueTitle = "Explorer les prénoms";
const catalogueDescription = "Parcourez le catalogue Namesia et découvrez l'histoire des prénoms.";

export const metadata: Metadata = {
  title: catalogueTitle,
  description: catalogueDescription,
  alternates: { canonical: "/prenoms" },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Namesia",
    title: catalogueTitle,
    description: catalogueDescription,
    url: "/prenoms"
  }
};

type Props = {
  searchParams: Promise<{
    q?: string | string[];
    genre?: string | string[];
    lettre?: string | string[];
    limite?: string | string[];
  }>;
};

function premierParametre(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function normaliserFiltre(value: string): string {
  return value.trim().normalize("NFD").replace(/\p{Diacritic}/gu, "").toLocaleLowerCase("fr");
}

export default async function NamesPage({ searchParams }: Props) {
  const [parametres, prenoms] = await Promise.all([searchParams, getNamesIndex()]);
  const rechercheInitiale = premierParametre(parametres.q);
  const nombreVisibleInitial = lireNombreVisible(parametres.limite, Math.max(24, Math.ceil(prenoms.length / 24) * 24));
  const genreDemande = premierParametre(parametres.genre);
  const lettreDemandee = normaliserFiltre(premierParametre(parametres.lettre));

  const lettresDisponibles = new Set(prenoms.map((prenom) => normaliserFiltre(prenom.initial)));
  const genreInitial = prenoms.find((prenom) => prenom.gender === genreDemande)?.gender ?? null;
  const lettreInitiale = lettresDisponibles.has(lettreDemandee) ? lettreDemandee : null;

  const catalogueData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: catalogueTitle,
    description: catalogueDescription,
    url: new URL("/prenoms", siteUrl).toString(),
    inLanguage: "fr-FR",
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: prenoms.length,
      itemListElement: prenoms.map((prenom, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Thing",
          name: prenom.name,
          url: new URL(`/prenoms/${prenom.slug}`, siteUrl).toString()
        }
      }))
    }
  };

  return (
    <main id="contenu" tabIndex={-1} className="page-main">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(catalogueData) }} />
      <div className="container catalogue">
        <span className="eyebrow">Le catalogue</span>
        <h1>Trouvez le prénom<br /><em>qui vous parle.</em></h1>
        <p className="page-intro">Des prénoms d'ici et d'ailleurs, leurs origines, leurs histoires et les traditions qui les accompagnent.</p>
        <p><Link className="text-link" href="/tendances">Voir les tendances 2025 <Icon name="arrow-up-right" size={18} /></Link></p>
        <NameSearch
          prenoms={prenoms}
          synchroniserUrl
          initialRecherche={rechercheInitiale}
          initialGenre={genreInitial}
          initialLettre={lettreInitiale}
          initialNombreVisible={nombreVisibleInitial}
        />
      </div>
    </main>
  );
}
