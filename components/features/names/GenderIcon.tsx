import type { NameGender } from "@/lib/names";
import { GENDER_ICON_PATHS } from "@/lib/gender-icons";
import styles from "./GenderIcon.module.css";

type Props = {
  gender: NameGender;
  className?: string;
  decorative?: boolean;
  size?: number;
};

export function GenderIcon({ gender, className, decorative = false, size = 20 }: Props) {
  const definition = GENDER_ICON_PATHS[gender];
  const sizeClass = size === 18 ? `${styles.icon} ${styles.compact}` : styles.icon;
  return (
    <span
      className={className ? `${sizeClass} ${className}` : sizeClass}
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : gender}
    >
      <svg
        aria-hidden="true"
        width={size}
        height={size}
        viewBox="0 -960 960 960"
        fill="currentColor"
        focusable="false"
      >
        <path d={definition.path} fillRule={definition.fillRule} />
        {definition.secondaryPath && <path d={definition.secondaryPath} />}
      </svg>
    </span>
  );
}
