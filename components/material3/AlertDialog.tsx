"use client";

import { useEffect, useRef } from "react";
import { Button } from "./Button";
import styles from "./AlertDialog.module.css";

type Props = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  dismissLabel: string;
  onConfirm: () => void;
  onDismiss: () => void;
};

export function AlertDialog({
  open,
  title,
  description,
  confirmLabel,
  dismissLabel,
  onConfirm,
  onDismiss
}: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!open || !dialog) return;

    dialog.showModal();
    return () => {
      if (dialog.open) dialog.close();
    };
  }, [open]);

  if (!open) return null;

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      onCancel={(event) => {
        event.preventDefault();
        onDismiss();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onDismiss();
      }}
    >
      <section className={styles.content}>
        <h2 id="alert-dialog-title" className={styles.title}>{title}</h2>
        <p id="alert-dialog-description" className={styles.description}>{description}</p>
        <div className={styles.actions}>
          <Button variant="text" onClick={onDismiss}>{dismissLabel}</Button>
          <Button variant="text" onClick={onConfirm}>{confirmLabel}</Button>
        </div>
      </section>
    </dialog>
  );
}
