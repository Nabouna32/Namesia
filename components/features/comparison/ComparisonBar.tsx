"use client";

import type { PrenomIndex } from "@/lib/prenoms";
import styles from "./ComparisonBar.module.css";
import { ComparisonSelection } from "@/components/features/comparison/ComparisonSelection";
import { Button } from "@/components/material3/Button";

type Props = {
  prenoms: Pick<PrenomIndex, "slug" | "nom">[];
  onRetirer: (slug: string) => void;
  onEffacer: () => void;
};

export function ComparisonBar({ prenoms, onRetirer, onEffacer }: Props) {
  if (prenoms.length === 0) return null;

  const slugs = prenoms.map((prenom) => prenom.slug);

  return (
    <div className={styles.bar}>
      <ComparisonSelection
        names={prenoms.map((prenom) => ({ slug: prenom.slug, name: prenom.nom }))}
        label="Prénoms sélectionnés pour la comparaison"
        onRemove={onRetirer}
      />
      <span role="status" aria-live="polite">{prenoms.length} / 3 prénoms pour la comparaison</span>
      <div className={styles.actions}>
        <Button variant="text" type="button" onClick={onEffacer}>Effacer</Button>
        {prenoms.length >= 2 && (
          <Button href={`/comparer?prenoms=${slugs.map(encodeURIComponent).join(",")}`} variant="filled">
            Comparer les {prenoms.length} prénoms
          </Button>
        )}
      </div>
    </div>
  );
}
