import type { Metadata } from "next";
import { ComparateurPrenoms } from "@/components/comparateur-prenoms";
import { getPrenoms } from "@/lib/prenoms";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Comparer des prénoms",
  description: "Comparez les origines, histoires, usages et associations publiés dans les fiches Namesia.",
  robots: { index: false, follow: true }
};

export default async function Comparer() {
  const prenoms = await getPrenoms();

  return (
    <main className="page-main">
      <div className="container catalogue">
        <span className="eyebrow">Le comparateur</span>
        <h1>Des prénoms,<br /><em>des repères pour choisir.</em></h1>
        <p className="page-intro">Mettez deux ou trois fiches côte à côte pour parcourir leurs origines, leurs histoires et leurs usages. Seules les informations publiées sont comparées.</p>
        <ComparateurPrenoms prenoms={prenoms} />
      </div>
    </main>
  );
}