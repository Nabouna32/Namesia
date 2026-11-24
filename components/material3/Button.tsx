"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import styles from "./Button.module.css";

export type ButtonVariant = "filled" | "tonal" | "outlined" | "text";

type Props = {
  children: ReactNode;
  variant?: ButtonVariant;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  className?: string;
  href?: string;
  "aria-label"?: string;
  "aria-pressed"?: boolean;
  onClick?: () => void;
};

function getClassName(variant: ButtonVariant, className?: string) {
  return [styles.button, styles[variant], className].filter(Boolean).join(" ");
}

export function Button({
  children,
  variant = "filled",
  type = "button",
  disabled = false,
  className,
  href,
  "aria-label": ariaLabel,
  "aria-pressed": ariaPressed,
  onClick
}: Props) {
  const classes = getClassName(variant, className);

  if (href) {
    return (
      <Link className={classes} href={href} aria-label={ariaLabel} aria-disabled={disabled || undefined}>
        {children}
      </Link>
    );
  }

  return (
    <button
      className={classes}
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
