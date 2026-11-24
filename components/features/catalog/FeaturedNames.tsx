import Link from "next/link";
import type { PrenomIndex } from "@/lib/prenoms";
import styles from "./FeaturedNames.module.css";
import { GenreIcon } from "@/components/features/names/GenreIcon";
import { Icon } from "@/components/material3/Icon";
import { Card } from "@/components/material3/Card";

type Props = { prenoms: PrenomIndex[] };

export function FeaturedNames({ prenoms }: Props) {
  return (
    <div className="featured-grid">
      {prenoms.map((prenom) => (
        <article key={prenom.slug}>
          <Card as={Link} variant="elevated" interactive className="featured-card" href={`/prenoms/${prenom.slug}`}>
            <span className="featured-letter">{prenom.lettre}</span>
            <span className="featured-bottom">
              <span className="featured-name">
                <strong>{prenom.nom}</strong>
                <GenreIcon className={styles.gender} genre={prenom.genre} />
              </span>
              <span className="featured-action">Découvrir <b><Icon name="arrow-up-right" size={18} /></b></span>
            </span>
          </Card>
        </article>
      ))}
    </div>
  );
}
