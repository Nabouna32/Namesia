"use client";

import styles from "./bouton-favori.module.css";
import { useFavoris } from "./favoris-provider";

type Props = { slug: string; afficherErreur?: boolean };

export function BoutonFavori({ slug, afficherErreur = true }: Props) {
  const { slugs, pret, erreur, basculer } = useFavoris();
  const actif = slugs.includes(slug);

  return (
    <div className={styles.container}>
    <button
      className={styles.button}
      type="button"
      aria-pressed={actif}
      disabled={!pret}
      onClick={() => basculer(slug)}
    >
      <span aria-hidden="true">{actif ? "♥" : "♡"}</span>
      {pret ? actif ? "Retirer des favoris" : "Ajouter aux favoris" : "Chargement…"}
    </button>
    {erreur && afficherErreur && (
      <p className={styles.error} role="alert">
        Impossible d’enregistrer vos favoris. Vérifiez les paramètres de stockage de votre navigateur.
      </p>
    )}
    </div>
  );
}
