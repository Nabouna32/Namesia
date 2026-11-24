"use client";

import type { PrenomIndex } from "@/lib/prenoms";
import styles from "./barre-comparaison.module.css";
import { ComparisonSelection } from "@/components/ui/ComparisonSelection";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import buttonStyles from "@/components/ui/Button.module.css";

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
      <ComparisonSelection
        names={prenoms.map((prenom) => ({ slug: prenom.slug, name: prenom.nom }))}
        label="Prénoms sélectionnés pour la comparaison"
        onRemove={onRetirer}
      />
      <span role="status" aria-live="polite">{prenoms.length} / 3 prénoms pour la comparaison</span>
      <div className={styles.actions}>
        <Button variant="text" type="button" onClick={onEffacer}>Effacer</Button>
        {prenoms.length >= 2 && (
          <Link className={[buttonStyles.button, buttonStyles.filled].join(" ")} href={`/comparer?prenoms=${slugs.map(encodeURIComponent).join(",")}`}>
            Comparer les {prenoms.length} prénoms
          </Link>
        )}
      </div>
    </div>
  );
}
