import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPrenom } from "@/lib/prenoms";

type Props = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const prenom = await getPrenom(slug);
  return prenom ? {
    title: prenom.nom,
    description: prenom.introduction,
    alternates: { canonical: `/prenoms/${prenom.slug}` },
    openGraph: {
      type: "article",
      locale: "fr_FR",
      siteName: "Namesia",
      title: prenom.nom,
      description: prenom.introduction,
      url: `/prenoms/${prenom.slug}`
    }
  } : {};
}

export default async function FichePrenom({ params }: Props) {
  const { slug } = await params;
  const prenom = await getPrenom(slug);
  if (!prenom) notFound();

  const aDesRubriques = Boolean(
    prenom.origin || prenom.history || prenom.usage || prenom.symbolic_associations.length
  );

  return (
    <main className="page-main profile-main">
      <div className="container profile">
        <nav className="breadcrumb" aria-label="Fil d’Ariane">
          <ol>
            <li><Link href="/">Accueil</Link></li>
            <li><Link href="/prenoms">Prénoms</Link></li>
            <li aria-current="page">{prenom.nom}</li>
          </ol>
        </nav>

        <article>
          <header className="profile-hero">
            <div className="profile-hero-copy">
              <span className="eyebrow">Découvrir un prénom</span>
              <h1>{prenom.nom}<span>.</span></h1>
              <p className="profile-lead">{prenom.introduction}</p>
              <div className="profile-tags">
                <span className="profile-tag">{prenom.genre}</span>
                <span className="profile-tag">Lettre {prenom.lettre}</span>
              </div>
            </div>
            <div className="profile-monogram" aria-hidden="true">{prenom.lettre}</div>
          </header>

          {aDesRubriques && (
            <nav className="profile-toc" aria-label="Sommaire de la fiche">
              <span className="profile-toc-label">Dans cette fiche</span>
              <ul>
                {prenom.origin && <li><a href="#origine">Origine</a></li>}
                {prenom.history && <li><a href="#histoire">Histoire</a></li>}
                {prenom.usage && <li><a href="#usages">Variantes & usages</a></li>}
                {prenom.symbolic_associations.length > 0 && <li><a href="#symbolique">Symbolique</a></li>}
              </ul>
            </nav>
          )}

          <div className={aDesRubriques ? "profile-layout" : "profile-layout profile-layout-empty"}>
            <div className="profile-sections">
              {prenom.origin && (
                <section className="profile-section" id="origine">
                  <div className="profile-section-heading">
                    <span className="profile-section-kicker">Les racines du prénom</span>
                    <h2>Origine & signification</h2>
                  </div>
                  <p className="profile-copy">{prenom.origin}</p>
                </section>
              )}

              {prenom.history && (
                <section className="profile-section" id="histoire">
                  <div className="profile-section-heading">
                    <span className="profile-section-kicker">À travers le temps</span>
                    <h2>Son histoire</h2>
                  </div>
                  <p className="profile-copy">{prenom.history}</p>
                </section>
              )}

              {prenom.usage && (
                <section className="profile-section" id="usages">
                  <div className="profile-section-heading">
                    <span className="profile-section-kicker">D’un pays à l’autre</span>
                    <h2>Variantes & usages</h2>
                  </div>
                  <p className="profile-copy">{prenom.usage}</p>
                </section>
              )}

              {prenom.symbolic_associations.length > 0 && (
                <section className="profile-section symbolic-section" id="symbolique">
                  <div className="profile-section-heading">
                    <span className="profile-section-kicker">Regards culturels</span>
                    <h2>Symbolique & traditions</h2>
                  </div>
                  <div className="symbolic-grid">
                    {prenom.symbolic_associations.map((symbol) => (
                      <article className="symbolic-card" key={`${symbol.category}-${symbol.value}`}>
                        <span>{symbol.category}</span>
                        <h3>{symbol.value}</h3>
                        <p>{symbol.context_note}</p>
                        <small>Association symbolique ou culturelle, sans valeur scientifique ou prédictive.</small>
                      </article>
                    ))}
                  </div>
                </section>
              )}
            </div>

            <aside className="profile-aside">
              <div className="profile-note">
                <span className="profile-note-mark" aria-hidden="true">✳</span>
                <h2>À lire avec curiosité</h2>
                <p>Les textes de cette fiche sont générés par intelligence artificielle. Ils peuvent comporter des erreurs : prenez-les comme un point de départ pour votre découverte, pas comme une source de référence.</p>
              </div>
            </aside>
          </div>

          <footer className="profile-footer">
            <Link href="/prenoms">← Retour au catalogue</Link>
          </footer>
        </article>
      </div>
    </main>
  );
}
