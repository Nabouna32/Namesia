"use client";

import Link from "next/link";
import { FavoriteButton } from "@/components/features/favorites/FavoriteButton";
import type { PrenomIndex } from "@/lib/prenoms";
import { useFavorites } from "@/components/features/favorites/FavoritesProvider";
import { useHistory } from "@/components/features/history/HistoryProvider";
import styles from "./RecentNames.module.css";
import { Icon } from "@/components/material3/Icon";
import { Button } from "@/components/material3/Button";
import { IconButton } from "@/components/material3/IconButton";
import { Card } from "@/components/material3/Card";

export function RecentNames({ prenoms }: { prenoms: PrenomIndex[] }) {
  const { slugs, retirer, effacer, erreur } = useHistory();
  const { erreur: erreurFavoris } = useFavorites();
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
          {slugs.length > 0 && (
            <Button variant="text" type="button" onClick={effacer}>
              Effacer l’historique
            </Button>
          )}
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
                  <Card as={Link} variant="elevated" interactive className={`name-card ${styles.link}`} href={`/prenoms/${prenom.slug}`}>
                    <span className="name-initial">{prenom.lettre}</span>
                    <span>
                      <strong>{prenom.nom}</strong>
                      <small>{prenom.genre}</small>
                    </span>
                    <span className="card-arrow" aria-hidden="true"><Icon name="arrow-up-right" /></span>
                  </Card>
                  {!erreurFavoris && (
                    <FavoriteButton slug={prenom.slug} name={prenom.nom} compact showError={false} />
                  )}
                  <IconButton
                    label={`Retirer ${prenom.nom} de l’historique`}
                    onClick={() => retirer(prenom.slug)}
                  >
                    <span aria-hidden="true"><Icon name="close" size={24} /></span>
                  </IconButton>
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
        ) : !erreur ? (
          <p className={styles.note}>Aucune des fiches consultées récemment n’est actuellement publiée.</p>
        ) : null}
      </div>
    </section>
  );
}
