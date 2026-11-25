"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { creerUrlFicheDepuisComparateur } from "@/lib/navigation-prenoms";
import type { Name, NameIndexEntry } from "@/lib/names";
import { GenderIcon } from "@/components/features/names/GenderIcon";
import { ShareLink } from "@/components/features/sharing/ShareLink";
import { compareRelevance, normalizeSearchTerm, suggestSimilarNames } from "@/lib/name-search";
import { categoryTone } from "@/lib/category-color";
import { SearchBar } from "@/components/material3/SearchBar";
import { Checkbox } from "@/components/material3/Checkbox";
import { ComparisonSelection } from "@/components/features/comparison/ComparisonSelection";
import { Button } from "@/components/material3/Button";

type Props = { names: NameIndexEntry[]; initialSelection: string[] };


export function NameComparator({ names, initialSelection }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleCount, setVisibleCount] = useState(24);
  const [selection, setSelection] = useState<string[]>(initialSelection);
  const [profiles, setProfiles] = useState<Record<string, Name>>({});
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState(false);
  const [tentative, setTentative] = useState(0);
  const initialSelectionKey = initialSelection.join(",");
  const selectionKey = selection.join(",");

  useEffect(() => {
    setSelection(initialSelectionKey ? initialSelectionKey.split(",") : []);
  }, [initialSelectionKey]);

  useEffect(() => {
    const slugs = selectionKey ? selectionKey.split(",") : [];
    if (slugs.length < 2) {
      setProfiles({});
      setChargement(false);
      setErreur(false);
      return;
    }

    const controleur = new AbortController();
    const params = new URLSearchParams();
    slugs.forEach((slug) => params.append("slug", slug));

    async function chargerFiches() {
      setChargement(true);
      setErreur(false);

      try {
        const response = await fetch(`/api/prenoms?${params.toString()}`, {
          signal: controleur.signal
        });
        if (!response.ok) throw new Error("Chargement impossible.");

        const result = await response.json() as { prenoms: Name[] };
        if (!Array.isArray(result.prenoms)) throw new Error("Réponse invalide.");

        setProfiles(Object.fromEntries(result.prenoms.map((name) => [name.slug, name])));
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

  const results = useMemo(() => {
    const terme = normalizeSearchTerm(searchTerm);
    return names
      .filter((name) => !terme || normalizeSearchTerm(name.name).includes(terme))
      .sort((a, b) => compareRelevance(a, b, terme));
  }, [names, searchTerm]);
  const suggestions = useMemo(
    () => results.length > 0 ? [] : suggestSimilarNames(names, searchTerm),
    [names, searchTerm, results.length]
  );
  const selectedEntries = selection.flatMap((slug) => {
    const name = names.find((candidat) => candidat.slug === slug);
    return name ? [name] : [];
  });
  const selectedProfiles = selection.flatMap((slug) => profiles[slug] ? [profiles[slug]] : []);
  const selectionComplete = selectedProfiles.length === selection.length;

  function syncUrl(slugs: string[]) {
    const url = new URL(window.location.href);
    if (slugs.length > 0) url.searchParams.set("prenoms", slugs.join(","));
    else url.searchParams.delete("prenoms");
    window.history.replaceState(null, "", url.toString());
  }

  function changeSelection(slug: string, checked: boolean) {
    const suivante = checked
      ? selection.length < 3 && !selection.includes(slug) ? [...selection, slug] : selection
      : selection.filter((element) => element !== slug);
    setSelection(suivante);
    setProfiles({});
    setChargement(suivante.length >= 2);
    setErreur(false);
    syncUrl(suivante);
  }

  function clearSelection() {
    setSelection([]);
    syncUrl([]);
  }

  return (
    <div className="comparator">
      <section className="compare-selector" aria-labelledby="compare-selector-title">
        <SearchBar
          id="compare-search"
          className="compare-search"
          label="Rechercher un prénom"
          placeholder="Saisissez un prénom..."
          value={searchTerm}
          onChange={(value) => {
            setVisibleCount(24);
            setSearchTerm(value);
          }}
        />

        <fieldset className="compare-options">
          <legend id="compare-selector-title">Choisissez jusqu’à trois prénoms</legend>
          {results.length > 0 || suggestions.length > 0 ? (
            <>
              <p className="results-meta" role="status">
                {results.length > 0
                  ? `${results.length} ${results.length > 1 ? "prénoms disponibles" : "prénom disponible"} · ${Math.min(results.length, visibleCount)} affichés`
                  : `Aucun résultat exact pour « ${searchTerm.trim()} ». Voici les prénoms les plus proches :`}
              </p>
              <div className="compare-options-grid">
                {(results.length > 0 ? results.slice(0, visibleCount) : suggestions).map((name) => {
                  const checked = selection.includes(name.slug);
                  return (
                    <label className="compare-option" key={name.slug}>
                      <Checkbox
                        checked={checked}
                        disabled={!checked && selection.length >= 3}
                        onChange={(checked) => changeSelection(name.slug, checked)}
                      />
                      <span className="compare-option-initial" aria-hidden="true">{name.initial}</span>
                      <span className="compare-option-name">
                        <strong>{name.name}</strong>
                        <GenderIcon gender={name.gender} />
                      </span>
                    </label>
                  );
                })}
              </div>
              {results.length > visibleCount && (
                <Button variant="text"
                  className="filter-action"
                  type="button"
                  onClick={() => setVisibleCount((visible) => visible + 24)}
                >
                  Afficher les {Math.min(24, results.length - visibleCount)} prénoms suivants
                </Button>
              )}
            </>
          ) : (
            <p className="compare-status">{names.length === 0 ? "Aucun prénom n’est encore publié." : "Aucun prénom ne correspond à cette recherche. Essayez une autre orthographe."}</p>
          )}
        </fieldset>

        <div className="compare-selection-footer">
          <ComparisonSelection
            names={selectedEntries.map((name) => ({ slug: name.slug, name: name.name }))}
            label="Prénoms sélectionnés"
            onRemove={(slug) => changeSelection(slug, false)}
          />
          <span role="status">{selection.length} / 3 prénoms sélectionnés</span>
          <Button variant="text" type="button" disabled={selection.length === 0} onClick={clearSelection}>
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
        <section aria-label="Comparaison des prénoms" className="compare-table-section">
          <div
            className="compare-table-scroll"
            role="region"
            tabIndex={0}
            aria-label="Tableau comparatif. Faites défiler horizontalement pour consulter toutes les colonnes."
          >
            <table className="compare-table">
              <caption className="sr-only">
                Comparaison de {selectedProfiles.map((name) => name.name).join(", ")}
              </caption>
              <thead>
                <tr>
                  <th scope="col" className="compare-criterion-heading">Critères</th>
                  {selectedProfiles.map((name) => (
                    <th scope="col" key={name.slug}>
                      <strong className="compare-name">{name.name}</strong>
                      <span className="compare-header-meta">
                        <span className="profile-tag"><GenderIcon gender={name.gender} /></span>
                        <span className="profile-tag">Lettre {name.initial}</span>
                      </span>
                      <Link
                        className="compare-profile-link"
                        href={creerUrlFicheDepuisComparateur(name.slug, selection)}
                        aria-label={`Lire la fiche complète de ${name.name}`}
                      >
                        Voir la fiche complète
                      </Link>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">Introduction</th>
                  {selectedProfiles.map((name) => <td key={name.slug}><p>{name.introduction}</p></td>)}
                </tr>
                <tr>
                  <th scope="row">Origine & signification</th>
                  {selectedProfiles.map((name) => (
                    <td key={name.slug}>
                      <p className={name.origin ? "" : "compare-missing"}>
                        {name.origin ?? "Non renseignée dans cette fiche."}
                      </p>
                    </td>
                  ))}
                </tr>
                <tr>
                  <th scope="row">Histoire</th>
                  {selectedProfiles.map((name) => (
                    <td key={name.slug}>
                      <p className={name.history ? "" : "compare-missing"}>
                        {name.history ?? "Non renseignée dans cette fiche."}
                      </p>
                    </td>
                  ))}
                </tr>
                <tr>
                  <th scope="row">Variantes & usages</th>
                  {selectedProfiles.map((name) => (
                    <td key={name.slug}>
                      <p className={name.usage ? "" : "compare-missing"}>
                        {name.usage ?? "Non renseignés dans cette fiche."}
                      </p>
                    </td>
                  ))}
                </tr>
                <tr>
                  <th scope="row">Associations symboliques</th>
                  {selectedProfiles.map((name) => (
                    <td key={name.slug}>
                      {name.symbolic_associations.length > 0 ? (
                        <div className="compare-associations">
                          {name.symbolic_associations.map((association) => (
                            <div className="compare-association" data-category-tone={categoryTone(association.category)} key={`${association.category}-${association.value}`}>
                              <strong>{association.value}</strong>
                              <span>{association.category}</span>
                              <p>{association.context_note}</p>
                            </div>
                          ))}
                        </div>
                      ) : <p className="compare-missing">Aucune association publiée.</p>}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
          <p className="compare-disclaimer">Les associations symboliques sont des représentations culturelles, pas des caractéristiques scientifiques ou prédictives.</p>
        </section>
      )}

      {selection.length >= 2 && selectionComplete && !chargement && !erreur && (
        <div className="compare-share">
          <p>Cette sélection est enregistrée dans l’adresse de la page : vous pouvez partager la comparaison.</p>
          <ShareLink
            title={`Comparaison de ${selectedProfiles.length} prénoms · Namesia`}
            text={`Comparez ${selectedProfiles.map((name) => name.name).join(", ")} sur Namesia.`}
            label="Partager cette comparaison"
            queryParameters={["prenoms"]}
          />
        </div>
      )}
    </div>
  );
}
