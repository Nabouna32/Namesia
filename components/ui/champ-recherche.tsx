"use client";

import { useRef, type ChangeEvent } from "react";
import { IconeMaterial } from "@/components/icone-material";
import { Bouton } from "@/components/ui/bouton";
import styles from "./champ-recherche.module.css";

type Props = {
  id: string;
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  className?: string;
};

export function ChampRecherche({
  id,
  label,
  value,
  placeholder,
  onChange,
  className
}: Props) {
  const champRef = useRef<HTMLInputElement>(null);

  function changer(event: ChangeEvent<HTMLInputElement>) {
    onChange(event.currentTarget.value);
  }

  function effacer() {
    onChange("");
    champRef.current?.focus();
  }

  return (
    <div className={[styles.field, className].filter(Boolean).join(" ")}>
      <label className="sr-only" htmlFor={id}>{label}</label>
      <div className={styles.control}>
        <span className={styles.icon} aria-hidden="true">
          <IconeMaterial name="search" size={24} />
        </span>
        <input
          ref={champRef}
          id={id}
          type="search"
          autoComplete="off"
          value={value}
          onChange={changer}
          placeholder={placeholder}
        />
        {value && (
          <Bouton
            variante="text"
            taille="icon"
            className={styles.clearButton}
            ariaLabel={`Effacer : ${label.toLocaleLowerCase("fr")}`}
            onClick={effacer}
          >
            <IconeMaterial name="close" size={24} />
          </Bouton>
        )}
      </div>
    </div>
  );
}
