"use client";

import styles from "./ComparisonBar.module.css";
import { ComparisonSelection } from "@/components/features/comparison/ComparisonSelection";
import { Button } from "@/components/material3/Button";

type Props = {
  names: { slug: string; name: string }[];
  onRemove: (slug: string) => void;
  onClear: () => void;
};

export function ComparisonBar({ names, onRemove, onClear }: Props) {
  if (names.length === 0) return null;

  const slugs = names.map((name) => name.slug);

  return (
    <div className={styles.bar}>
      <ComparisonSelection
        names={names}
        label="Prénoms sélectionnés pour la comparaison"
        onRemove={onRemove}
      />
      <span role="status" aria-live="polite">{names.length} / 3 prénoms pour la comparaison}</span>
      <div className={styles.actions}>
        <Button variant="text" type="button" onClick={onClear}>Effacer</Button>
        {names.length >= 2 && (
          <Button href={`/comparer?prenoms=${slugs.map(encodeURIComponent).join(",")}`} variant="filled">
            Comparer les {names.length} prénoms
          </Button>
        )}
      </div>
    </div>
  );
}
