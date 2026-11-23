"use client";

import type { ReactNode } from "react";
import styles from "./bouton.module.css";

type Variante = "filled" | "tonal" | "outlined" | "text";
type Taille = "standard" | "icon";

type Props = {
  children: ReactNode;
  variante?: Variante;
  taille?: Taille;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  className?: string;
  ariaLabel?: string;
  ariaPressed?: boolean;
  onClick?: () => void;
};

function classesBouton(variante: Variante, taille: Taille, className?: string) {
  return [styles.button, styles[variante], taille === "icon" ? styles.icon : "", className]
    .filter(Boolean)
    .join(" ");
}

export function Bouton({
  children,
  variante = "filled",
  taille = "standard",
  type = "button",
  disabled = false,
  className,
  ariaLabel,
  ariaPressed,
  onClick
}: Props) {
  return (
    <button
      className={classesBouton(variante, taille, className)}
      type={type}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-pressed={ariaPressed}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
