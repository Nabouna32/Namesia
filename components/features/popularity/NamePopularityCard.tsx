import Link from "next/link";
import { Card } from "@/components/material3/Card";
import { getNamePopularity2025, NAME_POPULARITY_2025_SOURCE_URL } from "@/lib/name-popularity";
import styles from "./NamePopularityCard.module.css";

export function NamePopularityCard({ slug }: { slug: string }) {
  const popularity = getNamePopularity2025(slug);
  if (!popularity) return null;
  const rankLabel = popularity.rank === 1
    ? popularity.gender === "Féminin" ? "1re" : "1er"
    : `${popularity.rank}e`;

  return (
    <Card as="section" variant="outlined" interactive={false} className={styles.card}>
      <div className={styles.heading}>
        <span className="eyebrow">France · 2025</span>
        <h2>Popularité du prénom</h2>
      </div>
      <div className={styles.metrics}>
        <div className={styles.metric}>
          <strong>{rankLabel}</strong>
          <span>prénom {popularity.gender.toLocaleLowerCase("fr")} le plus donné</span>
        </div>
        <div className={styles.metric}>
          <strong>{popularity.births.toLocaleString("fr-FR")}</strong>
          <span>naissances (effectif arrondi)</span>
        </div>
      </div>
      <p className={styles.source}>
        <Link href="/tendances">Voir le classement complet</Link>
        {" · "}
        <a href={NAME_POPULARITY_2025_SOURCE_URL} target="_blank" rel="noreferrer">Source Insee</a>
      </p>
    </Card>
  );
}
