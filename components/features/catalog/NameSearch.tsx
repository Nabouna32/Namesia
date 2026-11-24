"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { PrenomIndex } from "@/lib/prenoms";
import { GenreIcon } from "@/components/features/names/GenreIcon";
import { GENRE_ICONS } from "@/lib/genre-icons";
import styles from "./NameSearch.module.css";
import { comparerPertinence, normaliserRecherche, suggererPrenomsProches } from "@/lib/recherche-prenoms";
import { creerUrlCatalogueDepuisRecherche, creerUrlFicheDepuisCatalogue } from "@/lib/navigation-prenoms";
import { Icon } from "@/components/material3/Icon";
import { SearchBar } from "@/components/material3/SearchBar";
import { Button } from "@/components/material3/Button";
import { ShareLink } from "@/components/features/sharing/ShareLink";
import { FilterChip } from "@/components/material3/FilterChip";
import { Snackbar } from "@/components/material3/Snackbar";
import { Card } from "@/components/material3/Card";

type Props = {
  prenoms: PrenomIndex[];
  compact?: boolean;
  synchroniserUrl?: boolean;
  initialRecherche?: string;
  initialGenre?: string | null;
  initialLettre?: string | null;
  initialNombreVisible?: number;
};

export function NameSearch({
  prenoms,
  compact = false,
  synchroniserUrl = false,
  initialRecherche = "",
  initialGenre = null,
  initialLettre = null,
  initialNombreVisible = 24
}: Props) {
  const [recherche, setRecherche] = useState(initialRecherche);
  const [genreActif, setGenreActif] = useState(initialGenre);
  const [lettreActive, setLettreActive] = useState(initialLettre);
  const [nombreVisible, setNombreVisible] = useState(initialNombreVisible);
  const [messageCopie, setMessageCopie] = useState("");
  const [erreurCopie, setErreurCopie] = useState("");
  const generationCopie = useRef(0);

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
    if (resultats.length > 0) return [];
    const candidats = prenoms.filter((prenom) => (
      (!genreActif || prenom.genre === genreActif)
      && (!lettreActive || normaliserRecherche(prenom.lettre) === lettreActive)
    ));
    return suggererPrenomsProches(candidats, recherche);
  }, [genreActif, lettreActive, prenoms, recherche, resultats.length]);

  const filtresActifs = Boolean(recherche.trim() || genreActif || lettreActive);
  const contexteRetour = synchroniserUrl
    ? { q: recherche, genre: genreActif, lettre: lettreActive, limite: nombreVisible }
    : null;

  function mettreAJourUrl(
    rechercheSuivante: string,
    genreSuivant: string | null,
    lettreSuivante: string | null,
    nombreVisibleSuivant = 24
  ) {
    if (!synchroniserUrl) return;

    const url = new URL(window.location.href);
    const parametres: [string, string][] = [
      ["q", rechercheSuivante.trim()],
      ["genre", genreSuivant ?? ""],
      ["lettre", lettreSuivante ?? ""],
      ["limite", nombreVisibleSuivant > 24 ? String(nombreVisibleSuivant) : ""]
    ];

    for (const [cle, valeur] of parametres) {
      if (valeur) url.searchParams.set(cle, valeur);
      else url.searchParams.delete(cle);
    }

    window.history.replaceState(null, "", url.toString());
  }

  function effacerFeedbackCopie() {
    generationCopie.current += 1;
    setMessageCopie("");
    setErreurCopie("");
  }

  function changerRecherche(value: string) {
    effacerFeedbackCopie();
    setNombreVisible(24);
    setRecherche(value);
    mettreAJourUrl(value, genreActif, lettreActive);
  }

  function changerGenre(value: string | null) {
    effacerFeedbackCopie();
    setNombreVisible(24);
    setGenreActif(value);
    mettreAJourUrl(recherche, value, lettreActive);
  }

  function changerLettre(value: string | null) {
    effacerFeedbackCopie();
    setNombreVisible(24);
    setLettreActive(value);
    mettreAJourUrl(recherche, genreActif, value);
  }

  function effacerFiltres() {
    effacerFeedbackCopie();
    setNombreVisible(24);
    setRecherche("");
    setGenreActif(null);
    setLettreActive(null);
    mettreAJourUrl("", null, null);
  }

  function chargerPlus() {
    const suivant = nombreVisible + 24;
    setNombreVisible(suivant);
    mettreAJourUrl(recherche, genreActif, lettreActive, suivant);
  }
  async function copierResultats() {
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
      await navigator.clipboard.writeText(resultats.map((prenom) => prenom.nom).join("\n"));
      if (generation === generationCopie.current) {
        setMessageCopie(`${resultats.length} ${resultats.length > 1 ? "prénoms copiés" : "prénom copié"} dans le presse-papiers.`);
      }
    } catch {
      if (generation === generationCopie.current) {
        setErreurCopie("La copie n’est pas disponible sur cet appareil ou a été refusée.");
      }
    }
  }


  return (
    <div className={compact ? "search search-compact" : "search"}>
      <SearchBar
        id={compact ? "recherche-accueil" : "recherche-catalogue"}
        label="Rechercher un prénom"
        placeholder="Quel prénom cherchez-vous ?"
        value={recherche}
        onChange={changerRecherche}
      />

      {!compact && (
        <div className="catalogue-filters">
          {genres.length > 1 && (
            <fieldset className="filter-group">
              <legend>Explorer par genre</legend>
              <div className="filter-options">
                <FilterChip label="Tous" selected={genreActif === null} onClick={() => changerGenre(null)} />
                {genres.map((genre) => (
                  <FilterChip
                    key={genre}
                    label={genre}
                    leadingIcon={<Icon name={GENRE_ICONS[genre]} size={18} />}
                    iconOnly
                    selected={genreActif === genre}
                    onClick={() => changerGenre(genre)}
                  />
                ))}
              </div>
            </fieldset>
          )}

          {lettres.length > 1 && (
            <fieldset className="filter-group">
              <legend>Explorer par initiale</legend>
              <div className="filter-options filter-letters">
                <FilterChip label="Toutes" selected={lettreActive === null} onClick={() => changerLettre(null)} />
                {lettres.map((lettre) => (
                  <FilterChip
                    key={lettre}
                    label={lettre.toLocaleUpperCase("fr")}
                    selected={lettreActive === lettre}
                    onClick={() => changerLettre(lettre)}
                  />
                ))}
              </div>
            </fieldset>
          )}

          {filtresActifs && (
            <Button variant="text" className="filter-action" type="button" onClick={effacerFiltres}>
              Réinitialiser les filtres
            </Button>
          )}
        </div>
      )}

      {!compact && synchroniserUrl && (filtresActifs || nombreVisible > 24) && (
        <ShareLink
          title="Recherche de prénoms · Namesia"
          text="Retrouvez cette sélection de prénoms sur Namesia."
          label="Partager cette recherche"
          queryParameters={["q", "genre", "lettre", "limite"]}
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
          {!compact && resultats.length > 0 && (
            <div className={styles.resultActions}>
              <Button variant="tonal" type="button" onClick={copierResultats}>
                {resultats.length > 1 ? `Copier les ${resultats.length} prénoms` : "Copier le prénom"}
              </Button>
              {messageCopie && <Snackbar severity="success">{messageCopie}</Snackbar>}
              {erreurCopie && <Snackbar severity="error">{erreurCopie}</Snackbar>}
            </div>
          )}
          {resultats.length > 0 ? (
            <>
              <div className={styles.resultsGrid}>
                {resultats.slice(0, nombreVisible).map((prenom) => (
                  <article className={styles.resultCard} key={prenom.slug}>
                    <Card as={Link} variant="elevated" interactive className="name-card" href={creerUrlFicheDepuisCatalogue(prenom.slug, contexteRetour)}>
                      <span className="name-initial">{prenom.lettre}</span>
                      <span>
                        <strong>{prenom.nom}</strong>
                        <GenreIcon genre={prenom.genre} />
                      </span>
                      <span className="card-arrow" aria-hidden="true"><Icon name="arrow-up-right" /></span>
                    </Card>

                  </article>
                ))}
              </div>
            {compact && resultats.length > nombreVisible && (
              <Link className="text-link" href={creerUrlCatalogueDepuisRecherche(recherche)}>
                Voir tous les résultats dans le catalogue <Icon name="arrow-up-right" size={18} />
              </Link>
            )}
            {!compact && resultats.length > nombreVisible && (
              <Button variant="text"
                className="filter-action"
                type="button"
                onClick={chargerPlus}
              >
                Afficher les {Math.min(24, resultats.length - nombreVisible)} prénoms suivants
              </Button>
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
                    <Card as={Link} variant="elevated" interactive className="name-card" href={creerUrlFicheDepuisCatalogue(prenom.slug, contexteRetour)}>
                      <span className="name-initial">{prenom.lettre}</span>
                      <span>
                        <strong>{prenom.nom}</strong>
                        <GenreIcon genre={prenom.genre} />
                      </span>
                      <span className="card-arrow" aria-hidden="true"><Icon name="arrow-up-right" /></span>
                    </Card>

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
                <Button variant="text" className="filter-action" type="button" onClick={effacerFiltres}>
                  Voir tous les prénoms
                </Button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
