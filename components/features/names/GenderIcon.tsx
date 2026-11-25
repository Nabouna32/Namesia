import type { NameGender } from "@/lib/gender-icons";
import { GENDER_ICONS } from "@/lib/gender-icons";
import { Icon } from "@/components/material3/Icon";
import styles from "./GenderIcon.module.css";

type Props = {
  gender: NameGender;
  className?: string;
};

export function GenderIcon({ gender, className }: Props) {
  return (
    <span className={className ? `${styles.icon} ${className}` : styles.icon} role="img" aria-label={gender}>
      <Icon name={GENDER_ICONS[gender]} size={20} />
    </span>
  );
}
