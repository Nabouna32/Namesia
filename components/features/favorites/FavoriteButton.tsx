"use client";

import { Button } from "@/components/material3/Button";
import { Icon } from "@/components/material3/Icon";
import { useFavorites } from "@/components/features/favorites/FavoritesProvider";
import styles from "./FavoriteButton.module.css";

type Props = { slug: string; name: string };

export function FavoriteButton({ slug, name }: Props) {
  const { slugs, pret, erreur, basculer } = useFavorites();
  const selected = slugs.includes(slug);
  const action = selected ? "Retirer des favoris" : "Ajouter aux favoris";
  const label = pret ? `${action} : ${name}` : `Chargement des favoris pour ${name}`;

  return (
    <div className={styles.container}>
      <Button
        variant="outlined"
        aria-label={label}
        aria-pressed={selected}
        disabled={!pret}
        onClick={() => basculer(slug)}
      >
        <Icon name={selected ? "favorite-filled" : "favorite"} size={18} />
        {pret ? action : "Chargement…"}
      </Button>
      {erreur && (
        <p className={styles.error} role="alert">
          Le stockage des favoris est indisponible ou contient des données illisibles. Vérifiez les paramètres de votre navigateur.
        </p>
      )}
    </div>
  );
}
