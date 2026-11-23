"use client";

import type { ChangeEvent } from "react";
import styles from "./champ-select.module.css";

type Option = {
  value: string;
  label: string;
};

type Props = {
  id: string;
  label: string;
  value: string;
  options: readonly Option[];
  onChange: (value: string) => void;
};

export function ChampSelect({ id, label, value, options, onChange }: Props) {
  function changer(event: ChangeEvent<HTMLSelectElement>) {
    onChange(event.currentTarget.value);
  }

  return (
    <div className={styles.field}>
      <label htmlFor={id}>{label}</label>
      <select id={id} value={value} onChange={changer}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </div>
  );
}
