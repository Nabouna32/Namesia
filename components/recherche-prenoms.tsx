"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Prenom } from "@/lib/prenoms";

type Props = { prenoms: Prenom[]; compact?: boolean };

function normaliserRecherche(value: string): string {
  return value.trim().normalize("NFD").replace(/\p{Diacritic}/gu, "").toLocaleLowerCase("fr");
}

export function RecherchePrenoms({ prenoms, compact = false }: Props) {
  const [recherche, setRecherche] = useState("");
  const [genreActif, setGenreActif] = useState<string | null>(null);
  const [lettreActive, setLettreActive] = useState<string | null>(null);

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
    return prenoms.filter((prenom) => {
      const correspondAuNom = !terme || normaliserRecherche(prenom.nom).includes(terme);
      const correspondAuGenre = !genreActif || prenom.genre === genreActif;
      const correspondALaLettre = !lettreActive || normaliserRecherche(prenom.lettre) === lettreActive;
      return correspondAuNom && correspondAuGenre && correspondALaLettre;
    });
  }, [genreActif, lettreActive, prenoms, recherche]);

  const filtresActifs = Boolean(recherche.trim() || genreActif || lettreActive);

  function effacerFiltres() {
    setRecherche("");
    setGenreActif(null);
    setLettreActive(null);
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
          onChange={(event) => setRecherche(event.target.value)}
        />
        {recherche && (
          <button className="clear-search" type="button" onClick={() => setRecherche("")}>
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
                  onClick={() => setGenreActif(null)}
                >
                  Tous
                </button>
                {genres.map((genre) => (
                  <button
                    className="filter-chip"
                    type="button"
                    key={genre}
                    aria-pressed={genreActif === genre}
                    onClick={() => setGenreActif(genre)}
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
                  onClick={() => setLettreActive(null)}
                >
                  Toutes
                </button>
                {lettres.map((lettre) => (
                  <button
                    className="filter-chip filter-letter"
                    type="button"
                    key={lettre}
                    aria-pressed={lettreActive === lettre}
                    onClick={() => setLettreActive(lettre)}
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
