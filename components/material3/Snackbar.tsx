import type { ReactNode } from "react";
import styles from "./Snackbar.module.css";

export type SnackbarSeverity = "neutral" | "success" | "warning" | "info" | "error";

const severityClass: Record<SnackbarSeverity, string> = {
  success: styles.success,
  warning: styles.warning,
  info: styles.info,
  error: styles.error,
  neutral: styles.neutral
};

export function Snackbar({
  severity = "neutral",
  children,
  action,
  dismissAction,
  actionOnNewLine = false,
  className
}: Readonly<{
  severity?: SnackbarSeverity;
  children: ReactNode;
  action?: ReactNode;
  dismissAction?: ReactNode;
  actionOnNewLine?: boolean;
  className?: string;
}>) {
  const urgent = severity === "error";
  const classes = [
    styles.snackbar,
    severityClass[severity],
    actionOnNewLine && action ? styles.actionOnNewLine : undefined,
    className
  ].filter(Boolean).join(" ");

  return (
    <div className={classes} role={urgent ? "alert" : "status"}>
      <span className={styles.message}>{children}</span>
      {(action || dismissAction) && (
        <span className={styles.actions}>
          {action && <span className={styles.action}>{action}</span>}
          {dismissAction && <span className={styles.dismissAction}>{dismissAction}</span>}
        </span>
      )}
    </div>
  );
}
