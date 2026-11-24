"use client";

import Link from "next/link";
import { useState } from "react";
import type { PrenomIndex } from "@/lib/prenoms";
import { BoutonFavori } from "@/components/bouton-favori";
import { Bouton } from "@/components/ui/bouton";
import styles from "./decouverte-aleatoire.module.css";
import { IconeMaterial } from "./icone-material";

type Props = { prenoms: PrenomIndex[] };

export function DecouverteAleatoire({ prenoms }: Props) {
  const [selection, setSelection] = useState<PrenomIndex | null>(null);

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
      <Bouton variante="outlined" onClick={decouvrir}>
        Surprenez-moi <span aria-hidden="true"><IconeMaterial name="shuffle" size={20} /></span>
      </Bouton>
      <div className={styles.copy} aria-live="polite" aria-atomic="true">
        {selection ? (
          <span className={styles.resultLine}>
            <span>Votre prochaine découverte : <Link className={styles.result} href={`/prenoms/${selection.slug}`}>{selection.nom}</Link></span>
            <BoutonFavori slug={selection.slug} nom={selection.nom} compact afficherErreur={false} />
          </span>
        ) : (
          "Pas d’idée précise ? Laissez-vous guider par le hasard."
        )}
      </div>
    </div>
  );
}
