import type { NameGender } from "@/lib/names";
import { GENDER_ICON_PATHS } from "@/lib/gender-icons";
import styles from "./GenderIcon.module.css";

type Props = {
  gender: NameGender;
  className?: string;
  decorative?: boolean;
};

export function GenderIcon({ gender, className, decorative = false }: Props) {
  const definition = GENDER_ICON_PATHS[gender];
  return (
    <span
      className={className ? `${styles.icon} ${className}` : styles.icon}
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : gender}
    >
      <svg
        aria-hidden="true"
        width={20}
        height={20}
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
