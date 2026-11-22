"use client";

import Link from "next/link";
import type { PrenomIndex } from "@/lib/prenoms";
import { BoutonFavori } from "./bouton-favori";
import { useFavoris } from "./favoris-provider";
import styles from "./liste-favoris.module.css";

type Props = { prenoms: PrenomIndex[] };

export function ListeFavoris({ prenoms }: Props) {
  const { slugs, pret, erreur } = useFavoris();

  if (!pret) return <p role="status" className="empty-state">Chargement de vos favoris…</p>;

  const parSlug = new Map(prenoms.map((prenom) => [prenom.slug, prenom]));
  const favoris = slugs.flatMap((slug) => {
    const prenom = parSlug.get(slug);
    return prenom ? [prenom] : [];
  });

  if (favoris.length === 0) {
    return (
      <div className={styles.empty}>
        {erreur ? (
          <p role="alert">Le stockage des favoris est indisponible ou contient des données illisibles. Vérifiez les paramètres de votre navigateur puis rechargez la page.</p>
        ) : (
          <p>{slugs.length === 0 ? "Vous n’avez pas encore enregistré de prénom." : "Aucun de vos favoris n’est actuellement publié."}</p>
        )}
        <Link className="button button-dark" href="/prenoms">Explorer les prénoms</Link>
      </div>
    );
  }

  return (
    <div className="name-grid">
      {erreur && (
        <p className={styles.error} role="alert">
          Le stockage des favoris est indisponible ou contient des données illisibles. Vos modifications ne sont pas enregistrées.
        </p>
      )}
      {favoris.map((prenom) => (
        <article className={styles.row} key={prenom.slug}>
          <Link className="name-card" href={`/prenoms/${prenom.slug}`}>
            <span className="name-initial">{prenom.lettre}</span>
            <span>
              <strong>{prenom.nom}</strong>
              <small>{prenom.genre}</small>
            </span>
            <span className="card-arrow" aria-hidden="true">↗</span>
          </Link>
          <BoutonFavori slug={prenom.slug} afficherErreur={false} />
        </article>
      ))}
      {favoris.length !== slugs.length && (
        <p className={styles.note}>Les fiches qui ne sont plus publiées ne sont pas affichées.</p>
      )}
    </div>
  );
}
