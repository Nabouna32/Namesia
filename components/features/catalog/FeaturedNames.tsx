import Link from "next/link";
import type { NameIndexEntry } from "@/lib/names";
import styles from "./FeaturedNames.module.css";
import { GenderIcon } from "@/components/features/names/GenderIcon";
import { Icon } from "@/components/material3/Icon";
import { Card } from "@/components/material3/Card";

type Props = { names: NameIndexEntry[] };

export function FeaturedNames({ names }: Props) {
  return (
    <div className={styles.grid}>
      {names.map((name) => (
        <article className={styles.item} key={name.slug}>
          <Card as={Link} variant="elevated" interactive className={styles.card} href={`/prenoms/${name.slug}`}>
            <span className={styles.letter} aria-hidden="true">{name.initial}</span>
            <span className={styles.bottom}>
              <span className={styles.name}>
                <strong>{name.name}</strong>
                <GenderIcon className={styles.gender} gender={name.gender} />
              </span>
              <span className={styles.action}>Découvrir <b><Icon name="arrow-up-right" size={18} /></b></span>
            </span>
          </Card>
        </article>
      ))}
    </div>
  );
}
