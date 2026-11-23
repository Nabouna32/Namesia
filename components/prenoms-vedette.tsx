import Link from "next/link";
import { BoutonFavori } from "@/components/bouton-favori";
import type { PrenomIndex } from "@/lib/prenoms";
import styles from "./prenoms-vedette.module.css";

type Props = { prenoms: PrenomIndex[] };

export function PrenomsVedette({ prenoms }: Props) {
  return (
    <div className="featured-grid">
      {prenoms.map((prenom, index) => (
        <article className={styles.item} key={prenom.slug}>
          <Link className={`featured-card featured-${index + 1}`} href={`/prenoms/${prenom.slug}`}>
            <span className="featured-letter">{prenom.lettre}</span>
            <span className="featured-bottom">
              <span className="featured-name">
                <strong>{prenom.nom}</strong>
                <small>{prenom.genre}</small>
              </span>
              <span className="featured-action">Découvrir <b>↗</b></span>
            </span>
          </Link>
          <BoutonFavori slug={prenom.slug} nom={prenom.nom} compact afficherErreur={false} />
        </article>
      ))}
    </div>
  );
}
