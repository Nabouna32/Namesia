"use client";

import Link from "next/link";
import type { PrenomIndex } from "@/lib/prenoms";
import styles from "./barre-comparaison.module.css";
import { ListeSelectionComparaison } from "@/components/ui/liste-selection-comparaison";

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
      <ListeSelectionComparaison
        prenoms={prenoms}
        label="Prénoms sélectionnés pour la comparaison"
        onRetirer={onRetirer}
      />
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
