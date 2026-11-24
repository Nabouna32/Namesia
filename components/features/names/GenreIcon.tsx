import type { GenrePrenom } from "@/lib/prenoms";
import { GENRE_ICONS } from "@/lib/genre-icons";
import { Icon } from "@/components/material3/Icon";
import styles from "./GenreIcon.module.css";

type Props = {
  genre: GenrePrenom;
  className?: string;
};

export function GenreIcon({ genre, className }: Props) {
  return (
    <span className={className ? `${styles.icon} ${className}` : styles.icon} role="img" aria-label={genre}>
      <Icon name={GENRE_ICONS[genre]} size={20} />
    </span>
  );
}
