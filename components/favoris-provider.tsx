"use client";

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
};

const FavorisContext = createContext<ContexteFavoris | null>(null);

function lireFavoris(value: string | null): string[] {
  if (!value) return [];
  const parsed: unknown = JSON.parse(value);
  if (!Array.isArray(parsed) || !parsed.every((item): item is string => typeof item === "string")) {
    throw new TypeError("Le contenu des favoris est invalide.");
  }
  return [...new Set(parsed)];
}

export function FavorisProvider({ children }: { children: ReactNode }) {
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
      : [...slugs, slug];

    try {
      window.localStorage.setItem(CLE_FAVORIS, JSON.stringify(prochain));
      setSlugs(prochain);
      setErreur(false);
    } catch {
      setErreur(true);
    }
  }, [slugs]);

  const valeur = useMemo(
    () => ({ slugs, pret, erreur, basculer }),
    [slugs, pret, erreur, basculer]
  );

  return (
    <FavorisContext.Provider value={valeur}>
      {children}
    </FavorisContext.Provider>
  );
}

export function useFavoris(): ContexteFavoris {
  const contexte = useContext(FavorisContext);
  if (!contexte) throw new Error("useFavoris doit être utilisé dans FavorisProvider.");
  return contexte;
}
