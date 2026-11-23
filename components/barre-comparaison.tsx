"use client";

import Link from "next/link";
import type { PrenomIndex } from "@/lib/prenoms";
import styles from "./barre-comparaison.module.css";

type Props = {
  prenoms: Pick<PrenomIndex, "slug" | "nom">[];
  onRetirer: (slug: string) => void;
  onEffacer: () => void;
};

export function BarreComparaison({ prenoms, onRetirer, onEffacer }: Props) {
  if (prenoms.length === 0) return null;

  const slugs = prenoms.map((prenom) => prenom.slug);

  return (
    <div className={styles.bar}>
      <ul className="compare-selected-list" aria-label="Prénoms sélectionnés pour la comparaison">
        {prenoms.map((prenom) => (
          <li key={prenom.slug}>
            <button
              className="compare-selected-item"
              type="button"
              aria-label={`Retirer ${prenom.nom} de la comparaison`}
              onClick={() => onRetirer(prenom.slug)}
            >
              {prenom.nom}<span aria-hidden="true">×</span>
            </button>
          </li>
        ))}
      </ul>
      <span role="status" aria-live="polite">{prenoms.length} / 3 prénoms pour la comparaison</span>
      <div className={styles.actions}>
        <button type="button" onClick={onEffacer}>Effacer</button>
        {prenoms.length >= 2 && (
          <Link className={styles.link} href={`/comparer?prenoms=${slugs.map(encodeURIComponent).join(",")}`}>
            Comparer les {prenoms.length} prénoms
          </Link>
        )}
      </div>
    </div>
  );
}
