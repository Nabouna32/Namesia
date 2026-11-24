import Link from "next/link";
import { FavoriteButton } from "@/components/FavoriteButton";
import type { PrenomIndex } from "@/lib/prenoms";
import styles from "./FeaturedNames.module.css";
import { IconeMaterial } from "./icone-material";

type Props = { prenoms: PrenomIndex[] };

export function FeaturedNames({ prenoms }: Props) {
  return (
    <div className="featured-grid">
      {prenoms.map((prenom) => (
        <article className={styles.item} key={prenom.slug}>
          <Link className="featured-card" href={`/prenoms/${prenom.slug}`}>
            <span className="featured-letter">{prenom.lettre}</span>
            <span className="featured-bottom">
              <span className="featured-name">
                <strong>{prenom.nom}</strong>
                <small>{prenom.genre}</small>
              </span>
              <span className="featured-action">Découvrir <b><IconeMaterial name="arrow-up-right" size={18} /></b></span>
            </span>
          </Link>
          <FavoriteButton slug={prenom.slug} name={prenom.nom} compact showError={false} />
        </article>
      ))}
    </div>
  );
}
