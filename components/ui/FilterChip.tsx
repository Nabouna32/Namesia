"use client";

import { Icon } from "@/components/ui/Icon";
import styles from "./FilterChip.module.css";

type Props = {
  label: string;
  selected: boolean;
  initial?: boolean;
  onClick: () => void;
};

export function FilterChip({ label, selected, initial = false, onClick }: Props) {
  return (
    <button
      className={[styles.chip, initial ? styles.initial : ""].filter(Boolean).join(" ")}
      type="button"
      aria-pressed={selected}
      onClick={onClick}
    >
      {selected && <Icon name="check" size={18} />}
      <span>{label}</span>
    </button>
  );
}
