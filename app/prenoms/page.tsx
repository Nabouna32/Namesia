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

function getFirstParam(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function normalizeFilter(value: string): string {
  return value.trim().normalize("NFD").replace(/\p{Diacritic}/gu, "").toLocaleLowerCase("fr");
}

export default async function NamesPage({ searchParams }: Props) {
  const [params, names] = await Promise.all([searchParams, getNamesIndex()]);
  const initialSearch = getFirstParam(params.q);
  const initialVisibleCount = lireNombreVisible(params.limite, Math.max(24, Math.ceil(names.length / 24) * 24));
  const requestedGender = getFirstParam(params.genre);
  const requestedLetter = normalizeFilter(getFirstParam(params.lettre));

  const availableInitials = new Set(names.map((name) => normalizeFilter(name.initial)));
  const initialGender = names.find((name) => name.gender === requestedGender)?.gender ?? null;
  const initialLetter = availableInitials.has(requestedLetter) ? requestedLetter : null;

  const catalogueData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: catalogueTitle,
    description: catalogueDescription,
    url: new URL("/prenoms", siteUrl).toString(),
    inLanguage: "fr-FR",
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: names.length,
      itemListElement: names.map((name, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Thing",
          name: name.name,
          url: new URL(`/prenoms/${name.slug}`, siteUrl).toString()
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
        <p><Link className="text-link" href="/tendances">Voir les tendances 2025 <Icon name="chevron-right" size={18} /></Link></p>
        <NameSearch
          names={names}
          syncUrl
          initialSearch={initialSearch}
          initialGender={initialGender}
          initialLetter={initialLetter}
          initialVisibleCount={initialVisibleCount}
        />
      </div>
    </main>
  );
}
