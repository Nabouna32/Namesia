import Link from "next/link";
import type { PrenomIndex } from "@/lib/prenoms";
import type { ContexteRetourNavigation } from "@/lib/navigation-prenoms";
import { creerUrlFicheDepuisContexte } from "@/lib/navigation-prenoms";
import styles from "./RelatedNames.module.css";
import { GenderIcon } from "@/components/features/names/GenderIcon";
import { Icon } from "@/components/material3/Icon";
import { Card } from "@/components/material3/Card";

type Props = { prenoms: PrenomIndex[]; contexteRetour?: ContexteRetourNavigation | null };

export function RelatedNames({ prenoms, contexteRetour = null }: Props) {
  return (
    <div className={styles.grid}>
      {prenoms.map((prenom) => (
        <Card as={Link} variant="elevated" interactive className="name-card" href={creerUrlFicheDepuisContexte(prenom.slug, contexteRetour)} key={prenom.slug}>
            <span className="name-initial">{prenom.lettre}</span>
            <span>
              <strong>{prenom.nom}</strong>
              <GenderIcon gender={prenom.genre} />
            </span>
            <span className="card-arrow" aria-hidden="true"><Icon name="arrow-up-right" /></span>
        </Card>
      ))}
    </div>
  );
}
