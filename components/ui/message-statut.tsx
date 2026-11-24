import type { ReactNode } from "react";
import styles from "./message-statut.module.css";

export type TypeMessageStatut = "success" | "warning" | "info" | "error";

const roles: Record<TypeMessageStatut, string> = {
  success: styles.success,
  warning: styles.warning,
  info: styles.info,
  error: styles.error
};

export function MessageStatut({
  type,
  children,
  className
}: Readonly<{
  type: TypeMessageStatut;
  children: ReactNode;
  className?: string;
}>) {
  const erreur = type === "error";

  return (
    <p
      className={[styles.message, roles[type], className].filter(Boolean).join(" ")}
      role={erreur ? "alert" : "status"}
      aria-live={erreur ? "assertive" : "polite"}
    >
      {children}
    </p>
  );
}
