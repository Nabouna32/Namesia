"use client";

import Link from "next/link";
import { BoutonFavori } from "@/components/bouton-favori";
import type { PrenomIndex } from "@/lib/prenoms";
import { useFavoris } from "@/components/favoris-provider";
import { useHistorique } from "@/components/historique-provider";
import styles from "./historique-prenoms.module.css";
import { IconeMaterial } from "./icone-material";
import { Bouton } from "@/components/ui/bouton";

export function HistoriquePrenoms({ prenoms }: { prenoms: PrenomIndex[] }) {
  const { slugs, effacer, erreur } = useHistorique();
  const { erreur: erreurFavoris } = useFavoris();
  if (slugs.length === 0 && !erreur) return null;

  const index = new Map(prenoms.map((prenom) => [prenom.slug, prenom] as const));
  const recentes = slugs.flatMap((slug) => {
    const prenom = index.get(slug);
    return prenom ? [prenom] : [];
  });

  return (
    <section className={styles.section} aria-labelledby="historique-title">
      <div className="container">
        <div className={styles.heading}>
          <div>
            <span className="eyebrow">Reprendre la découverte</span>
            <h2 id="historique-title">Vos dernières fiches</h2>
          </div>
          <Bouton variante="text" type="button" onClick={effacer}>
            Effacer l’historique
          </Bouton>
        </div>
        {erreur && (
          <p className={styles.favoriteError} role="status">
            L’historique ne peut pas être conservé après rechargement dans cet onglet. Il reste disponible tant que la page est ouverte.
          </p>
        )}
        {recentes.length > 0 ? (
          <>
            <div className={styles.grid}>
              {recentes.map((prenom) => (
                <article className={styles.card} key={prenom.slug}>
                  <Link className={`name-card ${styles.link}`} href={`/prenoms/${prenom.slug}`}>
                    <span className="name-initial">{prenom.lettre}</span>
                    <span>
                      <strong>{prenom.nom}</strong>
                      <small>{prenom.genre}</small>
                    </span>
                    <span className="card-arrow" aria-hidden="true"><IconeMaterial name="arrow-up-right" /></span>
                  </Link>
                  {!erreurFavoris && (
                    <BoutonFavori slug={prenom.slug} nom={prenom.nom} compact afficherErreur={false} />
                  )}
                </article>
              ))}
            </div>
            {erreurFavoris && (
              <p className={styles.favoriteError} role="alert">
                Le stockage des favoris est indisponible ou contient des données illisibles. Les actions de sauvegarde sont temporairement masquées.
              </p>
            )}
            <p className={styles.note}>Cet historique est propre à cet onglet : il est conservé lors des rechargements et supprimé à sa fermeture.</p>
          </>
        ) : (
          <p className={styles.note}>Aucune des fiches consultées récemment n’est actuellement publiée.</p>
        )}
      </div>
    </section>
  );
}
