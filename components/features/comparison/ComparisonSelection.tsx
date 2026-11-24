"use client";

import { IconButton } from "@/components/material3/IconButton";
import { IconeMaterial } from "@/components/icone-material";
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
          <span className={styles.chip}>
            <span>{name.name}</span>
            <IconButton
              className={styles.remove}
              label={`Retirer ${name.name} de la comparaison`}
              onClick={() => onRemove(name.slug)}
            >
              <IconeMaterial name="close" size={18} />
            </IconButton>
          </span>
        </li>
      ))}
    </ul>
  );
}
