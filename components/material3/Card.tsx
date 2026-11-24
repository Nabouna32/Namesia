import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import styles from "./Card.module.css";

export type CardVariant = "elevated" | "filled" | "outlined";

type CardOwnProps = {
  children: ReactNode;
  variant: CardVariant;
  interactive: boolean;
  className?: string;
};

type CardProps<T extends ElementType> = CardOwnProps & {
  as: T;
} & Omit<ComponentPropsWithoutRef<T>, keyof CardOwnProps | "as">;

export function Card<T extends ElementType>({
  as: Component,
  variant,
  interactive,
  className,
  children,
  ...props
}: CardProps<T>) {
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
