"use client";

import type { ReactNode } from "react";
import styles from "./IconButton.module.css";

type Props = {
  children: ReactNode;
  label: string;
  disabled?: boolean;
  className?: string;
  onClick: () => void;
};

export function IconButton({ children, label, disabled = false, className, onClick }: Props) {
  return (
    <button
      className={[styles.button, className].filter(Boolean).join(" ")}
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
