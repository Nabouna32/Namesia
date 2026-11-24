import type { ReactNode } from "react";
import styles from "./StatusMessage.module.css";

export type StatusMessageType = "success" | "warning" | "info" | "error";

const roles: Record<StatusMessageType, string> = {
  success: styles.success,
  warning: styles.warning,
  info: styles.info,
  error: styles.error
};

export function StatusMessage({
  type,
  children,
  className
}: Readonly<{
  type: StatusMessageType;
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
