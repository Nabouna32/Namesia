"use client";

import { useRef, useState, type ChangeEvent } from "react";
import Link from "next/link";
import type { NameGender, NameIndexEntry } from "@/lib/names";
import { GenderIcon } from "@/components/features/names/GenderIcon";
import { GENDER_ICONS } from "@/lib/gender-icons";
import { LIMITE_FAVORIS, creerSauvegardeFavoris, lireSauvegardeFavoris, normaliserSlugsFavoris } from "@/lib/sauvegarde-favoris";
import { normalizeSearchTerm, suggestSimilarNames } from "@/lib/name-search";
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
  names: NameIndexEntry[];
  initialSearch?: string;
  initialGender?: string;
  initialSort?: TriFavoris;
  initialVisibleCount?: number;
};

const TAILLE_MAX_SAUVEGARDE = 1_000_000;
const CLE_FAVORIS_LEGACY = "namesia:favoris:v1";

export function FavoritesList({
  names,
  initialSearch = "",
  initialGender = "",
  initialSort = "enregistrement",
  initialVisibleCount = 24
}: Props) {
  const { slugs, authenticated, ready, error, unavailableCount, retirerIndisponibles, ajouterPlusieurs } = useFavorites();
  const [migrationBusy, setMigrationBusy] = useState(false);
  const [messageImport, setMessageImport] = useState("");
  const [erreurImport, setErreurImport] = useState("");
  const [importPartiel, setImportPartiel] = useState(false);
  const [messageCopie, setMessageCopie] = useState("");
  const [erreurCopie, setErreurCopie] = useState("");
  const generationCopie = useRef(0);
  const [recherche, setRecherche] = useState(initialSearch);
  const [genreActif, setGenreActif] = useState(initialGender);
  const [triActif, setTriActif] = useState<TriFavoris>(initialSort);
  const [nombreVisible, setNombreVisible] = useState(initialVisibleCount);

  const parSlug = new Map(names.map((name) => [name.slug, name]));
  const favoris = slugs.flatMap((slug) => {
    const name = parSlug.get(slug);
    return name ? [name] : [];
  });
  if (!ready) return <p role="status" className="empty-state">Chargement de vos favoris…</p>;
  if (!authenticated) {
    return (
      <div className={styles.empty}>
        <p>Vos favoris sont désormais conservés dans votre compte et synchronisés entre vos appareils. Vous pouvez continuer à explorer toutes les fiches sans vous connecter.</p>
        <Button href="/compte?redirect=%2Ffavoris">Se connecter</Button>
        <Button variant="text" href="/compte?mode=register&redirect=%2Ffavoris">Créer un compte</Button>
      </div>
    );
  }

  const termeNormalise = normalizeSearchTerm(recherche);
  const genres: NameGender[] = [...new Set(favoris.map((name) => name.gender))]
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

  const favorisFiltres = favoris.filter((name) => (
    (!termeNormalise || normalizeSearchTerm(name.name).includes(termeNormalise))
    && (!genreActifValide || name.gender === genreActifValide)
  ));
  if (triActif !== "enregistrement") {
    favorisFiltres.sort((a, b) => {
      const ordre = a.name.localeCompare(b.name, "fr") || a.slug.localeCompare(b.slug, "fr");
      return triActif === "nom-asc" ? ordre : -ordre;
    });
  }
  const favorisProches = favorisFiltres.length === 0 && termeNormalise
    ? suggestSimilarNames(
      favoris.filter((name) => !genreActifValide || name.gender === genreActifValide),
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
      await navigator.clipboard.writeText(favorisFiltres.map((name) => name.name).join("\n"));
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
      const resultat = await ajouterPlusieurs(slugsImportes);
      if (resultat === null) return;
      setImportPartiel(resultat.nombreIgnoreLimite > 0 || resultat.nombreIgnoreIndisponible > 0);

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

  async function migrerFavorisLocaux() {
    setMigrationBusy(true);
    setMessageImport("");
    setErreurImport("");
    setImportPartiel(false);

    try {
      const stored = window.localStorage.getItem(CLE_FAVORIS_LEGACY);
      if (stored === null) {
        setMessageImport("Aucun ancien favori local n’a été trouvé sur cet appareil.");
        return;
      }

      const parsed: unknown = JSON.parse(stored);
      const legacySlugs = normaliserSlugsFavoris(parsed);
      if (!legacySlugs) {
        setErreurImport("Les anciens favoris locaux sont illisibles. Ils ont été conservés sur cet appareil.");
        return;
      }

      const result = await ajouterPlusieurs(legacySlugs);
      if (result === null) {
        setErreurImport("Le transfert n’a pas pu être confirmé. Les anciens favoris locaux ont été conservés.");
        return;
      }

      const partial = result.nombreIgnoreLimite > 0 || result.nombreIgnoreIndisponible > 0;
      setImportPartiel(partial);
      if (partial) {
        setMessageImport(\`${result.nombreAjoute} favoris transférés. \${result.nombreIgnoreLimite + result.nombreIgnoreIndisponible} éléments n’ont pas été transférés ; la copie locale est conservée pour éviter toute perte.\`);
        return;
      }

      window.localStorage.removeItem(CLE_FAVORIS_LEGACY);
      setMessageImport(result.nombreAjoute > 0
        ? \`${result.nombreAjoute} favoris transférés vers votre compte. La copie locale a été effacée.\`
        : "Ces favoris étaient déjà présents dans votre compte. La copie locale a été effacée.");
    } catch {
      setErreurImport("Le transfert a échoué. Les anciens favoris locaux ont été conservés.");
    } finally {
      setMigrationBusy(false);
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
      <p className={styles.help}>Vos favoris sont enregistrés dans votre compte, pas dans le stockage local du navigateur. Les sauvegardes JSON restent disponibles pour exporter ou importer votre sélection.</p>
      <div className={styles.migration}>
        <p>Si vous aviez déjà enregistré des favoris sur cet appareil, vous pouvez les transférer vers votre compte. Le transfert ne démarre qu’après votre clic ; la copie locale n’est effacée qu’une fois le transfert complet confirmé.</p>
        <Button variant="tonal" type="button" disabled={migrationBusy} onClick={() => void migrerFavorisLocaux()}>
          {migrationBusy ? "Transfert…" : "Importer mes anciens favoris de cet appareil"}
        </Button>
      </div>
      {messageCopie && <Snackbar severity="success">{messageCopie}</Snackbar>}
      {erreurCopie && <Snackbar severity="error">{erreurCopie}</Snackbar>}

      {messageImport && <Snackbar severity={importPartiel ? "warning" : "success"}>{messageImport}</Snackbar>}
      {erreurImport && <Snackbar severity="error">{erreurImport}</Snackbar>}
      {error && favoris.length > 0 && (
        <Snackbar severity="error">
          Le service des favoris est momentanément indisponible. Vos modifications ne sont pas confirmées.
        </Snackbar>
      )}

      {favoris.length === 0 ? (
        <div className={styles.empty}>
          <p className={error ? styles.error : undefined} role={error ? "alert" : undefined}>{error
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
              {favorisAffiches.slice(0, nombreVisible).map((name) => (
                <article className={styles.row} key={name.slug}>
                  <Card as={Link} variant="elevated" interactive
                    className="name-card"
                    href={creerUrlFicheDepuisFavoris(name.slug, {
                      q: recherche,
                      genre: genreActifValide || null,
                      tri: triActif,
                      limite: nombreVisible
                    })}
                  >
                    <span className="name-initial">{name.initial}</span>
                    <span>
                      <strong>{name.name}</strong>
                      <GenderIcon gender={name.gender} />
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
      {unavailableCount > 0 && !error && (
        <div className={styles.stale}>
          <p className={styles.note} role="status">
            {unavailableCount} {unavailableCount > 1 ? "favoris ne sont plus" : "favori n’est plus"} publiés.
          </p>
          <Button variant="text"
            className="filter-action"
            type="button"
            onClick={() => void retirerIndisponibles()}
          >
            Retirer les favoris indisponibles
          </Button>
        </div>
      )}
    </div>
  );
}
