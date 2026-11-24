"use client";

import { useState } from "react";
import { Button } from "@/components/material3/Button";
import { Snackbar } from "@/components/material3/Snackbar";
import { Icon } from "@/components/material3/Icon";
import { useFavorites } from "@/components/features/favorites/FavoritesProvider";
import styles from "./FavoriteButton.module.css";

type Props = { slug: string; name: string };

export function FavoriteButton({ slug, name }: Props) {
  const { slugs, pret, erreur, basculer } = useFavorites();
  const [limiteAtteinte, setLimiteAtteinte] = useState(false);
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
        onClick={() => setLimiteAtteinte(basculer(slug) === "limite")}
      >
        <Icon name={selected ? "favorite-filled" : "favorite"} size={18} />
        {pret ? action : "Chargement…"}
      </Button>
      {limiteAtteinte && (
        <Snackbar severity="warning">
          Vous avez atteint la limite de 10 000 favoris. Retirez-en un avant d’en ajouter un autre.
        </Snackbar>
      )}
      {erreur && (
        <p className={styles.error} role="alert">
          Le stockage des favoris est indisponible ou contient des données illisibles. Vérifiez les paramètres de votre navigateur.
        </p>
      )}
    </div>
  );
}
