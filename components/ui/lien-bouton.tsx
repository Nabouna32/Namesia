import Link from "next/link";
import type { ReactNode } from "react";
import styles from "./bouton.module.css";

type Variante = "filled" | "tonal" | "outlined" | "text";

type Props = {
  href: string;
  children: ReactNode;
  variante?: Variante;
  className?: string;
};

export function LienBouton({ href, children, variante = "filled", className }: Props) {
  const classes = [styles.button, styles[variante], className].filter(Boolean).join(" ");

  return <Link className={classes} href={href}>{children}</Link>;
}
