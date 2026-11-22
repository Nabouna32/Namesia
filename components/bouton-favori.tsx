"use client";

import styles from "./bouton-favori.module.css";
import { useFavoris } from "./favoris-provider";

type Props = { slug: string };

export function BoutonFavori({ slug }: Props) {
  const { slugs, pret, basculer } = useFavoris();
  const actif = slugs.includes(slug);

  return (
    <button
      className={styles.button}
      type="button"
      aria-pressed={actif}
      disabled={!pret}
      onClick={() => basculer(slug)}
    >
      <span aria-hidden="true">{actif ? "♥" : "♡"}</span>
      {pret ? actif ? "Dans vos favoris" : "Ajouter aux favoris" : "Chargement…"}
    </button>
  );
}
