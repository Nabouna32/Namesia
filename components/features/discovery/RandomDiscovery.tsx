"use client";

import Link from "next/link";
import { useState } from "react";
import type { NameIndexEntry } from "@/lib/names";
import { Button } from "@/components/material3/Button";
import styles from "./RandomDiscovery.module.css";
import { Icon } from "@/components/material3/Icon";
import { GenderIcon } from "@/components/features/names/GenderIcon";

type Props = { prenoms: NameIndexEntry[] };

export function RandomDiscovery({ prenoms }: Props) {
  const [selection, setSelection] = useState<NameIndexEntry | null>(null);

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
      <Button variant="outlined" onClick={decouvrir}>
        Surprenez-moi <span aria-hidden="true"><Icon name="shuffle" size={18} /></span>
      </Button>
      <div className={styles.copy} aria-live="polite" aria-atomic="true">
        {selection ? (
          <span className={styles.resultLine}>
            Votre prochaine découverte : <Link className={styles.result} href={`/prenoms/${selection.slug}`}>{selection.name}</Link>
            <GenderIcon gender={selection.gender} />
          </span>
        ) : (
          "Pas d’idée précise ? Laissez-vous guider par le hasard."
        )}
      </div>
    </div>
  );
}
