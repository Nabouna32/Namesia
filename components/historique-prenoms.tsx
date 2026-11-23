"use client";

import Link from "next/link";
import type { PrenomIndex } from "@/lib/prenoms";
import { useHistorique } from "@/components/historique-provider";
import styles from "./historique-prenoms.module.css";

export function HistoriquePrenoms({ prenoms }: { prenoms: PrenomIndex[] }) {
  const { slugs, pret, erreur, effacer } = useHistorique();

  if (!pret) return null;

  const index = new Map(prenoms.map((prenom) => [prenom.slug, prenom]));
  const recentes = slugs.flatMap((slug) => {
    const prenom = index.get(slug);
    return prenom ? [prenom] : [];
  });

  if (!erreur && recentes.length === 0) return null;

  return (
    <section className={`section ${styles.section}`} aria-labelledby="historique-title">
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
        {erreur ? (
          <p className={styles.error} role="alert">
            L’historique local n’a pas pu être lu ou enregistré. Vous pouvez tenter de l’effacer pour repartir.
          </p>
        ) : (
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
            <p className={styles.note}>Les huit dernières fiches consultées sont conservées dans ce navigateur uniquement.</p>
          </>
        )}
      </div>
    </section>
  );
}
