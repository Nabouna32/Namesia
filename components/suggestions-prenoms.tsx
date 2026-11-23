import Link from "next/link";
import { BoutonFavori } from "@/components/bouton-favori";
import type { PrenomIndex } from "@/lib/prenoms";
import type { ContexteRetourNavigation } from "@/lib/navigation-prenoms";
import { creerUrlFicheDepuisContexte } from "@/lib/navigation-prenoms";
import styles from "./suggestions-prenoms.module.css";

type Props = { prenoms: PrenomIndex[]; contexteRetour?: ContexteRetourNavigation | null };

export function SuggestionsPrenoms({ prenoms, contexteRetour = null }: Props) {
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
            <span className="card-arrow" aria-hidden="true">↗</span>
          </Link>
          <BoutonFavori slug={prenom.slug} nom={prenom.nom} compact afficherErreur={false} />
        </article>
      ))}
    </div>
  );
}
