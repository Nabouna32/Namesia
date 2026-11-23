"use client";

import Link from "next/link";
import type { PrenomIndex } from "@/lib/prenoms";
import { useHistorique } from "@/components/historique-provider";
import styles from "./historique-prenoms.module.css";

export function HistoriquePrenoms({ prenoms }: { prenoms: PrenomIndex[] }) {
  const { slugs, effacer } = useHistorique();
  if (slugs.length === 0) return null;

  const index = new Map(prenoms.map((prenom) => [prenom.slug, prenom] as const));
  const recentes = slugs.flatMap((slug) => {
    const prenom = index.get(slug);
    return prenom ? [prenom] : [];
  });

  return (
    <section className={styles.section} aria-labelledby="historique-title">
      <div className="container">
        <div className={styles.heading}>
          <div>
            <span className="eyebrow">Reprendre la découverte</span>
            <h2 id="historique-title">Vos dernières fiches</h2>
          </div>
          <button className={styles.clear} type="button" onClick={effacer}>
            Effacer l’historique
          </button>
        </div>
        {recentes.length > 0 ? (
          <>
            <div className="name-grid">
              {recentes.map((prenom) => (
                <Link className="name-card" href={`/prenoms/${prenom.slug}`} key={prenom.slug}>
                  <span className="name-initial">{prenom.lettre}</span>
                  <span>
                    <strong>{prenom.nom}</strong>
                    <small>{prenom.genre}</small>
                  </span>
                  <span className="card-arrow" aria-hidden="true">↗</span>
                </Link>
              ))}
            </div>
            <p className={styles.note}>Cet historique reste en mémoire pendant cette session et disparaît au rechargement.</p>
          </>
        ) : (
          <p className={styles.note}>Aucune des fiches consultées récemment n’est actuellement publiée.</p>
        )}
      </div>
    </section>
  );
}
