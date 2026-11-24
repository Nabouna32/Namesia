"use client";

import { Icon } from "@/components/material3/Icon";
import styles from "./InputChip.module.css";

type Props = {
  label: string;
  onRemove: () => void;
};

export function InputChip({ label, onRemove }: Props) {
  return (
    <button
      className={styles.chip}
      type="button"
      aria-label={`Retirer ${label} de la sélection`}
      onClick={onRemove}
    >
      <span>{label}</span>
      <Icon name="close" size={18} />
    </button>
  );
}
