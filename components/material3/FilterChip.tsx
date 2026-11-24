"use client";

import { IconeMaterial } from "@/components/icone-material";
import styles from "./FilterChip.module.css";

type Props = {
  label: string;
  selected: boolean;
  onClick: () => void;
};

export function FilterChip({ label, selected, onClick }: Props) {
  return (
    <button
      className={styles.chip}
      type="button"
      aria-pressed={selected}
      onClick={onClick}
    >
      {selected && <IconeMaterial name="check" size={18} />}
      <span>{label}</span>
    </button>
  );
}
