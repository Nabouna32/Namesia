import type { ReactNode } from "react";
import styles from "./Snackbar.module.css";

export type SnackbarSeverity = "success" | "warning" | "info" | "error";

const severityClass: Record<SnackbarSeverity, string> = {
  success: styles.success,
  warning: styles.warning,
  info: styles.info,
  error: styles.error
};

export function Snackbar({
  severity,
  children,
  className
}: Readonly<{
  severity: SnackbarSeverity;
  children: ReactNode;
  className?: string;
}>) {
  const urgent = severity === "error";
  return (
    <p
      className={[styles.snackbar, severityClass[severity], className].filter(Boolean).join(" ")}
      role={urgent ? "alert" : "status"}
      aria-live={urgent ? "assertive" : "polite"}
    >
      {children}
    </p>
  );
}
