import type { Metadata } from "next";
import Link from "next/link";
import { RandomDiscovery } from "@/components/features/discovery/RandomDiscovery";
import { RecentNames } from "@/components/features/history/RecentNames";
import { FeaturedNames } from "@/components/features/catalog/FeaturedNames";
import { NameSearch } from "@/components/features/catalog/NameSearch";
import { getPrenomsIndex, type PrenomIndex } from "@/lib/prenoms";
import { IconeMaterial } from "@/components/icone-material";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { alternates: { canonical: "/" } };

export default async function Accueil() {
  const prenoms = await getPrenomsIndex();
  const decalageDuJour = prenoms.length > 0
    ? Math.floor(Date.now() / 86_400_000) % prenoms.length
    : 0;
  const nombreMisEnAvant = Math.min(3, prenoms.length);
  const prenomsMisEnAvant: PrenomIndex[] = [];

  for (let position = 0; position < nombreMisEnAvant; position += 1) {
    const indexCatalogue = (decalageDuJour + Math.floor(position * prenoms.length / nombreMisEnAvant)) % prenoms.length;
    const prenom = prenoms[indexCatalogue];
    if (prenom) prenomsMisEnAvant.push(prenom);
  }

  return (
    <main id="contenu" tabIndex={-1}>
      <section className="hero">
        <div className="container hero-content">
          <div className="hero-intro">
            <span className="eyebrow"><span className="eyebrow-dot" /> L'univers des prénoms, autrement</span>
            <h1>Chaque prénom<br />a <em>son histoire.</em></h1>
            <p className="hero-copy">Une origine, des sonorités, des cultures et des traditions. Explorez les histoires qui se cachent derrière les prénoms.</p>
          </div>
          <div className="hero-tools">
            <h2>Un prénom en tête ?</h2>
            <NameSearch prenoms={prenoms} compact />
            {prenoms.length > 0 && <RandomDiscovery prenoms={prenoms} />}
            <p className="ai-disclaimer">Les contenus sont générés par IA et peuvent comporter des erreurs.</p>
          </div>
        </div>
      </section>
      <RecentNames prenoms={prenoms} />
      <section className="section explore-section">
        <div className="container">
          <div className="section-heading">
            <div><span className="eyebrow">À explorer</span><h2>Les prénoms à découvrir</h2></div>
            <Link className="text-link" href="/prenoms">Tous les prénoms <IconeMaterial name="arrow-up-right" size={18} /></Link>
          </div>
          <FeaturedNames prenoms={prenomsMisEnAvant} />
          {prenoms.length === 0 && <p className="empty-state">Le catalogue sera bientôt disponible.</p>}
        </div>
      </section>
    </main>
  );
}
