"use client";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import styles from "./FavoriteButton.module.css";
import { Icon } from "@/components/ui/Icon";
import { useFavoris } from "./favoris-provider";
type Props = { slug: string; name?: string; compact?: boolean; showError?: boolean };
export function FavoriteButton({ slug, name, compact = false, showError = true }: Props) {
 const { slugs, pret, erreur, basculer } = useFavoris();
 const selected = slugs.includes(slug);
 const action = selected ? "Retirer des favoris" : "Ajouter aux favoris";
 const accessibleName = name ?? "ce prénom";
 const icon = <Icon name={selected ? "favorite-filled" : "favorite"} size={compact ? 24 : 18} />;
 const label = compact ? pret ? `${action} : ${accessibleName}` : `Chargement des favoris pour ${accessibleName}` : undefined;
 return <div className={compact ? `${styles.container} ${styles.compactContainer}` : styles.container}>
  {compact
   ? <IconButton variant="outlined" aria-label={label} aria-pressed={selected} disabled={!pret} onClick={() => basculer(slug)}><span aria-hidden="true">{icon}</span></IconButton>
   : <Button variant="outlined" aria-pressed={selected} disabled={!pret} onClick={() => basculer(slug)}><span aria-hidden="true">{icon}</span>{pret ? action : "Chargement…"}</Button>}
  {erreur && showError && <p className={styles.error} role="alert">Le stockage des favoris est indisponible ou contient des données illisibles. Vérifiez les paramètres de votre navigateur.</p>}
 </div>;
}