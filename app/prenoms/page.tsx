import type { Metadata } from "next";
import { RecherchePrenoms } from "@/components/recherche-prenoms";
import { jsonLd } from "@/lib/json-ld";
import { getPrenoms } from "@/lib/prenoms";
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

export default async function Catalogue() {
  const prenoms = await getPrenoms();
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
          name: prenom.nom,
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
        <RecherchePrenoms prenoms={prenoms} />
      </div>
    </main>
  );
}
