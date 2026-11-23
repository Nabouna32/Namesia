"use client";

import { useState, type ChangeEvent } from "react";
import Link from "next/link";
import type { PrenomIndex } from "@/lib/prenoms";
import { creerSauvegardeFavoris, lireSauvegardeFavoris } from "@/lib/sauvegarde-favoris";
import { BoutonFavori } from "./bouton-favori";
import { useFavoris } from "./favoris-provider";
import styles from "./liste-favoris.module.css";

type Props = { prenoms: PrenomIndex[] };

const TAILLE_MAX_SAUVEGARDE = 1_000_000;

export function ListeFavoris({ prenoms }: Props) {
  const { slugs, pret, erreur, retirerPlusieurs, ajouterPlusieurs } = useFavoris();
  const [messageImport, setMessageImport] = useState("");
  const [erreurImport, setErreurImport] = useState("");

  if (!pret) return <p role="status" className="empty-state">Chargement de vos favoris…</p>;

  const parSlug = new Map(prenoms.map((prenom) => [prenom.slug, prenom]));
  const favoris = slugs.flatMap((slug) => {
    const prenom = parSlug.get(slug);
    return prenom ? [prenom] : [];
  });
  const slugsIndisponibles = slugs.filter((slug) => !parSlug.has(slug));

  function exporterFavoris() {
    const fichier = new Blob([creerSauvegardeFavoris(slugs)], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(fichier);
    const lien = document.createElement("a");
    lien.href = url;
    lien.download = "namesia-favoris.json";
    document.body.append(lien);
    lien.click();
    lien.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  async function importerFavoris(event: ChangeEvent<HTMLInputElement>) {
    const champ = event.currentTarget;
    const fichier = champ.files?.[0];
    champ.value = "";
    if (!fichier) return;

    setMessageImport("");
    setErreurImport("");

    if (fichier.size > TAILLE_MAX_SAUVEGARDE) {
      setErreurImport("Le fichier dépasse la taille maximale de 1 Mo.");
      return;
    }

    try {
      const contenu: unknown = JSON.parse(await fichier.text());
      const slugsImportes = lireSauvegardeFavoris(contenu);
      const nombreAjoute = ajouterPlusieurs(slugsImportes);
      if (nombreAjoute === null) return;

      setMessageImport(nombreAjoute === 0
        ? "Cette sauvegarde ne contient aucun nouveau favori."
        : `${nombreAjoute} ${nombreAjoute > 1 ? "favoris ajoutés" : "favori ajouté"} à votre sélection.`);
    } catch (cause) {
      setErreurImport(cause instanceof Error
        ? cause.message
        : "Le fichier n’a pas pu être lu.");
    }
  }

  return (
    <div className={styles.content}>
      <div className={styles.tools}>
        <button className="button button-dark" type="button" disabled={slugs.length === 0} onClick={exporterFavoris}>
          Exporter mes favoris
        </button>
        <label className={styles.importButton}>
          Importer une sauvegarde
          <input type="file" accept=".json,application/json" onChange={importerFavoris} />
        </label>
      </div>
      <p className={styles.help}>La sauvegarde contient uniquement les identifiants de vos favoris. L’import les ajoute à votre sélection actuelle, sans remplacer vos favoris existants.</p>

      {messageImport && <p className={styles.success} role="status">{messageImport}</p>}
      {erreurImport && <p className={styles.error} role="alert">{erreurImport}</p>}
      {erreur && (
        <p className={styles.error} role="alert">
          Le stockage des favoris est indisponible ou contient des données illisibles. Vos modifications ne sont pas enregistrées.
        </p>
      )}

      {favoris.length === 0 ? (
        <div className={styles.empty}>
          <p>{erreur
            ? "Vos favoris ne peuvent pas être lus pour le moment."
            : slugs.length === 0
              ? "Vous n’avez pas encore enregistré de prénom."
              : "Aucun de vos favoris n’est actuellement publié."}</p>
          {slugsIndisponibles.length > 0 && !erreur && (
            <button
              className="filter-reset"
              type="button"
              onClick={() => retirerPlusieurs(slugsIndisponibles)}
            >
              Retirer les {slugsIndisponibles.length} favoris indisponibles
            </button>
          )}
          <Link className="button button-dark" href="/prenoms">Explorer les prénoms</Link>
        </div>
      ) : (
        <div className="name-grid">
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
          {slugsIndisponibles.length > 0 && (
            <>
              <p className={styles.note} role="status">
                {slugsIndisponibles.length} {slugsIndisponibles.length > 1 ? "favoris ne sont plus" : "favori n’est plus"} publiés.
              </p>
              {!erreur && (
                <button
                  className="filter-reset"
                  type="button"
                  onClick={() => retirerPlusieurs(slugsIndisponibles)}
                >
                  Retirer les favoris indisponibles
                </button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
