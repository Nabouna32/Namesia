import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import styles from "./Card.module.css";

export type CardVariant = "elevated" | "filled" | "outlined";

type CardOwnProps = {
  children?: ReactNode;
  variant: CardVariant;
  interactive?: boolean;
  className?: string;
};

type CardProps<T extends ElementType> = CardOwnProps & {
  as?: T;
} & Omit<ComponentPropsWithoutRef<T>, keyof CardOwnProps | "as">;

export function Card<T extends ElementType = "div">({
  as,
  variant,
  interactive = false,
  className,
  children,
  ...props
}: CardProps<T>) {
  const Component = as ?? "div";

  return (
    <Component
      {...props}
      className={[
        styles.card,
        styles[variant],
        interactive ? styles.interactive : "",
        className
      ].filter(Boolean).join(" ")}
    >
      {children}
    </Component>
  );
}
