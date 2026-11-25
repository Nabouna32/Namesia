import type { Metadata } from "next";
import { NameComparator } from "@/components/features/comparison/NameComparator";
import { getNamesIndex } from "@/lib/names";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Comparer des prénoms",
  description: "Comparez les origines, histoires, usages et associations publiés dans les fiches Namesia.",
  robots: { index: false, follow: true }
};

type Props = { searchParams: Promise<{ prenoms?: string | string[] }> };

export default async function ComparePage({ searchParams }: Props) {
  const [{ prenoms: requestedSlugs }, names] = await Promise.all([searchParams, getNamesIndex()]);
  const slugsDemandes = (Array.isArray(requestedSlugs) ? requestedSlugs : [requestedSlugs ?? ""])
    .flatMap((valeur) => valeur.split(","))
    .filter(Boolean);
  const availableSlugs = new Set(names.map((prenom) => prenom.slug));
  const initialSelection = [...new Set(slugsDemandes)]
    .filter((slug) => availableSlugs.has(slug) && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))
    .slice(0, 3);

  return (
    <main id="contenu" tabIndex={-1} className="page-main">
      <div className="container catalogue">
        <span className="eyebrow">Le comparateur</span>
        <h1>Des prénoms,<br /><em>des repères pour choisir.</em></h1>
        <p className="page-intro">Mettez deux ou trois fiches côte à côte pour parcourir leurs origines, leurs histoires et leurs usages. Les contenus sont générés par IA et peuvent comporter des erreurs : ce comparateur organise les informations publiées, il ne les vérifie pas. Les associations symboliques restent des interprétations culturelles.</p>
        <NameComparator names={names} initialSelection={initialSelection} />
      </div>
    </main>
  );
}