"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { BarreComparaison } from "@/components/barre-comparaison";
import { BoutonFavori } from "@/components/bouton-favori";
import { useFavoris } from "@/components/favoris-provider";
import styles from "./recherche-prenoms.module.css";
import type { PrenomIndex } from "@/lib/prenoms";
import { comparerPertinence, normaliserRecherche, suggererPrenomsProches } from "@/lib/recherche-prenoms";
import { creerUrlCatalogueDepuisRecherche, creerUrlFicheDepuisCatalogue } from "@/lib/navigation-prenoms";
import { IconeMaterial } from "./icone-material";
import { SearchBar } from "@/components/ui/SearchBar";
import { ComparisonButton } from "@/components/ui/ComparisonButton";
import { Button } from "@/components/ui/Button";
import { PartagerLien } from "@/components/partager-fiche";
import { FilterChip } from "@/components/ui/FilterChip";

type Props = {
  prenoms: PrenomIndex[];
  compact?: boolean;
  synchroniserUrl?: boolean;
  initialRecherche?: string;
  initialGenre?: string | null;
  initialLettre?: string | null;
  initialNombreVisible?: number;
};

export function RecherchePrenoms({
  prenoms,
  compact = false,
  synchroniserUrl = false,
  initialRecherche = "",
  initialGenre = null,
  initialLettre = null,
  initialNombreVisible = 24
}: Props) {
  const { erreur: erreurFavoris } = useFavoris();
  const [recherche, setRecherche] = useState(initialRecherche);
  const [genreActif, setGenreActif] = useState(initialGenre);
  const [lettreActive, setLettreActive] = useState(initialLettre);
  const [nombreVisible, setNombreVisible] = useState(initialNombreVisible);
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
    if (resultats.length > 0) return [];
    const candidats = prenoms.filter((prenom) => (
      (!genreActif || prenom.genre === genreActif)
      && (!lettreActive || normaliserRecherche(prenom.lettre) === lettreActive)
    ));
    return suggererPrenomsProches(candidats, recherche);
  }, [genreActif, lettreActive, prenoms, recherche, resultats.length]);

  const prenomsSelectionnes = selectionComparaison.flatMap((slug) => {
    const prenom = prenoms.find((candidat) => candidat.slug === slug);
    return prenom ? [prenom] : [];
  });

  const filtresActifs = Boolean(recherche.trim() || genreActif || lettreActive);
  const contexteRetour = synchroniserUrl
    ? { q: recherche, genre: genreActif, lettre: lettreActive, limite: nombreVisible }
    : null;

  function basculerComparaison(slug: string) {
    setSelectionComparaison((selection) => selection.includes(slug)
      ? selection.filter((element) => element !== slug)
      : selection.length < 3 ? [...selection, slug] : selection);
  }

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

  function chargerPlus() {
    const suivant = nombreVisible + 24;
    setNombreVisible(suivant);
    mettreAJourUrl(recherche, genreActif, lettreActive, suivant);
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
                    selected={genreActif === genre}
                    onClick={() => changerGenre(genre)}
                  />
                ))}
              </div>
            </fieldset>
          )}

          {lettres.length > 1 && (
            <fieldset className="filter-group">
              <legend>Explorer par initial</legend>
              <div className="filter-options filter-letters">
                <FilterChip label="Toutes" selected={lettreActive === null} onClick={() => changerLettre(null)} />
                {lettres.map((lettre) => (
                  <FilterChip
                    key={lettre}
                    label={lettre.toLocaleUpperCase("fr")}
                    selected={lettreActive === lettre}
                    initial
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
        <PartagerLien
          titre="Recherche de prénoms · Namesia"
          texte="Retrouvez cette sélection de prénoms sur Namesia."
          label="Partager cette recherche"
          parametres={["q", "genre", "lettre", "limite"]}
        />
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
                      <span className="card-arrow" aria-hidden="true"><IconeMaterial name="arrow-up-right" /></span>
                    </Link>
                    {!compact && (
                      <ButtonComparaison
                        prenom={prenom.nom}
                        selected={selectionComparaison.includes(prenom.slug)}
                        desactive={!selectionComparaison.includes(prenom.slug) && selectionComparaison.length >= 3}
                        onClick={() => basculerComparaison(prenom.slug)}
                      />
                    )}
                    <ButtonFavori slug={prenom.slug} nom={prenom.nom} compact afficherErreur={false} />
                  </article>
                ))}
              </div>
            {compact && resultats.length > nombreVisible && (
              <Link className="text-link" href={creerUrlCatalogueDepuisRecherche(recherche)}>
                Voir tous les résultats dans le catalogue <IconeMaterial name="arrow-up-right" size={18} />
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
                    <Link className={`name-card ${styles.resultLink}`} href={creerUrlFicheDepuisCatalogue(prenom.slug, contexteRetour)}>
                      <span className="name-initial">{prenom.lettre}</span>
                      <span><strong>{prenom.nom}</strong><small>{prenom.genre} · Suggestion proche</small></span>
                      <span className="card-arrow" aria-hidden="true"><IconeMaterial name="arrow-up-right" /></span>
                    </Link>
                    {!compact && (
                      <ButtonComparaison
                        prenom={prenom.nom}
                        selected={selectionComparaison.includes(prenom.slug)}
                        desactive={!selectionComparaison.includes(prenom.slug) && selectionComparaison.length >= 3}
                        onClick={() => basculerComparaison(prenom.slug)}
                      />
                    )}
                    <ButtonFavori slug={prenom.slug} nom={prenom.nom} compact afficherErreur={false} />
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
