"use client";

import { Button } from "@/components/ui/Button";
import { IconeMaterial } from "@/components/icone-material";
import styles from "./ComparisonButton.module.css";

type Props = {
  name: string;
  selected: boolean;
  disabled?: boolean;
  onClick: () => void;
};

export function ComparisonButton({
  name,
  selected,
  disabled = false,
  onClick
}: Props) {
  const action = selected ? "Retirer" : "Ajouter";
  const preposition = selected ? "de" : "à";

  return (
    <Button
      variant={selected ? "tonal" : "outlined"}
      className={styles.toggle}
      aria-label={`${action} ${name} ${preposition} la comparaison`}
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
