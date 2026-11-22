"use client";

import { useMemo, useState } from "react";
import type { Prenom } from "@/lib/prenoms";

type Props = { prenoms: Prenom[] };

function normaliser(value: string): string {
  return value.trim().normalize("NFD").replace(/\p{Diacritic}/gu, "").toLocaleLowerCase("fr");
}

export function ComparateurPrenoms({ prenoms }: Props) {
  const [recherche, setRecherche] = useState("");
  const [selection, setSelection] = useState<string[]>([]);
  const resultats = useMemo(() => {
    const terme = normaliser(recherche);
    return prenoms.filter((prenom) => !terme || normaliser(prenom.nom).includes(terme));
  }, [prenoms, recherche]);
  const selectionnes = prenoms.filter((prenom) => selection.includes(prenom.slug));

  function changerSelection(slug: string, coche: boolean) {
    setSelection((actuelle) => {
      if (coche) return actuelle.length < 3 ? [...actuelle, slug] : actuelle;
      return actuelle.filter((element) => element !== slug);
    });
  }

  return (
    <div className="comparator">
      <section className="compare-selector" aria-labelledby="compare-selector-title">
        <div className="compare-search">
          <label htmlFor="compare-search">Rechercher un prénom</label>
          <input
            id="compare-search"
            type="search"
            value={recherche}
            onChange={(event) => setRecherche(event.target.value)}
            placeholder="Saisissez un prénom..."
          />
        </div>

        <fieldset className="compare-options">
          <legend id="compare-selector-title">Choisissez jusqu’à trois prénoms</legend>
          {resultats.length > 0 ? (
            <div className="compare-options-grid">
              {resultats.map((prenom) => {
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
          ) : (
            <p className="compare-status">Aucun prénom ne correspond à cette recherche.</p>
          )}
        </fieldset>

        <div className="compare-selection-footer">
          <span role="status" aria-live="polite">{selection.length} / 3 prénoms sélectionnés</span>
          <button type="button" disabled={selection.length === 0} onClick={() => setSelection([])}>
            Effacer la sélection
          </button>
        </div>
      </section>

      {selectionnes.length < 2 ? (
        <p className="compare-status">
          {selectionnes.length === 0
            ? "Sélectionnez au moins deux prénoms pour afficher leur comparaison."
            : "Choisissez encore un prénom pour lancer la comparaison."}
        </p>
      ) : (
        <section aria-label="Comparaison des prénoms" className="compare-grid">
          {selectionnes.map((prenom) => (
            <article className="compare-card" key={prenom.slug}>
              <header>
                <h2>{prenom.nom}</h2>
                <span className="profile-tag">{prenom.genre}</span>
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
                      <div className="compare-association" key={`${association.category}-${association.value}`}>
                        <strong>{association.value}</strong>
                        <span>{association.category}</span>
                      </div>
                    ))}
                  </div>
                ) : <p className="compare-missing">Aucune association publiée.</p>}
              </div>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}