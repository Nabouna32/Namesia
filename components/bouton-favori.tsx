"use client";

import { Bouton } from "@/components/ui/bouton";
import styles from "./bouton-favori.module.css";
import { IconeMaterial } from "./icone-material";
import { useFavoris } from "./favoris-provider";

type Props = { slug: string; nom?: string; compact?: boolean; afficherErreur?: boolean };

export function BoutonFavori({ slug, nom, compact = false, afficherErreur = true }: Props) {
  const { slugs, pret, erreur, basculer } = useFavoris();
  const actif = slugs.includes(slug);
  const action = actif ? "Retirer des favoris" : "Ajouter aux favoris";
  const nomAccessible = nom ?? "ce prénom";

  return (
    <div className={compact ? `${styles.container} ${styles.compactContainer}` : styles.container}>
      <Bouton
        variante="outlined"
        taille={compact ? "icon" : "standard"}
        ariaLabel={compact ? pret ? `${action} : ${nomAccessible}` : `Chargement des favoris pour ${nomAccessible}` : undefined}
        ariaPressed={actif}
        disabled={!pret}
        onClick={() => basculer(slug)}
      >
        <span aria-hidden="true"><IconeMaterial name={actif ? "favorite-filled" : "favorite"} size={compact ? 24 : 18} /></span>
        {!compact && (pret ? action : "Chargement…")}
      </Bouton>
      {erreur && afficherErreur && (
        <p className={styles.error} role="alert">
          Le stockage des favoris est indisponible ou contient des données illisibles. Vérifiez les paramètres de votre navigateur.
        </p>
      )}
    </div>
  );
}
