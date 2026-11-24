"use client";

import type { ReactNode } from "react";
import { Icon } from "@/components/material3/Icon";
import styles from "./FilterChip.module.css";

type Props = {
  label: string;
  selected: boolean;
  onClick: () => void;
  leadingIcon?: ReactNode;
  iconOnly?: boolean;
};

export function FilterChip({ label, selected, onClick, leadingIcon, iconOnly = false }: Props) {
  return (
    <button
      className={styles.chip}
      type="button"
      aria-pressed={selected}
      aria-label={iconOnly ? label : undefined}
      title={iconOnly ? label : undefined}
      onClick={onClick}
    >
      {leadingIcon ?? (selected && <Icon name="check" size={18} />)}
      <span className={iconOnly ? "sr-only" : undefined}>{label}</span>
    </button>
  );
}
