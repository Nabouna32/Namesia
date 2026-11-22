import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BoutonFavori } from "@/components/bouton-favori";
import { PartagerFiche } from "@/components/partager-fiche";
import styles from "@/components/actions-fiche.module.css";
import { getAutresPrenomsDuGenre, getPrenom } from "@/lib/prenoms";
import { jsonLd } from "@/lib/json-ld";
import { siteUrl } from "@/lib/site-url";

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
    },
    twitter: {
      card: "summary_large_image",
      images: [`/prenoms/${prenom.slug}/opengraph-image`]
    }
  } : {};
}

export default async function FichePrenom({ params }: Props) {
  const { slug } = await params;
  const prenom = await getPrenom(slug);
  if (!prenom) notFound();

  const autresPrenoms = await getAutresPrenomsDuGenre(prenom.genre, prenom.slug);
  const genreAuPluriel: Record<string, string> = {
    "Féminin": "féminins",
    "Masculin": "masculins",
    "Mixte": "mixtes"
  };

  const ficheData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${prenom.nom} · Namesia`,
    description: prenom.introduction,
    url: new URL(`/prenoms/${prenom.slug}`, siteUrl).toString(),
    inLanguage: "fr-FR",
    about: { "@type": "Thing", name: prenom.nom },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Accueil", item: new URL("/", siteUrl).toString() },
        { "@type": "ListItem", position: 2, name: "Prénoms", item: new URL("/prenoms", siteUrl).toString() },
        { "@type": "ListItem", position: 3, name: prenom.nom, item: new URL(`/prenoms/${prenom.slug}`, siteUrl).toString() }
      ]
    }
  };

  const aDesRubriques = Boolean(
    prenom.origin || prenom.history || prenom.usage || prenom.symbolic_associations.length
  );

  return (
    <main id="contenu" tabIndex={-1} className="page-main profile-main">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(ficheData) }} />
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
              <div className={styles.actions}>
                <BoutonFavori slug={prenom.slug} />
                <Link className="text-link" href={`/comparer?prenoms=${encodeURIComponent(prenom.slug)}`}>
                  Comparer ce prénom <span aria-hidden="true">↗</span>
                </Link>
              </div>
              <PartagerFiche nom={prenom.nom} />
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
                {prenom.references.length > 0 && <li><a href="#references">Références</a></li>}
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

          {prenom.references.length > 0 && (
            <section className="profile-section" id="references">
              <div className="profile-section-heading">
                <span className="profile-section-kicker">Pour aller plus loin</span>
                <h2>Références consultées</h2>
              </div>
              <p className="profile-copy">Ces ressources ont été consultées lors de la rédaction. Leur présence ne signifie pas que chaque affirmation de la fiche a été vérifiée indépendamment.</p>
              <ul className="reference-list">
                {prenom.references.map((reference, index) => (
                  <li key={`${reference.url}-${index}`}>
                    <a href={reference.url} target="_blank" rel="noopener noreferrer">{reference.title}</a>
                    <span>{reference.publisher} · Rubrique : {reference.section} · Consulté le {new Date(`${reference.consulted_at}T00:00:00`).toLocaleDateString("fr-FR")}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {autresPrenoms.length > 0 && (
            <section className="profile-discovery" aria-labelledby="profile-discovery-title">
              <div className="profile-section-heading">
                <span className="profile-section-kicker">Pour prolonger la découverte</span>
                <h2 id="profile-discovery-title">D'autres prénoms {genreAuPluriel[prenom.genre] ?? "à découvrir"}</h2>
              </div>
              <div className="name-grid">
                {autresPrenoms.map((autrePrenom) => (
                  <Link className="name-card" href={`/prenoms/${autrePrenom.slug}`} key={autrePrenom.slug}>
                    <span className="name-initial">{autrePrenom.lettre}</span>
                    <span>
                      <strong>{autrePrenom.nom}</strong>
                      <small>{autrePrenom.genre}</small>
                    </span>
                    <span className="card-arrow" aria-hidden="true">↗</span>
                  </Link>
                ))}
              </div>
              <Link className="text-link" href="/prenoms">Explorer tout le catalogue <span aria-hidden="true">↗</span></Link>
            </section>
          )}

          <footer className="profile-footer">
            <Link href="/prenoms">← Retour au catalogue</Link>
          </footer>
        </article>
      </div>
    </main>
  );
}
