"use client";

import { Button } from "@/components/material3/Button";
import { IconButton } from "@/components/material3/IconButton";
import { Icon } from "@/components/material3/Icon";
import { useFavorites } from "@/components/features/favorites/FavoritesProvider";
import styles from "./FavoriteButton.module.css";

type Props = { slug: string; name?: string; compact?: boolean; showError?: boolean };

export function FavoriteButton({ slug, name, compact = false, showError = true }: Props) {
  const { slugs, pret, erreur, basculer } = useFavorites();
  const selected = slugs.includes(slug);
  const action = selected ? "Retirer des favoris" : "Ajouter aux favoris";
  const accessibleName = name ?? "ce prénom";
  const label = pret ? `${action} : ${accessibleName}` : `Chargement des favoris pour ${accessibleName}`;

  return (
    <div className={compact ? `${styles.container} ${styles.compactContainer}` : styles.container}>
      {compact ? (
        <IconButton label={label} pressed={selected} disabled={!pret} onClick={() => basculer(slug)}>
          <Icon name={selected ? "favorite-filled" : "favorite"} size={24} />
        </IconButton>
      ) : (
        <Button
          variant="outlined"
          aria-pressed={selected}
          disabled={!pret}
          onClick={() => basculer(slug)}
        >
          <Icon name={selected ? "favorite-filled" : "favorite"} size={18} />
          {pret ? action : "Chargement…"}
        </Button>
      )}
      {erreur && showError && (
        <p className={styles.error} role="alert">
          Le stockage des favoris est indisponible ou contient des données illisibles. Vérifiez les paramètres de votre navigateur.
        </p>
      )}
    </div>
  );
}
