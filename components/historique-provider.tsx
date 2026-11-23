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
import { ajouterConsultation, lireHistorique } from "@/lib/historique-prenoms";

const CLE_HISTORIQUE = "namesia:historique:v1";

type ContexteHistorique = {
  slugs: string[];
  pret: boolean;
  erreur: boolean;
  enregistrer: (slug: string) => void;
  effacer: () => void;
};

const HistoriqueContext = createContext<ContexteHistorique | null>(null);

export function HistoriqueProvider({ children }: { children: ReactNode }) {
  const [slugs, setSlugs] = useState<string[]>([]);
  const [pret, setPret] = useState(false);
  const [erreur, setErreur] = useState(false);

  useEffect(() => {
    try {
      setSlugs(lireHistorique(window.localStorage.getItem(CLE_HISTORIQUE)));
    } catch {
      setErreur(true);
    }
    setPret(true);

    function synchroniser(event: StorageEvent) {
      if (event.key !== CLE_HISTORIQUE && event.key !== null) return;
      try {
        setSlugs(lireHistorique(event.newValue));
        setErreur(false);
      } catch {
        setErreur(true);
      }
    }

    window.addEventListener("storage", synchroniser);
    return () => window.removeEventListener("storage", synchroniser);
  }, []);

  const enregistrer = useCallback((slug: string) => {
    if (!pret || erreur) return;

    const prochainsSlugs = ajouterConsultation(slugs, slug);
    if (prochainsSlugs.length === slugs.length && prochainsSlugs.every((value, index) => value === slugs[index])) {
      return;
    }

    try {
      window.localStorage.setItem(CLE_HISTORIQUE, JSON.stringify(prochainsSlugs));
      setSlugs(prochainsSlugs);
      setErreur(false);
    } catch {
      setErreur(true);
    }
  }, [slugs, pret, erreur]);

  const effacer = useCallback(() => {
    try {
      window.localStorage.removeItem(CLE_HISTORIQUE);
      setSlugs([]);
      setErreur(false);
    } catch {
      setErreur(true);
    }
  }, []);

  const valeur = useMemo(
    () => ({ slugs, pret, erreur, enregistrer, effacer }),
    [slugs, pret, erreur, enregistrer, effacer]
  );

  return (
    <HistoriqueContext.Provider value={valeur}>
      {children}
    </HistoriqueContext.Provider>
  );
}

export function useHistorique(): ContexteHistorique {
  const contexte = useContext(HistoriqueContext);
  if (!contexte) throw new Error("useHistorique doit être utilisé dans HistoriqueProvider.");
  return contexte;
}
