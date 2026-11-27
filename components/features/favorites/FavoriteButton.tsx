"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/material3/Button";
import { IconButton } from "@/components/material3/IconButton";
import { Snackbar } from "@/components/material3/Snackbar";
import { Icon } from "@/components/material3/Icon";
import { useFavorites } from "@/components/features/favorites/FavoritesProvider";
import styles from "./FavoriteButton.module.css";

type Props = { slug: string; name: string };

export function FavoriteButton({ slug, name }: Props) {
  const pathname = usePathname();
  const { slugs, authenticated, ready, error, basculer } = useFavorites();
  const [limiteAtteinte, setLimiteAtteinte] = useState(false);
  const [ajoutAnnulable, setAjoutAnnulable] = useState(false);
  const [busy, setBusy] = useState(false);
  const selected = slugs.includes(slug);
  const action = selected ? "Retirer des favoris" : "Ajouter aux favoris";

  async function basculerFavori() {
    setBusy(true);
    const resultat = await basculer(slug);
    setBusy(false);
    setLimiteAtteinte(resultat === "limite");
    setAjoutAnnulable(resultat === "ajoute");
  }

  async function annulerAjout() {
    if (slugs.includes(slug)) await basculer(slug);
    setAjoutAnnulable(false);
  }

  if (!authenticated) {
    return (
      <div className={styles.container}>
        {ready ? (
          <Button
            variant="outlined"
            href={`/compte?redirect=${encodeURIComponent(pathname || "/")}`}
          >
            <Icon name="favorite" size={18} />
            Se connecter pour enregistrer
          </Button>
        ) : (
          <Button variant="outlined" disabled>
            Vérification du compte…
          </Button>
        )}
        <p className={styles.help}>Les favoris sont conservés dans votre compte et synchronisés entre vos appareils.</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Button
        variant="outlined"
        aria-label={`${action} : ${name}`}
        aria-pressed={selected}
        disabled={!ready || busy}
        onClick={() => void basculerFavori()}
      >
        <Icon name={selected ? "favorite-filled" : "favorite"} size={18} />
        {busy ? "Enregistrement…" : action}
      </Button>
      {ajoutAnnulable && (
        <Snackbar
          severity="success"
          action={<Button variant="text" onClick={() => void annulerAjout()}>Annuler</Button>}
          dismissAction={<IconButton label="Fermer le message" onClick={() => setAjoutAnnulable(false)}><Icon name="close" size={24} /></IconButton>}
        >
          {name} ajouté aux favoris.
        </Snackbar>
      )}
      {limiteAtteinte && (
        <Snackbar severity="warning">
          Vous avez atteint la limite de 10 000 favoris. Retirez-en un avant d’en ajouter un autre.
        </Snackbar>
      )}
      {error && (
        <p className={styles.error} role="alert">
          Le service des favoris est momentanément indisponible. Vos modifications ne sont pas confirmées.
        </p>
      )}
    </div>
  );
}
