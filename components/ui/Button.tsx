"use client";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./Button.module.css";
export type ButtonVariant = "filled" | "tonal" | "outlined" | "text";
export type ButtonSize = "standard" | "icon";
type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> & { children: ReactNode; variant?: ButtonVariant; size?: ButtonSize; className?: string; };
export function Button({ children, variant = "filled", size = "standard", type = "button", disabled = false, className, ...buttonProps }: Props) {
 return <button {...buttonProps} className={[styles.button, styles[variant], size === "icon" ? styles.icon : "", className].filter(Boolean).join(" ")} type={type} disabled={disabled}>{children}</button>;
}