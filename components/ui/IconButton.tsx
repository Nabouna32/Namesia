"use client";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./IconButton.module.css";
export type IconButtonVariant = "standard" | "filled" | "tonal" | "outlined";
type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> & { children: ReactNode; variant?: IconButtonVariant; className?: string; };
export function IconButton({ children, variant = "standard", type = "button", className, ...buttonProps }: Props) {
 return <button {...buttonProps} className={[styles.iconButton, styles[variant], className].filter(Boolean).join(" ")} type={type}>{children}</button>;
}