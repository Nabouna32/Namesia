"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Prenom } from "@/lib/prenoms";

type Props = {
  prenoms: Prenom[];
  compact?: boolean;
  synchroniserUrl?: boolean;
  initialRecherche?: string;
  initialGenre?: string | null;
  initialLettre?: string | null;
};

function normaliserRecherche(value: string): string {
  return value.trim().normalize("NFD").replace(/\p{Diacritic}/gu, "").toLocaleLowerCase("fr");
}

function comparerPertinence(a: Prenom, b: Prenom, terme: string): number {
  if (!terme) return a.nom.localeCompare(b.nom, "fr");
  const nomA = normaliserRecherche(a.nom);
  const nomB = normaliserRecherche(b.nom);
  const rangA = nomA === terme ? 0 : nomA.startsWith(terme) ? 1 : 2;
  const rangB = nomB === terme ? 0 : nomB.startsWith(terme) ? 1 : 2;
  return rangA - rangB || a.nom.localeCompare(b.nom, "fr");
}

export function RecherchePrenoms({
  prenoms,
  compact = false,
  synchroniserUrl = false,
  initialRecherche = "",
  initialGenre = null,
  initialLettre = null
}: Props) {
  const [recherche, setRecherche] = useState(initialRecherche);
  const [genreActif, setGenreActif] = useState(initialGenre);
  const [lettreActive, setLettreActive] = useState(initialLettre);

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

  const filtresActifs = Boolean(recherche.trim() || genreActif || lettreActive);

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
    setRecherche(value);
    mettreAJourUrl(value, genreActif, lettreActive);
  }

  function changerGenre(value: string | null) {
    setGenreActif(value);
    mettreAJourUrl(recherche, value, lettreActive);
  }

  function changerLettre(value: string | null) {
    setLettreActive(value);
    mettreAJourUrl(recherche, genreActif, value);
  }

  function effacerFiltres() {
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

      {(!compact || recherche.trim()) && (
        <div className="search-results">
          <p className={compact ? "results-meta sr-only" : "results-meta"} role="status">
            {resultats.length} {resultats.length > 1 ? "prénoms" : "prénom"}
            {compact
              ? recherche.trim()
                ? (resultats.length > 1 ? " trouvés" : " trouvé")
                : " à découvrir"
              : ` affichés sur ${prenoms.length}`}
          </p>
          {resultats.length > 0 ? (
            <div className="name-grid">
              {resultats.map((prenom) => (
                <Link className="name-card" href={`/prenoms/${prenom.slug}`} key={prenom.slug}>
                  <span className="name-initial">{prenom.lettre}</span>
                  <span>
                    <strong>{prenom.nom}</strong>
                    <small>Découvrir la fiche</small>
                  </span>
                  <span className="card-arrow" aria-hidden="true">↗</span>
                </Link>
              ))}
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
