"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { creerUrlFicheDepuisComparateur } from "@/lib/navigation-prenoms";
import type { Prenom, PrenomIndex } from "@/lib/prenoms";
import { PartagerLien } from "@/components/partager-fiche";
import { FavoriteButton } from "@/components/features/favorites/FavoriteButton";
import { useFavoris } from "@/components/favoris-provider";
import { comparerPertinence, normaliserRecherche, suggererPrenomsProches } from "@/lib/recherche-prenoms";
import { categoryTone } from "@/lib/category-color";
import { SearchBar } from "@/components/material3/SearchBar";
import { ComparisonSelection } from "@/components/features/comparison/ComparisonSelection";
import { Button } from "@/components/material3/Button";

type Props = { prenoms: PrenomIndex[]; selectionInitiale: string[] };


export function ComparateurPrenoms({ prenoms, selectionInitiale }: Props) {
  const [recherche, setRecherche] = useState("");
  const [nombreVisible, setNombreVisible] = useState(24);
  const [selection, setSelection] = useState<string[]>(selectionInitiale);
  const [fiches, setFiches] = useState<Record<string, Prenom>>({});
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState(false);
  const [tentative, setTentative] = useState(0);
  const { erreur: erreurFavoris } = useFavoris();
  const selectionInitialeKey = selectionInitiale.join(",");
  const selectionKey = selection.join(",");

  useEffect(() => {
    setSelection(selectionInitialeKey ? selectionInitialeKey.split(",") : []);
  }, [selectionInitialeKey]);

  useEffect(() => {
    const slugs = selectionKey ? selectionKey.split(",") : [];
    if (slugs.length < 2) {
      setFiches({});
      setChargement(false);
      setErreur(false);
      return;
    }

    const controleur = new AbortController();
    const parametres = new URLSearchParams();
    slugs.forEach((slug) => parametres.append("slug", slug));

    async function chargerFiches() {
      setChargement(true);
      setErreur(false);

      try {
        const response = await fetch(`/api/prenoms?${parametres.toString()}`, {
          signal: controleur.signal
        });
        if (!response.ok) throw new Error("Chargement impossible.");

        const resultat = await response.json() as { prenoms: Prenom[] };
        if (!Array.isArray(resultat.prenoms)) throw new Error("Réponse invalide.");

        setFiches(Object.fromEntries(resultat.prenoms.map((prenom) => [prenom.slug, prenom])));
      } catch (cause) {
        if (cause instanceof Error && cause.name === "AbortError") return;
        setErreur(true);
      } finally {
        if (!controleur.signal.aborted) setChargement(false);
      }
    }

    void chargerFiches();
    return () => controleur.abort();
  }, [selectionKey, tentative]);

  const resultats = useMemo(() => {
    const terme = normaliserRecherche(recherche);
    return prenoms
      .filter((prenom) => !terme || normaliserRecherche(prenom.nom).includes(terme))
      .sort((a, b) => comparerPertinence(a, b, terme));
  }, [prenoms, recherche]);
  const suggestions = useMemo(
    () => resultats.length > 0 ? [] : suggererPrenomsProches(prenoms, recherche),
    [prenoms, recherche, resultats.length]
  );
  const prenomsSelectionnes = selection.flatMap((slug) => {
    const prenom = prenoms.find((candidat) => candidat.slug === slug);
    return prenom ? [prenom] : [];
  });
  const selectionnes = selection.flatMap((slug) => fiches[slug] ? [fiches[slug]] : []);
  const selectionComplete = selectionnes.length === selection.length;

  function synchroniserUrl(slugs: string[]) {
    const url = new URL(window.location.href);
    if (slugs.length > 0) url.searchParams.set("prenoms", slugs.join(","));
    else url.searchParams.delete("prenoms");
    window.history.replaceState(null, "", url.toString());
  }

  function changerSelection(slug: string, coche: boolean) {
    const suivante = coche
      ? selection.length < 3 && !selection.includes(slug) ? [...selection, slug] : selection
      : selection.filter((element) => element !== slug);
    setSelection(suivante);
    setFiches({});
    setChargement(suivante.length >= 2);
    setErreur(false);
    synchroniserUrl(suivante);
  }

  function effacerSelection() {
    setSelection([]);
    synchroniserUrl([]);
  }

  return (
    <div className="comparator">
      <section className="compare-selector" aria-labelledby="compare-selector-title">
        <SearchBar
          id="compare-search"
          className="compare-search"
          label="Rechercher un prénom"
          placeholder="Saisissez un prénom..."
          value={recherche}
          onChange={(value) => {
            setNombreVisible(24);
            setRecherche(value);
          }}
        />

        <fieldset className="compare-options">
          <legend id="compare-selector-title">Choisissez jusqu’à trois prénoms</legend>
          {resultats.length > 0 || suggestions.length > 0 ? (
            <>
              <p className="results-meta" role="status">
                {resultats.length > 0
                  ? `${resultats.length} ${resultats.length > 1 ? "prénoms disponibles" : "prénom disponible"} · ${Math.min(resultats.length, nombreVisible)} affichés`
                  : `Aucun résultat exact pour « ${recherche.trim()} ». Voici les prénoms les plus proches :`}
              </p>
              <div className="compare-options-grid">
                {(resultats.length > 0 ? resultats.slice(0, nombreVisible) : suggestions).map((prenom) => {
                  const coche = selection.includes(prenom.slug);
                  return (
                    <label className="compare-option" key={prenom.slug}>
                      <input
                        type="checkbox"
                        checked={coche}
                        disabled={!coche && selection.length >= 3}
                        onChange={(event) => changerSelection(prenom.slug, event.target.checked)}
                      />
                      <span className="compare-option-initial" aria-hidden="true">{prenom.lettre}</span>
                      <span className="compare-option-name">
                        <strong>{prenom.nom}</strong>
                        <small>{prenom.genre}</small>
                      </span>
                    </label>
                  );
                })}
              </div>
              {resultats.length > nombreVisible && (
                <Button variant="text"
                  className="filter-action"
                  type="button"
                  onClick={() => setNombreVisible((visible) => visible + 24)}
                >
                  Afficher les {Math.min(24, resultats.length - nombreVisible)} prénoms suivants
                </Button>
              )}
            </>
          ) : (
            <p className="compare-status">{prenoms.length === 0 ? "Aucun prénom n’est encore publié." : "Aucun prénom ne correspond à cette recherche. Essayez une autre orthographe."}</p>
          )}
        </fieldset>

        <div className="compare-selection-footer">
          <ComparisonSelection
            prenoms={prenomsSelectionnes}
            label="Prénoms sélectionnés"
            onRetirer={(slug) => changerSelection(slug, false)}
          />
          <span role="status" aria-live="polite">{selection.length} / 3 prénoms sélectionnés</span>
          <Button variant="text" type="button" disabled={selection.length === 0} onClick={effacerSelection}>
            Effacer la sélection
          </Button>
        </div>
      </section>

      {selection.length < 2 ? (
        <p className="compare-status">
          {selection.length === 0
            ? "Sélectionnez au moins deux prénoms pour afficher leur comparaison."
            : "Choisissez encore un prénom pour lancer la comparaison."}
        </p>
      ) : chargement ? (
        <p className="compare-status" role="status">Chargement des fiches sélectionnées…</p>
      ) : erreur ? (
        <div className="compare-status" role="alert">
          <p>Les fiches sélectionnées n’ont pas pu être chargées.</p>
          <Button onClick={() => setTentative((value) => value + 1)}>
            Réessayer
          </Button>
        </div>
      ) : !selectionComplete ? (
        <p className="compare-status" role="status">Une des fiches sélectionnées n’est plus publiée. Modifiez votre sélection pour continuer.</p>
      ) : (
        <section aria-label="Comparaison des prénoms" className="compare-grid">
          {selectionnes.map((prenom) => (
            <article className="compare-card" key={prenom.slug}>
              <header>
                <h2>{prenom.nom}</h2>
                <span className="profile-tag">{prenom.genre}</span>
                <span className="profile-tag">Lettre {prenom.lettre}</span>
                <ButtonFavori slug={prenom.slug} nom={prenom.nom} compact showError={false} />
                <Link
                  className="compare-card-link"
                  href={creerUrlFicheDepuisComparateur(prenom.slug, selection)}
                  aria-label={`Lire la fiche complète de ${prenom.nom}`}
                >
                  Voir la fiche complète
                </Link>
              </header>
              <div className="compare-field">
                <h3>Introduction</h3>
                <p>{prenom.introduction}</p>
              </div>
              <div className="compare-field">
                <h3>Origine & signification</h3>
                <p className={prenom.origin ? "" : "compare-missing"}>{prenom.origin ?? "Non renseignée dans cette fiche."}</p>
              </div>
              <div className="compare-field">
                <h3>Histoire</h3>
                <p className={prenom.history ? "" : "compare-missing"}>{prenom.history ?? "Non renseignée dans cette fiche."}</p>
              </div>
              <div className="compare-field">
                <h3>Variantes & usages</h3>
                <p className={prenom.usage ? "" : "compare-missing"}>{prenom.usage ?? "Non renseignés dans cette fiche."}</p>
              </div>
              <div className="compare-field">
                <h3>Associations symboliques</h3>
                {prenom.symbolic_associations.length > 0 ? (
                  <div className="compare-associations">
                    {prenom.symbolic_associations.map((association) => (
                      <div className="compare-association" data-category-tone={categoryTone(association.category)} key={`${association.category}-${association.value}`}>
                        <strong>{association.value}</strong>
                        <span>{association.category}</span>
                        <p>{association.context_note}</p>
                      </div>
                    ))}
                  </div>
                ) : <p className="compare-missing">Aucune association publiée.</p>}
              </div>
            </article>
          ))}
          <p className="compare-disclaimer">Les associations symboliques sont des représentations culturelles, pas des caractéristiques scientifiques ou prédictives.</p>
        </section>
      )}

      {erreurFavoris && (
        <p role="alert">
          Le stockage des favoris est indisponible ou contient des données illisibles. Vos modifications ne sont pas enregistrées.
        </p>
      )}

      {selection.length >= 2 && selectionComplete && !chargement && !erreur && (
        <div className="compare-share">
          <p>Cette sélection est enregistrée dans l’adresse de la page : vous pouvez partager la comparaison.</p>
          <PartagerLien
            titre={`Comparaison de ${selectionnes.length} prénoms · Namesia`}
            texte={`Comparez ${selectionnes.map((prenom) => prenom.nom).join(", ")} sur Namesia.`}
            label="Partager cette comparaison"
            parametres={["prenoms"]}
          />
        </div>
      )}
    </div>
  );
}
