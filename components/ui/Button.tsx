"use client";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./Button.module.css";
export type ButtonVariant = "filled" | "tonal" | "outlined" | "text";
type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> & { children: ReactNode; variant?: ButtonVariant; size?: ButtonSize; className?: string; };
export function Button({ children, variant = "filled", type = "button", disabled = false, className, ...buttonProps }: Props) {
 return <button {...buttonProps} className={[styles.button, styles[variant], className].filter(Boolean).join(" ")} type={type} disabled={disabled}>{children}</button>;
}