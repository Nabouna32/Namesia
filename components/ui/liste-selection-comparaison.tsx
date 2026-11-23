"use client";

import type { Pick } from "react";
import { IconeMaterial } from "@/components/icone-material";
import styles from "./liste-selection-comparaison.module.css";

type PrenomSelectionne = {
  slug: string;
  nom: string;
};

type Props = {
  prenoms: PrenomSelectionne[];
  label: string;
  onRetirer: (slug: string) => void;
};

export function ListeSelectionComparaison({ prenoms, label, onRetirer }: Props) {
  if (prenoms.length === 0) return null;

  return (
    <ul className={styles.list} aria-label={label}>
      {prenoms.map((prenom) => (
        <li className={styles.item} key={prenom.slug}>
          <button
            className={styles.chip}
            type="button"
            aria-label={`Retirer ${prenom.nom} de la comparaison`}
            onClick={() => onRetirer(prenom.slug)}
          >
            <span>{prenom.nom}</span>
            <IconeMaterial name="close" size={18} />
          </button>
        </li>
      ))}
    </ul>
  );
}
