"use client";

import { useRef, type ChangeEvent } from "react";
import { IconButton } from "./IconButton";
import { Icon } from "@/components/material3/Icon";
import styles from "./SearchBar.module.css";

type Props = {
  id: string;
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  className?: string;
};

export function SearchBar({ id, label, value, placeholder, onChange, className }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    onChange(event.currentTarget.value);
  }

  function clear() {
    onChange("");
    inputRef.current?.focus();
  }

  return (
    <div className={[styles.root, className].filter(Boolean).join(" ")}>
      <label className="sr-only" htmlFor={id}>{label}</label>
      <div className={styles.container}>
        <span className={styles.leadingIcon} aria-hidden="true">
          <Icon name="search" size={24} />
        </span>
        <input
          ref={inputRef}
          id={id}
          type="search"
          autoComplete="off"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          enterKeyHint="search"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
        />
        {value && (
          <IconButton
            className={styles.clearButton}
            label={`Effacer : ${label.toLocaleLowerCase("fr")}`}
            onClick={clear}
          >
            <Icon name="close" size={24} />
          </IconButton>
        )}
      </div>
    </div>
  );
}
