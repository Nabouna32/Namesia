"use client";

import { useRef, type ChangeEvent } from "react";
import { Icon } from "@/components/ui/Icon";
import { IconButton } from "@/components/ui/IconButton";
import styles from "./SearchBar.module.css";

type Props = {
  id: string;
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  className?: string;
};

export function SearchBar({
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
          <Icon name="search" size={24} />
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
          <IconButton
            variant="standard"
            className={styles.clearButton}
            aria-label={`Effacer : ${label.toLocaleLowerCase("fr")}`}
            onClick={effacer}
          >
            <Icon name="close" size={24} />
          </IconButton>
        )}
      </div>
    </div>
  );
}
