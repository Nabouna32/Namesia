import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/material3/Card";
import { Icon } from "@/components/material3/Icon";
import { getPrenomsIndex } from "@/lib/prenoms";
import {
  NAME_POPULARITY_2025,
  NAME_POPULARITY_2025_SOURCE_URL
} from "@/lib/name-popularity";
import { jsonLd } from "@/lib/json-ld";
import { siteUrl } from "@/lib/site-url";
import styles from "./trends.module.css";

const pageTitle = "Les prénoms les plus donnés en France en 2025";
const pageDescription = "Le classement officiel des dix prénoms féminins et masculins les plus attribués en France en 2025, publié par l’Insee.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: { canonical: "/tendances" },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Namesia",
    title: pageTitle,
    description: pageDescription,
    url: "/tendances"
  }
};

export default async function NameTrendsPage() {
  const publishedNames = await getPrenomsIndex();
  const publishedSlugs = new Set(publishedNames.map((name) => name.slug));
  const femaleNames = NAME_POPULARITY_2025.filter((entry) => entry.gender === "Féminin");
  const maleNames = NAME_POPULARITY_2025.filter((entry) => entry.gender === "Masculin");

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: pageTitle,
    description: pageDescription,
    url: new URL("/tendances", siteUrl).toString(),
    inLanguage: "fr-FR",
    mainEntity: [femaleNames, maleNames].map((entries) => ({
      "@type": "ItemList",
      numberOfItems: entries.length,
      itemListElement: entries.map((entry) => ({
        "@type": "ListItem",
        position: entry.rank,
        item: {
          "@type": "Thing",
          name: entry.name,
          ...(publishedSlugs.has(entry.slug) ? { url: new URL(`/prenoms/${entry.slug}`, siteUrl).toString() } : {})
        }
      }))
    }))
  };

  function renderRanking(entries: typeof femaleNames) {
    return (
      <ol className={styles.ranking}>
        {entries.map((entry) => {
          const content = (
            <>
              <span className={styles.rank}>{entry.rank}</span>
              <span className={styles.name}>
                <strong>{entry.name}</strong>
                {!publishedSlugs.has(entry.slug) && <span>Fiche non publiée sur Namesia</span>}
              </span>
              <span className={styles.births}>{entry.births.toLocaleString("fr-FR")}</span>
            </>
          );

          return (
            <li key={entry.slug}>
              {publishedSlugs.has(entry.slug) ? (
                <Card as={Link} href={`/prenoms/${entry.slug}`} variant="outlined" interactive className={styles.entry}>
                  {content}
                </Card>
              ) : (
                <Card as="div" variant="outlined" interactive={false} className={styles.entry}>
                  {content}
                </Card>
              )}
            </li>
          );
        })}
      </ol>
    );
  }

  return (
    <main id="contenu" tabIndex={-1} className="page-main">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(structuredData) }} />
      <div className={`container ${styles.page}`}>
        <span className="eyebrow">Données nationales · Insee</span>
        <h1>Les prénoms les plus donnés <em>en 2025.</em></h1>
        <p className="page-intro">
          En France, Louise et Gabriel arrivent en tête des prénoms attribués en 2025. Voici les dix premiers de chaque classement, avec les effectifs publiés par l’Insee.
        </p>

        <div className={styles.rankings}>
          <section aria-labelledby="female-ranking-title">
            <div className={styles.sectionHeading}>
              <h2 id="female-ranking-title">Prénoms féminins</h2>
              <span>Top 10</span>
            </div>
            {renderRanking(femaleNames)}
          </section>
          <section aria-labelledby="male-ranking-title">
            <div className={styles.sectionHeading}>
              <h2 id="male-ranking-title">Prénoms masculins</h2>
              <span>Top 10</span>
            </div>
            {renderRanking(maleNames)}
          </section>
        </div>

        <p className={styles.source}>
          Les effectifs sont arrondis au multiple de cinq. Les fiches Namesia disponibles sont accessibles depuis leur ligne.
          {" "}
          <a href={NAME_POPULARITY_2025_SOURCE_URL} target="_blank" rel="noreferrer">
            Consulter l’étude de l’Insee <Icon name="arrow-up-right" size={16} />
          </a>
        </p>
        <p className={styles.backLink}>
          <Link href="/prenoms">Explorer le catalogue des prénoms</Link>
        </p>
      </div>
    </main>
  );
}
