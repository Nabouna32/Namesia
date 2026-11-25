"use client";

import Link from "next/link";
import type { NameIndexEntry } from "@/lib/names";
import { useHistory } from "@/components/features/history/HistoryProvider";
import styles from "./RecentNames.module.css";
import { GenderIcon } from "@/components/features/names/GenderIcon";
import { Icon } from "@/components/material3/Icon";
import { Button } from "@/components/material3/Button";
import { IconButton } from "@/components/material3/IconButton";
import { Card } from "@/components/material3/Card";

export function RecentNames({ names }: { names: NameIndexEntry[] }) {
  const { slugs, removeVisit, clearHistory, error } = useHistory();
  if (slugs.length === 0 && !error) return null;

  const index = new Map(names.map((name) => [name.slug, name] as const));
  const recentNames = slugs.flatMap((slug) => {
    const name = index.get(slug);
    return name ? [name] : [];
  });

  return (
    <section className={styles.section} aria-labelledby="historique-title">
      <div className="container">
        <div className={styles.heading}>
          <div>
            <span className="eyebrow">Reprendre la découverte</span>
            <h2 id="historique-title">Vos dernières fiches</h2>
          </div>
          {(slugs.length > 0 || error) && (
            <Button variant="text" type="button" onClick={clearHistory}>
              {error ? "Réinitialiser l’historique" : "Effacer l’historique"}
            </Button>
          )}
        </div>
        {error && (
          <p className={styles.note} role="alert">
            L’historique est indisponible. Réinitialisez-le pour réessayer avec une session propre.
          </p>
        )}
        {recentNames.length > 0 ? (
          <>
            <div className={styles.grid}>
              {recentNames.map((name) => (
                <article className={styles.card} key={name.slug}>
                  <Card as={Link} variant="elevated" interactive className={`name-card ${styles.link}`} href={`/prenoms/${name.slug}`}>
                    <span className="name-initial">{name.initial}</span>
                    <span>
                      <strong>{name.name}</strong>
                      <GenderIcon gender={name.gender} />
                    </span>
                    <span className="card-arrow" aria-hidden="true"><Icon name="arrow-up-right" /></span>
                  </Card>
                  <IconButton
                    label={`Retirer ${name.name} de l’historique`}
                    onClick={() => removeVisit(name.slug)}
                  >
                    <span aria-hidden="true"><Icon name="close" size={24} /></span>
                  </IconButton>
                </article>
              ))}
            </div>
            <p className={styles.note}>Cet historique est propre à cet onglet : il est conservé lors des rechargements et supprimé à sa fermeture.</p>
          </>
        ) : !error ? (
          <p className={styles.note}>Aucune des fiches consultées récemment n’est actuellement publiée.</p>
        ) : null}
      </div>
    </section>
  );
}
