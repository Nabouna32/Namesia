"use client";

import { Bouton } from "@/components/ui/bouton";
import { IconeMaterial } from "@/components/icone-material";
import styles from "./bouton-comparaison.module.css";

type Props = {
  prenom: string;
  selectionne: boolean;
  desactive?: boolean;
  onClick: () => void;
};

export function BoutonComparaison({
  prenom,
  selectionne,
  desactive = false,
  onClick
}: Props) {
  const action = selectionne ? "Retirer" : "Ajouter";
  const preposition = selectionne ? "de" : "à";

  return (
    <Bouton
      variante={selectionne ? "tonal" : "outlined"}
      className={styles.toggle}
      ariaLabel={`${action} ${prenom} ${preposition} la comparaison`}
      ariaPressed={selectionne}
      disabled={desactive}
      onClick={onClick}
    >
      <span className={styles.label}>{selectionne ? "Ajouté" : "Comparer"}</span>
      <span className={styles.icon} aria-hidden="true">
        <IconeMaterial name={selectionne ? "check" : "compare-arrows"} size={18} />
      </span>
    </Bouton>
  );
}
