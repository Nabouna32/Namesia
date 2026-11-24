"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import styles from "./Button.module.css";

export type ButtonVariant = "filled" | "tonal" | "outlined" | "text";

type SharedProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  className?: string;
  "aria-label"?: string;
};

type LinkProps = SharedProps & {
  href: string;
  type?: never;
  disabled?: never;
  onClick?: never;
  "aria-pressed"?: never;
};

type ActionProps = SharedProps & {
  href?: never;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: () => void;
  "aria-pressed"?: boolean;
};

type Props = LinkProps | ActionProps;

function getClassName(variant: ButtonVariant, className?: string) {
  return [styles.button, styles[variant], className].filter(Boolean).join(" ");
}

export function Button(props: Props) {
  const classes = getClassName(props.variant ?? "filled", props.className);

  if (props.href !== undefined) {
    return (
      <Link className={classes} href={props.href} aria-label={props["aria-label"]}>
        {props.children}
      </Link>
    );
  }

  return (
    <button
      className={classes}
      type={props.type ?? "button"}
      disabled={props.disabled ?? false}
      aria-label={props["aria-label"]}
      aria-pressed={props["aria-pressed"]}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
}
