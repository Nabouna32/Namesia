import type { Metadata } from "next";
import { RecherchePrenoms } from "@/components/recherche-prenoms";
import { getPrenoms } from "@/lib/prenoms";
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Explorer les prénoms", description: "Parcourez le catalogue Namesia et découvrez l'histoire des prénoms.", alternates: { canonical: "/prenoms" }, openGraph: { type: "website", locale: "fr_FR", siteName: "Namesia", title: "Explorer les prénoms", description: "Parcourez le catalogue Namesia et découvrez l'histoire des prénoms.", url: "/prenoms" } };
export default async function Catalogue() {
  const prenoms = await getPrenoms();
  return <main className="page-main"><div className="container catalogue">
    <span className="eyebrow">Le catalogue</span><h1>Trouvez le prénom<br /><em>qui vous parle.</em></h1>
    <p className="page-intro">Des prénoms d'ici et d'ailleurs, leurs origines, leurs histoires et les traditions qui les accompagnent.</p>
    <RecherchePrenoms prenoms={prenoms} />
  </div></main>;
}
