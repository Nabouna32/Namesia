"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { BarreComparaison } from "@/components/barre-comparaison";
import { BoutonFavori } from "@/components/bouton-favori";
import { useFavoris } from "@/components/favoris-provider";
import styles from "./recherche-prenoms.module.css";
import type { PrenomIndex } from "@/lib/prenoms";
import { comparerPertinence, normaliserRecherche } from "@/lib/recherche-prenoms";
import { creerUrlFicheDepuisCatalogue } from "@/lib/navigation-prenoms";

type Props = {
  prenoms: PrenomIndex[];
  compact?: boolean;
  synchroniserUrl?: boolean;
  initialRecherche?: string;
  initialGenre?: string | null;
  initialLettre?: string | null;
};

function distanceEdition(a: string, b: string, limite: number): number {
  if (Math.abs(a.length - b.length) > limite) return limite + 1;
  let precedent = Array.from({ length: b.length + 1 }, (_, index) => index);

  for (let i = 1; i <= a.length; i += 1) {
    const courant = [i];
    let minimum = i;

    for (let j = 1; j <= b.length; j += 1) {
      const cout = a[i - 1] === b[j - 1] ? 0 : 1;
      courant[j] = Math.min(
        precedent[j] + 1,
        courant[j - 1] + 1,
        precedent[j - 1] + cout
      );
      minimum = Math.min(minimum, courant[j]);
    }

    if (minimum > limite) return limite + 1;
    precedent = courant;
  }

  return precedent[b.length];
}

export function RecherchePrenoms({
  prenoms,
  compact = false,
  synchroniserUrl = false,
  initialRecherche = "",
  initialGenre = null,
  initialLettre = null
}: Props) {
  const { erreur: erreurFavoris } = useFavoris();
  const [recherche, setRecherche] = useState(initialRecherche);
  const [genreActif, setGenreActif] = useState(initialGenre);
  const [lettreActive, setLettreActive] = useState(initialLettre);
  const [nombreVisible, setNombreVisible] = useState(24);
  const [selectionComparaison, setSelectionComparaison] = useState<string[]>([]);

  const genres = useMemo(
    () => [...new Set(prenoms.map((prenom) => prenom.genre))].sort((a, b) => a.localeCompare(b, "fr")),
    [prenoms]
  );
  const lettres = useMemo(
    () => [...new Set(prenoms.map((prenom) => normaliserRecherche(prenom.lettre)))].sort((a, b) => a.localeCompare(b, "fr")),
    [prenoms]
  );

  const resultats = useMemo(() => {
    const terme = normaliserRecherche(recherche);
    return prenoms
      .filter((prenom) => {
        const correspondAuNom = !terme || normaliserRecherche(prenom.nom).includes(terme);
        const correspondAuGenre = !genreActif || prenom.genre === genreActif;
        const correspondALaLettre = !lettreActive || normaliserRecherche(prenom.lettre) === lettreActive;
        return correspondAuNom && correspondAuGenre && correspondALaLettre;
      })
      .sort((a, b) => comparerPertinence(a, b, terme));
  }, [genreActif, lettreActive, prenoms, recherche]);

  const suggestions = useMemo(() => {
    const terme = normaliserRecherche(recherche);
    if (resultats.length > 0 || terme.length < 4) return [];

    const limite = terme.length >= 8 ? 2 : 1;
    return prenoms
      .flatMap((prenom) => {
        const nom = normaliserRecherche(prenom.nom);
        if ((genreActif && prenom.genre !== genreActif)
          || (lettreActive && normaliserRecherche(prenom.lettre) !== lettreActive)) {
          return [];
        }

        const distance = distanceEdition(terme, nom, limite);
        return distance <= limite ? [{ prenom, distance }] : [];
      })
      .sort((a, b) => a.distance - b.distance || a.prenom.nom.localeCompare(b.prenom.nom, "fr"))
      .slice(0, 5)
      .map(({ prenom }) => prenom);
  }, [genreActif, lettreActive, prenoms, recherche, resultats.length]);

  const prenomsSelectionnes = selectionComparaison.flatMap((slug) => {
    const prenom = prenoms.find((candidat) => candidat.slug === slug);
    return prenom ? [prenom] : [];
  });

  const filtresActifs = Boolean(recherche.trim() || genreActif || lettreActive);
  const contexteRetour = synchroniserUrl
    ? { q: recherche, genre: genreActif, lettre: lettreActive }
    : null;

  function basculerComparaison(slug: string) {
    setSelectionComparaison((selection) => selection.includes(slug)
      ? selection.filter((element) => element !== slug)
      : selection.length < 3 ? [...selection, slug] : selection);
  }

  function mettreAJourUrl(
    rechercheSuivante: string,
    genreSuivant: string | null,
    lettreSuivante: string | null
  ) {
    if (!synchroniserUrl) return;

    const url = new URL(window.location.href);
    const parametres: [string, string][] = [
      ["q", rechercheSuivante.trim()],
      ["genre", genreSuivant ?? ""],
      ["lettre", lettreSuivante ?? ""]
    ];

    for (const [cle, valeur] of parametres) {
      if (valeur) url.searchParams.set(cle, valeur);
      else url.searchParams.delete(cle);
    }

    window.history.replaceState(null, "", url.toString());
  }

  function changerRecherche(value: string) {
    setNombreVisible(24);
    setRecherche(value);
    mettreAJourUrl(value, genreActif, lettreActive);
  }

  function changerGenre(value: string | null) {
    setNombreVisible(24);
    setGenreActif(value);
    mettreAJourUrl(recherche, value, lettreActive);
  }

  function changerLettre(value: string | null) {
    setNombreVisible(24);
    setLettreActive(value);
    mettreAJourUrl(recherche, genreActif, value);
  }

  function effacerFiltres() {
    setNombreVisible(24);
    setRecherche("");
    setGenreActif(null);
    setLettreActive(null);
    mettreAJourUrl("", null, null);
  }

  return (
    <div className={compact ? "search search-compact" : "search"}>
      <label className="sr-only" htmlFor={compact ? "recherche-accueil" : "recherche-catalogue"}>Rechercher un prénom</label>
      <div className="search-field">
        <span aria-hidden="true" className="search-icon">⌕</span>
        <input
          id={compact ? "recherche-accueil" : "recherche-catalogue"}
          type="search"
          placeholder="Quel prénom cherchez-vous ?"
          value={recherche}
          onChange={(event) => changerRecherche(event.target.value)}
        />
        {recherche && (
          <button className="clear-search" type="button" onClick={() => changerRecherche("")}>
            Effacer
          </button>
        )}
      </div>

      {!compact && (
        <div className="catalogue-filters">
          {genres.length > 1 && (
            <fieldset className="filter-group">
              <legend>Explorer par genre</legend>
              <div className="filter-options">
                <button
                  className="filter-chip"
                  type="button"
                  aria-pressed={genreActif === null}
                  onClick={() => changerGenre(null)}
                >
                  Tous
                </button>
                {genres.map((genre) => (
                  <button
                    className="filter-chip"
                    type="button"
                    key={genre}
                    aria-pressed={genreActif === genre}
                    onClick={() => changerGenre(genre)}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </fieldset>
          )}

          {lettres.length > 1 && (
            <fieldset className="filter-group">
              <legend>Explorer par initiale</legend>
              <div className="filter-options filter-letters">
                <button
                  className="filter-chip"
                  type="button"
                  aria-pressed={lettreActive === null}
                  onClick={() => changerLettre(null)}
                >
                  Toutes
                </button>
                {lettres.map((lettre) => (
                  <button
                    className="filter-chip filter-letter"
                    type="button"
                    key={lettre}
                    aria-pressed={lettreActive === lettre}
                    onClick={() => changerLettre(lettre)}
                  >
                    {lettre.toLocaleUpperCase("fr")}
                  </button>
                ))}
              </div>
            </fieldset>
          )}

          {filtresActifs && (
            <button className="filter-reset" type="button" onClick={effacerFiltres}>
              Réinitialiser les filtres
            </button>
          )}
        </div>
      )}

      {!compact && (
        <BarreComparaison
          prenoms={prenomsSelectionnes}
          onRetirer={basculerComparaison}
          onEffacer={() => setSelectionComparaison([])}
        />
      )}

      {(!compact || recherche.trim()) && (
        <div className="search-results">
          <p className={compact ? "results-meta sr-only" : "results-meta"} role="status">
            {resultats.length > 0
              ? `${resultats.length} ${resultats.length > 1 ? "prénoms" : "prénom"}${compact ? (resultats.length > 1 ? " trouvés" : " trouvé") : ` trouvés · ${Math.min(resultats.length, nombreVisible)} affichés`}`
              : suggestions.length > 0
                ? `${suggestions.length} suggestions proches`
                : `0 résultat affiché sur ${prenoms.length}`}
          </p>
          {erreurFavoris && (
            <p className={styles.favoriteError} role="alert">
              Le stockage des favoris est indisponible ou contient des données illisibles. Vos modifications ne sont pas enregistrées.
            </p>
          )}
          {resultats.length > 0 ? (
            <>
              <div className={styles.resultsGrid}>
                {resultats.slice(0, nombreVisible).map((prenom) => (
                  <article className={styles.resultCard} key={prenom.slug}>
                    <Link className={`name-card ${styles.resultLink}`} href={creerUrlFicheDepuisCatalogue(prenom.slug, contexteRetour)}>
                      <span className="name-initial">{prenom.lettre}</span>
                      <span>
                        <strong>{prenom.nom}</strong>
                        <small>{prenom.genre} · Découvrir la fiche</small>
                      </span>
                      <span className="card-arrow" aria-hidden="true">↗</span>
                    </Link>
                    {!compact && (
                      <button
                        className={styles.compareToggle}
                        type="button"
                        aria-pressed={selectionComparaison.includes(prenom.slug)}
                        aria-label={`${selectionComparaison.includes(prenom.slug) ? "Retirer" : "Ajouter"} ${prenom.nom} ${selectionComparaison.includes(prenom.slug) ? "de" : "à"} la comparaison`}
                        disabled={!selectionComparaison.includes(prenom.slug) && selectionComparaison.length >= 3}
                        onClick={() => basculerComparaison(prenom.slug)}
                      >
                        <span className={styles.compareLabel}>{selectionComparaison.includes(prenom.slug) ? "Ajouté" : "Comparer"}</span>
                        <span className={styles.compareIcon} aria-hidden="true">{selectionComparaison.includes(prenom.slug) ? "✓" : "⇄"}</span>
                      </button>
                    )}
                    <BoutonFavori slug={prenom.slug} nom={prenom.nom} compact afficherErreur={false} />
                  </article>
                ))}
              </div>
            {resultats.length > nombreVisible && (
              <button
                className="filter-reset"
                type="button"
                onClick={() => setNombreVisible((visible) => visible + 24)}
              >
                Afficher les {Math.min(24, resultats.length - nombreVisible)} prénoms suivants
              </button>
            )}
            </>
          ) : suggestions.length > 0 ? (
            <div className="empty-results">
              <p className="empty-state">
                Aucun résultat exact pour « {recherche.trim()} ». Voici les prénoms les plus proches :
              </p>
              <div className={styles.resultsGrid}>
                {suggestions.map((prenom) => (
                  <article className={styles.resultCard} key={prenom.slug}>
                    <Link className={`name-card ${styles.resultLink}`} href={creerUrlFicheDepuisCatalogue(prenom.slug, contexteRetour)}>
                      <span className="name-initial">{prenom.lettre}</span>
                      <span><strong>{prenom.nom}</strong><small>{prenom.genre} · Suggestion proche</small></span>
                      <span className="card-arrow" aria-hidden="true">↗</span>
                    </Link>
                    {!compact && (
                      <button
                        className={styles.compareToggle}
                        type="button"
                        aria-pressed={selectionComparaison.includes(prenom.slug)}
                        aria-label={`${selectionComparaison.includes(prenom.slug) ? "Retirer" : "Ajouter"} ${prenom.nom} ${selectionComparaison.includes(prenom.slug) ? "de" : "à"} la comparaison`}
                        disabled={!selectionComparaison.includes(prenom.slug) && selectionComparaison.length >= 3}
                        onClick={() => basculerComparaison(prenom.slug)}
                      >
                        <span className={styles.compareLabel}>{selectionComparaison.includes(prenom.slug) ? "Ajouté" : "Comparer"}</span>
                        <span className={styles.compareIcon} aria-hidden="true">{selectionComparaison.includes(prenom.slug) ? "✓" : "⇄"}</span>
                      </button>
                    )}
                    <BoutonFavori slug={prenom.slug} nom={prenom.nom} compact afficherErreur={false} />
                  </article>
                ))}
              </div>
            </div>
          ) : (
            <div className="empty-results">
              <p className="empty-state">
                {filtresActifs
                  ? "Aucun prénom ne correspond à ces critères. Essayez d’élargir votre recherche."
                  : "Aucun prénom n’est encore publié."}
              </p>
              {filtresActifs && (
                <button className="filter-reset" type="button" onClick={effacerFiltres}>
                  Voir tous les prénoms
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
