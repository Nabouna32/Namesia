import Link from "next/link";
import { FavoriteButton } from "@/components/features/favorites/FavoriteButton";
import type { PrenomIndex } from "@/lib/prenoms";
import type { ContexteRetourNavigation } from "@/lib/navigation-prenoms";
import { creerUrlFicheDepuisContexte } from "@/lib/navigation-prenoms";
import styles from "./RelatedNames.module.css";
import { Icon } from "@/components/material3/Icon";
import { Card } from "@/components/material3/Card";

type Props = { prenoms: PrenomIndex[]; contexteRetour?: ContexteRetourNavigation | null };

export function RelatedNames({ prenoms, contexteRetour = null }: Props) {
  return (
    <div className={styles.grid}>
      {prenoms.map((prenom) => (
        <article className={styles.card} key={prenom.slug}>
          <Card as={Link} variant="elevated" interactive className="name-card" href={creerUrlFicheDepuisContexte(prenom.slug, contexteRetour)}>
            <span className="name-initial">{prenom.lettre}</span>
            <span>
              <strong>{prenom.nom}</strong>
              <small>{prenom.genre}</small>
            </span>
            <span className="card-arrow" aria-hidden="true"><Icon name="arrow-up-right" /></span>
          </Card>
          <FavoriteButton slug={prenom.slug} name={prenom.nom} compact showError={false} />
        </article>
      ))}
    </div>
  );
}
