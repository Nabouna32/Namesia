"use client";

import Link from "next/link";
import { useState } from "react";
import type { Prenom } from "@/lib/prenoms";
import styles from "./decouverte-aleatoire.module.css";

type Props = { prenoms: Prenom[] };

export function DecouverteAleatoire({ prenoms }: Props) {
  const [selection, setSelection] = useState<Prenom | null>(null);

  function decouvrir() {
    const candidats = selection && prenoms.length > 1
      ? prenoms.filter((prenom) => prenom.slug !== selection.slug)
      : prenoms;
    const index = Math.floor(Math.random() * candidats.length);
    const prochain = candidats[index];

    if (prochain) setSelection(prochain);
  }

  return (
    <div className={styles.discovery}>
      <button className={styles.button} type="button" onClick={decouvrir}>
        Surprenez-moi <span aria-hidden="true">↗</span>
      </button>
      <p className={styles.copy} aria-live="polite" aria-atomic="true">
        {selection ? (
          <>Votre prochaine découverte : <Link className={styles.result} href={`/prenoms/${selection.slug}`}>{selection.nom}</Link></>
        ) : (
          "Pas d’idée précise ? Laissez-vous guider par le hasard."
        )}
      </p>
    </div>
  );
}
