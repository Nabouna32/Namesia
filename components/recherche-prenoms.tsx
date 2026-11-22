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
  const resultats = useMemo(() => {
    const terme = normaliserRecherche(recherche);
    return terme ? prenoms.filter((prenom) => normaliserRecherche(prenom.nom).includes(terme)) : prenoms;
  }, [prenoms, recherche]);
  return <div className={compact ? "search search-compact" : "search"}>
    <label className="sr-only" htmlFor={compact ? "recherche-accueil" : "recherche-catalogue"}>Rechercher un prénom</label>
    <div className="search-field"><span aria-hidden="true" className="search-icon">⌕</span>
      <input id={compact ? "recherche-accueil" : "recherche-catalogue"} type="search" placeholder="Quel prénom cherchez-vous ?" value={recherche} onChange={(event) => setRecherche(event.target.value)} />
      {recherche && <button className="clear-search" type="button" onClick={() => setRecherche("")}>Effacer</button>}
    </div>
    {(!compact || recherche.trim()) && <div className="search-results">
      <p className={compact ? "results-meta sr-only" : "results-meta"} role="status">{resultats.length} {resultats.length > 1 ? "prénoms" : "prénom"} {recherche.trim() ? (resultats.length > 1 ? "trouvés" : "trouvé") : "à découvrir"}</div>
      {resultats.length ? <div className="name-grid">{resultats.map((prenom) => <Link className="name-card" href={`/prenoms/${prenom.slug}`} key={prenom.slug}>
        <span className="name-initial">{prenom.lettre}</span><span><strong>{prenom.nom}</strong><small>Découvrir la fiche</small></span><span className="card-arrow" aria-hidden="true">↗</span>
      </Link>)}</div> : <p className="empty-state">{recherche.trim() ? "Aucun prénom ne correspond. Essayez une autre recherche." : "Aucun prénom n’est encore publié."}</p>}
    </div>}
  </div>;
}
