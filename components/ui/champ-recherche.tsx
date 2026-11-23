"use client";

import type { ChangeEvent } from "react";
import { IconeMaterial } from "@/components/icone-material";
import styles from "./champ-recherche.module.css";

type Props = {
  id: string;
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  compact?: boolean;
  className?: string;
};

export function ChampRecherche({
  id,
  label,
  value,
  placeholder,
  onChange,
  compact = false,
  className
}: Props) {
  function changer(event: ChangeEvent<HTMLInputElement>) {
    onChange(event.currentTarget.value);
  }

  return (
    <div className={[compact ? styles.compact : styles.field, className].filter(Boolean).join(" ")}>
      <label className={compact ? "sr-only" : undefined} htmlFor={id}>{label}</label>
      <div className={styles.control}>
        <span className={styles.icon} aria-hidden="true">
          <IconeMaterial name="search" size={22} />
        </span>
        <input
          id={id}
          type="search"
          autoComplete="off"
          value={value}
          onChange={changer}
          placeholder={placeholder}
        />
        {value && (
          <button
            className={styles.clear}
            type="button"
            aria-label={`Effacer : ${label.toLocaleLowerCase("fr")}`}
            onClick={() => onChange("")}
          >
            Effacer
          </button>
        )}
      </div>
    </div>
  );
}
