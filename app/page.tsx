import Link from "next/link";
import { RecherchePrenoms } from "@/components/recherche-prenoms";
import { prenoms } from "@/lib/prenoms";

export default function Accueil() {
  return (
    <main>
      <section className="hero">
        <div className="hero-glow" aria-hidden="true" />
        <div className="container hero-content">
          <span className="eyebrow"><span className="eyebrow-dot" /> L'univers des prénoms, autrement</span>
          <h1>Chaque prénom<br />a <em>son histoire.</em></h1>
          <p className="hero-copy">Une origine, des sonorités, des cultures et parfois une symbolique. Explorez ce qui se cache derrière les prénoms.</p>
          <RecherchePrenoms compact />
          <div className="hero-footnote"><span>✳</span> Des repères documentés, sans confondre faits et symboles.</div>
        </div>
        <div className="hero-decoration" aria-hidden="true"><span>A</span><span>é</span><span>∞</span></div>
      </section>

      <section className="section explore-section">
        <div className="container">
          <div className="section-heading">
            <div><span className="eyebrow">À explorer</span><h2>Un prénom en tête ?</h2></div>
            <Link className="text-link" href="/prenoms">Tous les prénoms <span>↗</span></Link>
          </div>
          <div className="featured-grid">
            {prenoms.slice(0, 3).map((prenom, index) => (
              <Link className={`featured-card featured-${index + 1}`} href={`/prenoms/${prenom.slug}`} key={prenom.slug}>
                <span className="featured-number">0{index + 1}</span>
                <span className="featured-letter">{prenom.lettre}</span>
                <span className="featured-bottom"><strong>{prenom.nom}</strong><span>Découvrir <b>↗</b></span></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="approach-section" id="approche">
        <div className="container approach-inner">
          <div><span className="eyebrow">Notre promesse</span><h2>La curiosité,<br /><em>avec du discernement.</em></h2></div>
          <div className="approach-copy">
            <p>Un prénom peut être étudié sous plusieurs angles. Namesia distingue les informations vérifiables — origine, histoire, données — des lectures symboliques et culturelles.</p>
            <div className="principles">
              <div><span>01</span><p><strong>Des faits sourcés</strong><br />Chaque information importante doit pouvoir être retracée.</p></div>
              <div><span>02</span><p><strong>La symbolique à sa place</strong><br />Une interprétation culturelle, jamais une vérité scientifique.</p></div>
              <div><span>03</span><p><strong>De la nuance</strong><br />Les incertitudes et les variantes sont expliquées.</p></div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
