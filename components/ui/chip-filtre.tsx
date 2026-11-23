"use client";

import { IconeMaterial } from "@/components/icone-material";
import styles from "./chip-filtre.module.css";

type Props = {
  label: string;
  selectionne: boolean;
  initiale?: boolean;
  onClick: () => void;
};

export function ChipFiltre({ label, selectionne, initiale = false, onClick }: Props) {
  return (
    <button
      className={[styles.chip, initiale ? styles.initial : ""].filter(Boolean).join(" ")}
      type="button"
      aria-pressed={selectionne}
      onClick={onClick}
    >
      {selectionne && <IconeMaterial name="check" size={18} />}
      <span>{label}</span>
    </button>
  );
}
