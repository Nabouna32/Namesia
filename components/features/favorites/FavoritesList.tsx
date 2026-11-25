"use client";

import { useRef, useState, type ChangeEvent } from "react";
import Link from "next/link";
import type { PrenomIndex } from "@/lib/prenoms";
import type { NameGender } from "@/lib/gender-icons";
import { GenderIcon } from "@/components/features/names/GenderIcon";
import { GENDER_ICONS } from "@/lib/gender-icons";
import { LIMITE_FAVORIS, creerSauvegardeFavoris, lireSauvegardeFavoris } from "@/lib/sauvegarde-favoris";
import { normaliserRecherche, suggererPrenomsProches } from "@/lib/recherche-prenoms";
import { creerUrlFicheDepuisFavoris, type TriFavoris } from "@/lib/navigation-prenoms";
import { useFavorites } from "@/components/features/favorites/FavoritesProvider";
import styles from "./FavoritesList.module.css";
import { Icon } from "@/components/material3/Icon";
import { SearchBar } from "@/components/material3/SearchBar";
import { Button } from "@/components/material3/Button";
import { Snackbar } from "@/components/material3/Snackbar";
import { Card } from "@/components/material3/Card";
import { FilterChip } from "@/components/material3/FilterChip";

type Props = {
  prenoms: PrenomIndex[];
  initialRecherche?: string;
  initialGenre?: string;
  initialTri?: TriFavoris;
  initialNombreVisible?: number;
};

const TAILLE_MAX_SAUVEGARDE = 1_000_000;

export function FavoritesList({
  prenoms,
  initialRecherche = "",
  initialGenre = "",
  initialTri = "enregistrement",
  initialNombreVisible = 24
}: Props) {
  const { slugs, pret, erreur, retirerPlusieurs, ajouterPlusieurs } = useFavorites();
  const [messageImport, setMessageImport] = useState("");
  const [erreurImport, setErreurImport] = useState("");
  const [importPartiel, setImportPartiel] = useState(false);
  const [messageCopie, setMessageCopie] = useState("");
  const [erreurCopie, setErreurCopie] = useState("");
  const generationCopie = useRef(0);
  const [recherche, setRecherche] = useState(initialRecherche);
  const [genreActif, setGenreActif] = useState(initialGenre);
  const [triActif, setTriActif] = useState<TriFavoris>(initialTri);
  const [nombreVisible, setNombreVisible] = useState(initialNombreVisible);

  const parSlug = new Map(prenoms.map((prenom) => [prenom.slug, prenom]));
  const favoris = slugs.flatMap((slug) => {
    const prenom = parSlug.get(slug);
    return prenom ? [prenom] : [];
  });
  const slugsIndisponibles = slugs.filter((slug) => !parSlug.has(slug));
  if (!pret) return <p role="status" className="empty-state">Chargement de vos favoris…</p>;

  const termeNormalise = normaliserRecherche(recherche);
  const genres: NameGender[] = [...new Set(favoris.map((prenom) => prenom.genre))]
    .sort((a, b) => a.localeCompare(b, "fr"));
  const genreActifValide = genres.find((genre) => genre === genreActif) ?? "";

  function effacerFeedbackCopie() {
    generationCopie.current += 1;
    setMessageCopie("");
    setErreurCopie("");
  }

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

  function changerGenre(value: string) {
    effacerFeedbackCopie();
    setNombreVisible(24);
    setGenreActif(value);
    mettreAJourUrl(recherche, value, triActif);
  }

  function changerTri(value: string) {
    if (value === "enregistrement" || value === "nom-asc" || value === "nom-desc") {
      effacerFeedbackCopie();
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
  const favorisProches = favorisFiltres.length === 0 && termeNormalise
    ? suggererPrenomsProches(
      favoris.filter((prenom) => !genreActifValide || prenom.genre === genreActifValide),
      recherche
    )
    : [];
  const favorisAffiches = favorisFiltres.length > 0 ? favorisFiltres : favorisProches;
  const filtresActifs = Boolean(termeNormalise || genreActifValide);
  const nombreAffiche = Math.min(favorisFiltres.length, nombreVisible);

  function chargerPlus() {
    const suivant = nombreVisible + 24;
    setNombreVisible(suivant);
    mettreAJourUrl(recherche, genreActifValide, triActif, suivant);
  }

  async function copierFavorisFiltres() {
    const generation = ++generationCopie.current;
    setMessageCopie("");
    setErreurCopie("");

    if (!navigator.clipboard?.writeText) {
      if (generation === generationCopie.current) {
        setErreurCopie("La copie n’est pas disponible sur cet appareil ou a été refusée.");
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(favorisFiltres.map((prenom) => prenom.nom).join("\n"));
      if (generation === generationCopie.current) {
        setMessageCopie(`${favorisFiltres.length} ${favorisFiltres.length > 1 ? "prénoms copiés" : "prénom copié"} dans le presse-papiers.`);
      }
    } catch {
      if (generation === generationCopie.current) {
        setErreurCopie("La copie n’est pas disponible sur cet appareil ou a été refusée.");
      }
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

    effacerFeedbackCopie();
    setMessageImport("");
    setErreurImport("");
    setImportPartiel(false);

    if (fichier.size > TAILLE_MAX_SAUVEGARDE) {
      setErreurImport("Le fichier dépasse la taille maximale de 1 Mo.");
      return;
    }

    try {
      const contenu: unknown = JSON.parse(await fichier.text());
      const slugsImportes = lireSauvegardeFavoris(contenu);
      const resultat = ajouterPlusieurs(slugsImportes);
      if (resultat === null) return;
      setImportPartiel(resultat.nombreIgnoreLimite > 0);

      const messages = resultat.nombreAjoute > 0
        ? [`${resultat.nombreAjoute} ${resultat.nombreAjoute > 1 ? "favoris ajoutés" : "favori ajouté"} à votre sélection.`]
        : resultat.nombreIgnoreLimite > 0
          ? ["Aucun nouveau favori ajouté."]
          : ["Cette sauvegarde ne contient aucun nouveau favori."];
      if (resultat.nombreIgnoreLimite > 0) {
        messages.push(`${resultat.nombreIgnoreLimite} ${resultat.nombreIgnoreLimite > 1 ? "favoris ignorés" : "favori ignoré"} : la limite de ${LIMITE_FAVORIS.toLocaleString("fr-FR")} favoris est atteinte.`);
      }
      setMessageImport(messages.join(" "));
    } catch (cause) {
      setImportPartiel(false);
      setErreurImport(cause instanceof Error
        ? cause.message
        : "Le fichier n’a pas pu être lu.");
    }
  }

  return (
    <div className={styles.content}>
      <div className={styles.tools}>
        <Button disabled={slugs.length === 0} onClick={exporterFavoris}>
          Exporter mes favoris
        </Button>
        <Button
          variant="tonal"
          type="button"
          disabled={favorisFiltres.length === 0}
          onClick={copierFavorisFiltres}
        >
          {favorisFiltres.length === 1
            ? "Copier le prénom"
            : favorisFiltres.length > 1
              ? `Copier les ${favorisFiltres.length} prénoms`
              : "Copier la liste filtrée"}
        </Button>
        <label className={styles.importButton}>
          Importer une sauvegarde
          <input type="file" accept=".json,application/json" onChange={importerFavoris} />
        </label>
      </div>
      <p className={styles.help}>La sauvegarde contient uniquement les identifiants de vos favoris. L’import les ajoute à votre sélection actuelle, sans remplacer vos favoris existants. La copie reprend les noms de tous les résultats correspondant aux filtres, même au-delà des 24 premiers affichés.</p>
      {messageCopie && <Snackbar severity="success">{messageCopie}</Snackbar>}
      {erreurCopie && <Snackbar severity="error">{erreurCopie}</Snackbar>}

      {messageImport && <Snackbar severity={importPartiel ? "warning" : "success"}>{messageImport}</Snackbar>}
      {erreurImport && <Snackbar severity="error">{erreurImport}</Snackbar>}
      {erreur && favoris.length > 0 && (
        <Snackbar severity="error">
          Le stockage des favoris est indisponible ou contient des données illisibles. Vos modifications ne sont pas enregistrées.
        </Snackbar>
      )}

      {favoris.length === 0 ? (
        <div className={styles.empty}>
          <p className={erreur ? styles.error : undefined} role={erreur ? "alert" : undefined}>{erreur
            ? "Vos favoris ne peuvent pas être lus pour le moment."
            : slugs.length === 0
              ? "Vous n’avez pas encore enregistré de prénom."
              : "Aucun de vos favoris n’est actuellement publié."}</p>
          <Button href="/prenoms">Explorer les prénoms</Button>
        </div>
      ) : (
        <>
          <div className={styles.filters}>
            <SearchBar
              id="recherche-favoris"
              label="Rechercher dans mes favoris"
              placeholder="Saisissez un prénom..."
              value={recherche}
              onChange={(value) => {
                effacerFeedbackCopie();
                setNombreVisible(24);
                setRecherche(value);
                mettreAJourUrl(value, genreActifValide, triActif);
              }}
            />
            {genres.length > 1 && (
              <fieldset className="filter-group">
                <legend>Filtrer par genre</legend>
                <div className="filter-options">
                  <FilterChip label="Tous" selected={!genreActifValide} onClick={() => changerGenre("")} />
                  {genres.map((genre) => (
                    <FilterChip
                      key={genre}
                      label={genre}
                      leadingIcon={<Icon name={GENDER_ICONS[genre]} size={18} />}
                      iconOnly
                      selected={genreActifValide === genre}
                      onClick={() => changerGenre(genre)}
                    />
                  ))}
                </div>
              </fieldset>
            )}
            <div className={styles.selectField}>
              <label htmlFor="tri-favoris">Trier les favoris</label>
              <select id="tri-favoris" value={triActif} onChange={(event) => changerTri(event.currentTarget.value)}>
                <option value="enregistrement">Ordre d’enregistrement</option>
                <option value="nom-asc">Nom · A à Z</option>
                <option value="nom-desc">Nom · Z à A</option>
              </select>
            </div>
          </div>
          <p className={styles.count} role="status">
            {favorisFiltres.length === 0 && favorisProches.length > 0
              ? `Aucun résultat exact · ${favorisProches.length} ${favorisProches.length > 1 ? "suggestions proches" : "suggestion proche"} parmi vos favoris`
              : filtresActifs
                ? nombreAffiche + " " + (nombreAffiche === 1 ? "favori affiché" : "favoris affichés") + " sur " + favorisFiltres.length + (favorisFiltres.length === 1 ? " résultat" : " résultats")
                : nombreAffiche + " " + (nombreAffiche === 1 ? "favori affiché" : "favoris affichés") + " sur " + favoris.length + (favoris.length === 1 ? " favori enregistré" : " favoris enregistrés")}
          </p>
          {favorisFiltres.length === 0 && favorisProches.length === 0 ? (
            <div className={styles.empty}>
              <p>Aucun favori ne correspond à ces critères.</p>
              <Button variant="text"
                className="filter-action"
                type="button"
                onClick={() => {
                  effacerFeedbackCopie();
                  setRecherche("");
                  setGenreActif("");
                  setNombreVisible(24);
                  mettreAJourUrl("", "", triActif);
                }}
              >
                Effacer les filtres
              </Button>
            </div>
          ) : (
            <>
              {favorisProches.length > 0 && (
                <p className={styles.note}>Aucun résultat exact. Voici les prénoms les plus proches dans votre sélection.</p>
              )}
              <div className="name-grid">
              {favorisAffiches.slice(0, nombreVisible).map((prenom) => (
                <article className={styles.row} key={prenom.slug}>
                  <Card as={Link} variant="elevated" interactive
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
                      <GenderIcon gender={prenom.genre} />
                    </span>
                    <span className="card-arrow" aria-hidden="true"><Icon name="arrow-up-right" /></span>
                  </Card>
                </article>
              ))}
              </div>
            </>
          )}
          {favorisFiltres.length > nombreVisible && (
            <Button variant="text"
              className="filter-action"
              type="button"
              onClick={chargerPlus}
            >
              Afficher les {Math.min(24, favorisFiltres.length - nombreVisible)} favoris suivants
            </Button>
          )}
        </>
      )}
      {slugsIndisponibles.length > 0 && !erreur && (
        <div className={styles.stale}>
          <p className={styles.note} role="status">
            {slugsIndisponibles.length} {slugsIndisponibles.length > 1 ? "favoris ne sont plus" : "favori n’est plus"} publiés.
          </p>
          <Button variant="text"
            className="filter-action"
            type="button"
            onClick={() => retirerPlusieurs(slugsIndisponibles)}
          >
            Retirer les favoris indisponibles
          </Button>
        </div>
      )}
    </div>
  );
}
