"use client";

import { LIMITE_FAVORIS, fusionnerFavoris, normaliserSlugsFavoris, type ResultatFusionFavoris } from "@/lib/sauvegarde-favoris";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react";

const CLE_FAVORIS = "namesia:favoris:v1";

type ContexteFavoris = {
  slugs: string[];
  pret: boolean;
  erreur: boolean;
  basculer: (slug: string) => void;
  retirerPlusieurs: (slugs: string[]) => void;
  ajouterPlusieurs: (slugs: string[]) => Omit<ResultatFusionFavoris, "slugs"> | null;
};

const FavorisContext = createContext<ContexteFavoris | null>(null);

function lireFavoris(value: string | null): string[] {
  if (!value) return [];
  const parsed: unknown = JSON.parse(value);
  const slugs = normaliserSlugsFavoris(parsed);
  if (!slugs) throw new TypeError("Le contenu des favoris est invalide.");
  return slugs;
}

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [slugs, setSlugs] = useState<string[]>([]);
  const [pret, setPret] = useState(false);
  const [erreur, setErreur] = useState(false);

  useEffect(() => {
    try {
      setSlugs(lireFavoris(window.localStorage.getItem(CLE_FAVORIS)));
    } catch {
      setErreur(true);
    }
    setPret(true);

    function synchroniser(event: StorageEvent) {
      if (event.key !== CLE_FAVORIS && event.key !== null) return;
      try {
        setSlugs(lireFavoris(event.newValue));
        setErreur(false);
      } catch {
        setErreur(true);
      }
    }

    window.addEventListener("storage", synchroniser);
    return () => window.removeEventListener("storage", synchroniser);
  }, []);

  const basculer = useCallback((slug: string) => {
    const prochain = slugs.includes(slug)
      ? slugs.filter((favori) => favori !== slug)
      : slugs.length < LIMITE_FAVORIS ? [...slugs, slug] : slugs;

    try {
      window.localStorage.setItem(CLE_FAVORIS, JSON.stringify(prochain));
      setSlugs(prochain);
      setErreur(false);
    } catch {
      setErreur(true);
    }
  }, [slugs]);

  const retirerPlusieurs = useCallback((slugsARetirer: string[]) => {
    const exclus = new Set(slugsARetirer);
    const prochainsSlugs = slugs.filter((slug) => !exclus.has(slug));
    if (prochainsSlugs.length === slugs.length) return;

    try {
      window.localStorage.setItem(CLE_FAVORIS, JSON.stringify(prochainsSlugs));
      setSlugs(prochainsSlugs);
      setErreur(false);
    } catch {
      setErreur(true);
    }
  }, [slugs]);

  const ajouterPlusieurs = useCallback((slugsImportes: string[]): Omit<ResultatFusionFavoris, "slugs"> | null => {
    try {
      const fusion = fusionnerFavoris(slugs, slugsImportes);
      window.localStorage.setItem(CLE_FAVORIS, JSON.stringify(fusion.slugs));
      setSlugs(fusion.slugs);
      setErreur(false);
      return {
        nombreAjoute: fusion.nombreAjoute,
        nombreIgnoreLimite: fusion.nombreIgnoreLimite
      };
    } catch {
      setErreur(true);
      return null;
    }
  }, [slugs]);

  const valeur = useMemo(
    () => ({ slugs, pret, erreur, basculer, retirerPlusieurs, ajouterPlusieurs }),
    [slugs, pret, erreur, basculer, retirerPlusieurs, ajouterPlusieurs]
  );

  return (
    <FavorisContext.Provider value={valeur}>
      {children}
    </FavorisContext.Provider>
  );
}

export function useFavorites(): ContexteFavoris {
  const contexte = useContext(FavorisContext);
  if (!contexte) throw new Error("useFavorites doit être utilisé dans FavoritesProvider.");
  return contexte;
}
