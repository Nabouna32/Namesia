import Link from "next/link";
import { FavoriteButton } from "@/components/FavoriteButton";
import type { PrenomIndex } from "@/lib/prenoms";
import type { ContexteRetourNavigation } from "@/lib/navigation-prenoms";
import { creerUrlFicheDepuisContexte } from "@/lib/navigation-prenoms";
import styles from "./NameSuggestions.module.css";
import { IconeMaterial } from "./icone-material";

type Props = { prenoms: PrenomIndex[]; contexteRetour?: ContexteRetourNavigation | null };

export function NameSuggestions({ prenoms, contexteRetour = null }: Props) {
  return (
    <div className={styles.grid}>
      {prenoms.map((prenom) => (
        <article className={styles.card} key={prenom.slug}>
          <Link className="name-card" href={creerUrlFicheDepuisContexte(prenom.slug, contexteRetour)}>
            <span className="name-initial">{prenom.lettre}</span>
            <span>
              <strong>{prenom.nom}</strong>
              <small>{prenom.genre}</small>
            </span>
            <span className="card-arrow" aria-hidden="true"><IconeMaterial name="arrow-up-right" /></span>
          </Link>
          <FavoriteButton slug={prenom.slug} name={prenom.nom} compact showError={false} />
        </article>
      ))}
    </div>
  );
}
