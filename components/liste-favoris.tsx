"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import Link from "next/link";
import type { PrenomIndex } from "@/lib/prenoms";
import { creerSauvegardeFavoris, lireSauvegardeFavoris } from "@/lib/sauvegarde-favoris";
import { normaliserRecherche } from "@/lib/recherche-prenoms";
import { creerUrlFicheDepuisFavoris, type TriFavoris } from "@/lib/navigation-prenoms";
import { BarreComparaison } from "./barre-comparaison";
import { BoutonFavori } from "./bouton-favori";
import { useFavoris } from "./favoris-provider";
import styles from "./liste-favoris.module.css";
import { IconeMaterial } from "./icone-material";
import { ChampRecherche } from "@/components/ui/champ-recherche";

type Props = {
  prenoms: PrenomIndex[];
  initialRecherche?: string;
  initialGenre?: string;
  initialTri?: TriFavoris;
  initialNombreVisible?: number;
};

const TAILLE_MAX_SAUVEGARDE = 1_000_000;

export function ListeFavoris({
  prenoms,
  initialRecherche = "",
  initialGenre = "",
  initialTri = "enregistrement",
  initialNombreVisible = 24
}: Props) {
  const { slugs, pret, erreur, retirerPlusieurs, ajouterPlusieurs } = useFavoris();
  const [messageImport, setMessageImport] = useState("");
  const [erreurImport, setErreurImport] = useState("");
  const [messageCopie, setMessageCopie] = useState("");
  const [erreurCopie, setErreurCopie] = useState("");
  const [recherche, setRecherche] = useState(initialRecherche);
  const [genreActif, setGenreActif] = useState(initialGenre);
  const [triActif, setTriActif] = useState<TriFavoris>(initialTri);
  const [nombreVisible, setNombreVisible] = useState(initialNombreVisible);
  const [selectionComparaison, setSelectionComparaison] = useState<string[]>([]);

  const parSlug = new Map(prenoms.map((prenom) => [prenom.slug, prenom]));
  const favoris = slugs.flatMap((slug) => {
    const prenom = parSlug.get(slug);
    return prenom ? [prenom] : [];
  });
  const slugsIndisponibles = slugs.filter((slug) => !parSlug.has(slug));
  const favorisDisponibles = new Set(favoris.map((prenom) => prenom.slug));
  const favorisDisponiblesKey = favoris.map((prenom) => prenom.slug).join(",");
  const selectionValide = selectionComparaison.filter((slug) => favorisDisponibles.has(slug));
  const prenomsSelectionnes = selectionValide.flatMap((slug) => {
    const prenom = parSlug.get(slug);
    return prenom ? [prenom] : [];
  });

  useEffect(() => {
    const disponibles = new Set(favorisDisponiblesKey ? favorisDisponiblesKey.split(",") : []);
    setSelectionComparaison((selection) => selection.filter((slug) => disponibles.has(slug)));
  }, [favorisDisponiblesKey]);

  if (!pret) return <p role="status" className="empty-state">Chargement de vos favoris…</p>;

  function basculerComparaison(slug: string) {
    setSelectionComparaison((selection) => {
      const selectionCourante = selection.filter((element) => favorisDisponibles.has(element));
      return selectionCourante.includes(slug)
        ? selectionCourante.filter((element) => element !== slug)
        : selectionCourante.length < 3 ? [...selectionCourante, slug] : selectionCourante;
    });
  }
  const termeNormalise = normaliserRecherche(recherche);
  const genres = [...new Set(favoris.map((prenom) => prenom.genre))]
    .sort((a, b) => a.localeCompare(b, "fr"));
  const genreActifValide = genres.includes(genreActif) ? genreActif : "";

  function mettreAJourUrl(
    rechercheSuivante: string,
    genreSuivant: string,
    triSuivant: TriFavoris,
    nombreVisibleSuivant = 24
  ) {
    const url = new URL(window.location.href);
    const parametres: [string, string][] = [
      ["q", rechercheSuivante.trim()],
      ["genre", genreSuivant],
      ["tri", triSuivant === "enregistrement" ? "" : triSuivant],
      ["limite", nombreVisibleSuivant > 24 ? String(nombreVisibleSuivant) : ""]
    ];

    for (const [cle, valeur] of parametres) {
      if (valeur) url.searchParams.set(cle, valeur);
      else url.searchParams.delete(cle);
    }

    window.history.replaceState(null, "", url.toString());
  }

  function changerTri(value: string) {
    if (value === "enregistrement" || value === "nom-asc" || value === "nom-desc") {
      setNombreVisible(24);
      setTriActif(value);
      mettreAJourUrl(recherche, genreActifValide, value);
    }
  }

  const favorisFiltres = favoris.filter((prenom) => (
    (!termeNormalise || normaliserRecherche(prenom.nom).includes(termeNormalise))
    && (!genreActifValide || prenom.genre === genreActifValide)
  ));
  if (triActif !== "enregistrement") {
    favorisFiltres.sort((a, b) => {
      const ordre = a.nom.localeCompare(b.nom, "fr") || a.slug.localeCompare(b.slug, "fr");
      return triActif === "nom-asc" ? ordre : -ordre;
    });
  }
  const filtresActifs = Boolean(termeNormalise || genreActifValide);
  const nombreAffiche = Math.min(favorisFiltres.length, nombreVisible);

  function chargerPlus() {
    const suivant = nombreVisible + 24;
    setNombreVisible(suivant);
    mettreAJourUrl(recherche, genreActifValide, triActif, suivant);
  }

  async function copierFavorisFiltres() {
    setMessageCopie("");
    setErreurCopie("");

    if (!navigator.clipboard?.writeText) {
      setErreurCopie("La copie n’est pas disponible sur cet appareil ou a été refusée.");
      return;
    }

    try {
      await navigator.clipboard.writeText(favorisFiltres.map((prenom) => prenom.nom).join("\n"));
      setMessageCopie(`${favorisFiltres.length} ${favorisFiltres.length > 1 ? "prénoms copiés" : "prénom copié"} dans le presse-papiers.`);
    } catch {
      setErreurCopie("La copie n’est pas disponible sur cet appareil ou a été refusée.");
    }
  }

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
        <button
          className={styles.copyButton}
          type="button"
          disabled={favorisFiltres.length === 0}
          onClick={copierFavorisFiltres}
        >
          {favorisFiltres.length === 1
            ? "Copier le prénom"
            : favorisFiltres.length > 1
              ? `Copier les ${favorisFiltres.length} prénoms`
              : "Copier la liste filtrée"}
        </button>
        <label className={styles.importButton}>
          Importer une sauvegarde
          <input type="file" accept=".json,application/json" onChange={importerFavoris} />
        </label>
      </div>
      <p className={styles.help}>La sauvegarde contient uniquement les identifiants de vos favoris. L’import les ajoute à votre sélection actuelle, sans remplacer vos favoris existants. La copie reprend les noms de tous les résultats correspondant aux filtres, même au-delà des 24 premiers affichés.</p>
      {messageCopie && <p className={styles.success} role="status">{messageCopie}</p>}
      {erreurCopie && <p className={styles.error} role="alert">{erreurCopie}</p>}

      {messageImport && <p className={styles.success} role="status">{messageImport}</p>}
      {erreurImport && <p className={styles.error} role="alert">{erreurImport}</p>}
      {erreur && favoris.length > 0 && (
        <p className={styles.error} role="alert">
          Le stockage des favoris est indisponible ou contient des données illisibles. Vos modifications ne sont pas enregistrées.
        </p>
      )}

      {favoris.length === 0 ? (
        <div className={styles.empty}>
          <p className={erreur ? styles.error : undefined} role={erreur ? "alert" : undefined}>{erreur
            ? "Vos favoris ne peuvent pas être lus pour le moment."
            : slugs.length === 0
              ? "Vous n’avez pas encore enregistré de prénom."
              : "Aucun de vos favoris n’est actuellement publié."}</p>
          <Link className="button button-dark" href="/prenoms">Explorer les prénoms</Link>
        </div>
      ) : (
        <>
          <div className={styles.filters}>
            <ChampRecherche
              id="recherche-favoris"
              label="Rechercher dans mes favoris"
              placeholder="Saisissez un prénom..."
              value={recherche}
              onChange={(value) => {
                setNombreVisible(24);
                setRecherche(value);
                mettreAJourUrl(value, genreActifValide, triActif);
              }}
            />
            {genres.length > 1 && (
              <div className={styles.genre}>
                <label htmlFor="genre-favoris">Filtrer par genre</label>
                <select
                  id="genre-favoris"
                  value={genreActifValide}
                  onChange={(event) => {
                    setNombreVisible(24);
                    setGenreActif(event.target.value);
                    mettreAJourUrl(recherche, event.target.value, triActif);
                  }}
                >
                  <option value="">Tous les genres</option>
                  {genres.map((genre) => <option key={genre} value={genre}>{genre}</option>)}
                </select>
              </div>
            )}
            <div className={styles.sort}>
              <label htmlFor="tri-favoris">Trier les favoris</label>
              <select id="tri-favoris" value={triActif} onChange={(event) => changerTri(event.target.value)}>
                <option value="enregistrement">Ordre d’enregistrement</option>
                <option value="nom-asc">Nom · A à Z</option>
                <option value="nom-desc">Nom · Z à A</option>
              </select>
            </div>
          </div>
          <BarreComparaison
            prenoms={prenomsSelectionnes}
            onRetirer={basculerComparaison}
            onEffacer={() => setSelectionComparaison([])}
          />
          <p className={styles.count} role="status" aria-live="polite">
            {filtresActifs
              ? nombreAffiche + " " + (nombreAffiche === 1 ? "favori affiché" : "favoris affichés") + " sur " + favorisFiltres.length + (favorisFiltres.length === 1 ? " résultat" : " résultats")
              : nombreAffiche + " " + (nombreAffiche === 1 ? "favori affiché" : "favoris affichés") + " sur " + favoris.length + (favoris.length === 1 ? " favori enregistré" : " favoris enregistrés")}
          </p>
          {favorisFiltres.length === 0 ? (
            <div className={styles.empty}>
              <p>Aucun favori ne correspond à ces critères.</p>
              <button
                className="filter-reset"
                type="button"
                onClick={() => {
                  setRecherche("");
                  setGenreActif("");
                  setNombreVisible(24);
                  mettreAJourUrl("", "", triActif);
                }}
              >
                Effacer les filtres
              </button>
            </div>
          ) : (
            <div className="name-grid">
              {favorisFiltres.slice(0, nombreVisible).map((prenom) => (
                <article className={styles.row} key={prenom.slug}>
                  <Link
                    className="name-card"
                    href={creerUrlFicheDepuisFavoris(prenom.slug, {
                      q: recherche,
                      genre: genreActifValide || null,
                      tri: triActif,
                      limite: nombreVisible
                    })}
                  >
                    <span className="name-initial">{prenom.lettre}</span>
                    <span>
                      <strong>{prenom.nom}</strong>
                      <small>{prenom.genre}</small>
                    </span>
                    <span className="card-arrow" aria-hidden="true"><IconeMaterial name="arrow-up-right" /></span>
                  </Link>
                  <button
                    className={styles.compareToggle}
                    type="button"
                    aria-pressed={selectionValide.includes(prenom.slug)}
                    aria-label={`${selectionValide.includes(prenom.slug) ? "Retirer" : "Ajouter"} ${prenom.nom} ${selectionValide.includes(prenom.slug) ? "de" : "à"} la comparaison`}
                    disabled={!selectionValide.includes(prenom.slug) && selectionValide.length >= 3}
                    onClick={() => basculerComparaison(prenom.slug)}
                  >
                    <span className={styles.compareLabel}>{selectionValide.includes(prenom.slug) ? "Ajouté" : "Comparer"}</span>
                    <span className={styles.compareIcon} aria-hidden="true"><IconeMaterial name={selectionValide.includes(prenom.slug) ? "check" : "compare-arrows"} size={18} /></span>
                  </button>
                  <BoutonFavori slug={prenom.slug} afficherErreur={false} />
                </article>
              ))}
            </div>
          )}
          {favorisFiltres.length > nombreVisible && (
            <button
              className="filter-reset"
              type="button"
              onClick={chargerPlus}
            >
              Afficher les {Math.min(24, favorisFiltres.length - nombreVisible)} favoris suivants
            </button>
          )}
        </>
      )}
      {slugsIndisponibles.length > 0 && !erreur && (
        <div className={styles.stale}>
          <p className={styles.note} role="status">
            {slugsIndisponibles.length} {slugsIndisponibles.length > 1 ? "favoris ne sont plus" : "favori n’est plus"} publiés.
          </p>
          <button
            className="filter-reset"
            type="button"
            onClick={() => retirerPlusieurs(slugsIndisponibles)}
          >
            Retirer les favoris indisponibles
          </button>
        </div>
      )}
    </div>
  );
}
