import Link from "next/link";
import type { NameIndexEntry } from "@/lib/names";
import styles from "./FeaturedNames.module.css";
import { GenderIcon } from "@/components/features/names/GenderIcon";
import { Icon } from "@/components/material3/Icon";
import { Card } from "@/components/material3/Card";

type Props = { prenoms: NameIndexEntry[] };

export function FeaturedNames({ prenoms }: Props) {
  return (
    <div className="featured-grid">
      {prenoms.map((prenom) => (
        <article className={styles.item} key={prenom.slug}>
          <Card as={Link} variant="elevated" interactive className="featured-card" href={`/prenoms/${prenom.slug}`}>
            <span className="featured-letter">{prenom.initial}</span>
            <span className="featured-bottom">
              <span className="featured-name">
                <strong>{prenom.name}</strong>
                <GenderIcon className={styles.gender} gender={prenom.gender} />
              </span>
              <span className="featured-action">Découvrir <b><Icon name="arrow-up-right" size={18} /></b></span>
            </span>
          </Card>
        </article>
      ))}
    </div>
  );
}
