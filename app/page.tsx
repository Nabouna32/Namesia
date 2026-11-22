import type { Metadata } from "next";
import Link from "next/link";
import { DecouverteAleatoire } from "@/components/decouverte-aleatoire";
import { RecherchePrenoms } from "@/components/recherche-prenoms";
import { getPrenoms } from "@/lib/prenoms";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { alternates: { canonical: "/" } };

export default async function Accueil() {
  const prenoms = await getPrenoms();

  return (
    <main id="contenu" tabIndex={-1}>
      <section className="hero">
        <div className="hero-glow" aria-hidden="true" />
        <div className="container hero-content">
          <span className="eyebrow"><span className="eyebrow-dot" /> L'univers des prénoms, autrement</span>
          <h1>Chaque prénom<br />a <em>son histoire.</em></h1>
          <p className="hero-copy">Une origine, des sonorités, des cultures et des traditions. Explorez les histoires qui se cachent derrière les prénoms.</p>
          <RecherchePrenoms prenoms={prenoms} compact />
          {prenoms.length > 0 && <DecouverteAleatoire prenoms={prenoms} />}
          <p className="ai-disclaimer">Les contenus sont générés par IA et peuvent comporter des erreurs.</p>
        </div>
        <div className="hero-decoration" aria-hidden="true"><span>A</span><span>é</span><span>∞</span></div>
      </section>
      <section className="section explore-section">
        <div className="container">
          <div className="section-heading">
            <div><span className="eyebrow">À explorer</span><h2>Les prénoms à découvrir</h2></div>
            <Link className="text-link" href="/prenoms">Tous les prénoms <span>↗</span></Link>
          </div>
          <div className="featured-grid">
            {prenoms.slice(0, 3).map((prenom, index) => (
              <Link className={`featured-card featured-${index + 1}`} href={`/prenoms/${prenom.slug}`} key={prenom.slug}>
                <span className="featured-letter">{prenom.lettre}</span>
                <span className="featured-bottom"><strong>{prenom.nom}</strong><span>Découvrir <b>↗</b></span></span>
              </Link>
            ))}
          </div>
          {prenoms.length === 0 && <p className="empty-state">Le catalogue sera bientôt disponible.</p>}
        </div>
      </section>
    </main>
  );
}
