"use client";

import { Button } from "@/components/material3/Button";
import { IconeMaterial } from "@/components/icone-material";
import styles from "./ComparisonToggle.module.css";

type Props = {
  name: string;
  selected: boolean;
  disabled?: boolean;
  onClick: () => void;
};

export function ComparisonToggle({ name, selected, disabled = false, onClick }: Props) {
  return (
    <Button
      variant={selected ? "tonal" : "outlined"}
      className={styles.toggle}
      aria-label={`${selected ? "Retirer" : "Ajouter"} ${name} ${selected ? "de" : "à"} la comparaison`}
      aria-pressed={selected}
      disabled={disabled}
      onClick={onClick}
    >
      <span className={styles.label}>{selected ? "Ajouté" : "Comparer"}</span>
      <span className={styles.icon} aria-hidden="true">
        <IconeMaterial name={selected ? "check" : "compare-arrows"} size={18} />
      </span>
    </Button>
  );
}
