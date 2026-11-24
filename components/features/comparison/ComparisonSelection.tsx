"use client";

import { InputChip } from "@/components/material3/InputChip";
import styles from "./ComparisonSelection.module.css";

type SelectedName = { slug: string; name: string };

type Props = {
  names: SelectedName[];
  label: string;
  onRemove: (slug: string) => void;
};

export function ComparisonSelection({ names, label, onRemove }: Props) {
  if (names.length === 0) return null;

  return (
    <ul className={styles.list} aria-label={label}>
      {names.map((name) => (
        <li className={styles.item} key={name.slug}>
          <InputChip label={name.name} onRemove={() => onRemove(name.slug)} />
        </li>
      ))}
    </ul>
  );
}
