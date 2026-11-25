import Link from "next/link";
import type { NameIndexEntry } from "@/lib/names";
import type { ContexteRetourNavigation } from "@/lib/navigation-prenoms";
import { creerUrlFicheDepuisContexte } from "@/lib/navigation-prenoms";
import styles from "./RelatedNames.module.css";
import { GenderIcon } from "@/components/features/names/GenderIcon";
import { Icon } from "@/components/material3/Icon";
import { Card } from "@/components/material3/Card";

type Props = { names: NameIndexEntry[]; returnContext?: ContexteRetourNavigation | null };

export function RelatedNames({ names, returnContext = null }: Props) {
  return (
    <div className={styles.grid}>
      {names.map((name) => (
        <Card as={Link} variant="elevated" interactive className="name-card" href={creerUrlFicheDepuisContexte(name.slug, returnContext)} key={name.slug}>
            <span className="name-initial">{name.initial}</span>
            <span>
              <strong>{name.name}</strong>
              <GenderIcon gender={name.gender} />
            </span>
            <span className="card-arrow" aria-hidden="true"><Icon name="arrow-up-right" /></span>
        </Card>
      ))}
    </div>
  );
}
