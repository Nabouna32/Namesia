import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FavoriteButton } from "@/components/features/favorites/FavoriteButton";
import { GenderIcon } from "@/components/features/names/GenderIcon";
import { Button } from "@/components/material3/Button";
import { Card } from "@/components/material3/Card";
import { Icon } from "@/components/material3/Icon";
import { categoryTone } from "@/lib/category-color";
import { RelatedNames } from "@/components/features/catalog/RelatedNames";
import { ShareProfile } from "@/components/features/sharing/ShareLink";
import { NamePopularityCard } from "@/components/features/popularity/NamePopularityCard";
import styles from "@/components/features/profile/ProfileActions.module.css";
import { getOtherNamesByGender, getNameBySlug, type NameGender } from "@/lib/names";
import { jsonLd } from "@/lib/json-ld";
import { siteUrl } from "@/lib/site-url";
import {
  creerUrlRetourNavigation,
  lireContexteRetourNavigation
} from "@/lib/navigation-prenoms";

type ParametreUrl = string | string[] | undefined;
type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    retour_vue?: ParametreUrl;
    retour_q?: ParametreUrl;
    retour_genre?: ParametreUrl;
    retour_lettre?: ParametreUrl;
    retour_tri?: ParametreUrl;
    retour_limite?: ParametreUrl;
    retour_prenoms?: ParametreUrl;
  }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const name = await getNameBySlug(slug);
  const imageUrl = new URL("/opengraph-image", siteUrl).toString();
  return name ? {
    title: name.name,
    description: name.introduction,
    alternates: { canonical: `/prenoms/${name.slug}` },
    openGraph: {
      type: "article",
      locale: "fr_FR",
      siteName: "Namesia",
      title: name.name,
      description: name.introduction,
      url: `/prenoms/${name.slug}`,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: "Namesia — Le sens derrière chaque prénom" }]
    },
    twitter: {
      card: "summary_large_image",
      images: [imageUrl]
    }
  } : {};
}

export default async function NameProfilePage({ params, searchParams }: Props) {
  const { slug } = await params;
  const name = await getNameBySlug(slug);
  if (!name) notFound();

  const [returnParams, relatedNames] = await Promise.all([
    searchParams,
    getOtherNamesByGender(name.gender, name.slug)
  ]);
  const returnContext = lireContexteRetourNavigation(returnParams);
  const urlRetour = creerUrlRetourNavigation(returnParams);
  const libelleRetour = returnContext?.vue === "favoris"
    ? "Favoris"
    : returnContext?.vue === "comparateur" ? "Comparateur" : "Prénoms";
  const texteRetour = returnContext?.vue === "favoris"
    ? "Retour aux favoris"
    : returnContext?.vue === "comparateur" ? "Retour au comparateur" : "Retour au catalogue";
  const genderPlural: Record<NameGender, string> = {
    "Féminin": "féminins",
    "Masculin": "masculins",
    "Mixte": "mixtes",
    "Genre non renseigné": "à découvrir"
  };

  const ficheData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${name.name} · Namesia`,
    description: name.introduction,
    url: new URL(`/prenoms/${name.slug}`, siteUrl).toString(),
    inLanguage: "fr-FR",
    about: { "@type": "Thing", name: name.name },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Accueil", item: new URL("/", siteUrl).toString() },
        { "@type": "ListItem", position: 2, name: "Prénoms", item: new URL("/prenoms", siteUrl).toString() },
        { "@type": "ListItem", position: 3, name: name.name, item: new URL(`/prenoms/${name.slug}`, siteUrl).toString() }
      ]
    }
  };

  const aDesRubriques = Boolean(
    name.origin || name.history || name.usage || name.symbolic_associations.length
  );

  return (
    <main id="contenu" tabIndex={-1} className="page-main profile-main">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(ficheData) }} />
      <div className="container profile">
        <nav className="breadcrumb" aria-label="Fil d’Ariane">
          <ol>
            <li><Link href="/">Accueil</Link></li>
            <li><Link href={urlRetour}>{libelleRetour}</Link></li>
            <li aria-current="page">{name.name}</li>
          </ol>
        </nav>

        <article>
          <header className="profile-hero">
            <div className="profile-hero-copy">
              <span className="eyebrow">Découvrir un prénom</span>
              <h1>{name.name}<span>.</span></h1>
              <p className="profile-lead">{name.introduction}</p>
              <div className="profile-tags">
                <span className="profile-tag"><GenderIcon gender={name.gender} /></span>
                <span className="profile-tag">Lettre {name.initial}</span>
              </div>
              <div className={styles.actions}>
                <FavoriteButton slug={name.slug} name={name.name} />
                <Button href={`/comparer?prenoms=${encodeURIComponent(name.slug)}`} variant="outlined">
                  <Icon name="compare-arrows" size={18} />
                  Comparer ce prénom
                </Button>
              </div>
              <ShareProfile name={name.name} />
            </div>
            <div className="profile-monogram" aria-hidden="true">{name.initial}</div>
          </header>

          <NamePopularityCard slug={name.slug} name={name.name} gender={name.gender} />

          {aDesRubriques && (
            <nav className="profile-toc" aria-label="Sommaire de la fiche">
              <span className="profile-toc-label">Dans cette fiche</span>
              <ul>
                {name.origin && <li><a href="#origine">Origine</a></li>}
                {name.history && <li><a href="#histoire">Histoire</a></li>}
                {name.usage && <li><a href="#usages">Variantes & usages</a></li>}
                {name.symbolic_associations.length > 0 && <li><a href="#symbolique">Symbolique</a></li>}
              </ul>
            </nav>
          )}

          <div className={aDesRubriques ? "profile-layout" : "profile-layout profile-layout-empty"}>
            <div className="profile-sections">
              {name.origin && (
                <section className="profile-section" id="origine">
                  <div className="profile-section-heading">
                    <span className="profile-section-kicker">Les racines du prénom</span>
                    <h2>Origine & signification</h2>
                  </div>
                  <p className="profile-copy">{name.origin}</p>
                </section>
              )}

              {name.history && (
                <section className="profile-section" id="histoire">
                  <div className="profile-section-heading">
                    <span className="profile-section-kicker">À travers le temps</span>
                    <h2>Son histoire</h2>
                  </div>
                  <p className="profile-copy">{name.history}</p>
                </section>
              )}

              {name.usage && (
                <section className="profile-section" id="usages">
                  <div className="profile-section-heading">
                    <span className="profile-section-kicker">D’un pays à l’autre</span>
                    <h2>Variantes & usages</h2>
                  </div>
                  <p className="profile-copy">{name.usage}</p>
                </section>
              )}

              {name.symbolic_associations.length > 0 && (
                <section className="profile-section symbolic-section" id="symbolique">
                  <div className="profile-section-heading">
                    <span className="profile-section-kicker">Regards culturels</span>
                    <h2>Symbolique & traditions</h2>
                  </div>
                  <div className="symbolic-grid">
                    {name.symbolic_associations.map((symbol) => (
                      <article className="symbolic-card" data-category-tone={categoryTone(symbol.category)} key={`${symbol.category}-${symbol.value}`}>
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
              <Card as="div" variant="outlined" interactive={false} className="profile-note">
                <div className="profile-note-heading">
                  <Icon name="info" size={24} />
                  <h2>À lire avec curiosité</h2>
                </div>
                <p>Les textes de cette fiche sont générés par intelligence artificielle. Ils peuvent comporter des erreurs : prenez-les comme un point de départ pour votre découverte, pas comme une source de référence.</p>
              </Card>
            </aside>
          </div>

          {relatedNames.length > 0 && (
            <Card as="section" variant="outlined" interactive={false} className="profile-discovery" aria-labelledby="profile-discovery-title">
              <div className="profile-section-heading">
                <span className="profile-section-kicker">Pour prolonger la découverte</span>
                <h2 id="profile-discovery-title">D'autres prénoms {genderPlural[name.gender]}</h2>
              </div>
              <RelatedNames names={relatedNames} returnContext={returnContext} />
              <Link className="text-link" href="/prenoms">Explorer tout le catalogue <Icon name="chevron-right" size={18} /></Link>
            </Card>
          )}

          <footer className="profile-footer">
            <Link href={urlRetour}><Icon name="chevron-left" size={18} /> {texteRetour}</Link>
          </footer>
        </article>
      </div>
    </main>
  );
}
