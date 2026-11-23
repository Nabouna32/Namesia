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
import { ajouterConsultation, lireHistoriqueSession, retirerConsultation } from "@/lib/historique-prenoms";

const CLE_HISTORIQUE = "namesia:historique-session:v1";

type ContexteHistorique = {
  slugs: string[];
  pret: boolean;
  erreur: boolean;
  enregistrer: (slug: string) => void;
  retirer: (slug: string) => void;
  effacer: () => void;
};

const HistoriqueContext = createContext<ContexteHistorique | null>(null);

export function HistoriqueProvider({ children }: { children: ReactNode }) {
  const [slugs, setSlugs] = useState<string[]>([]);
  const [pret, setPret] = useState(false);
  const [erreur, setErreur] = useState(false);

  useEffect(() => {
    try {
      setSlugs(lireHistoriqueSession(window.sessionStorage.getItem(CLE_HISTORIQUE)));
    } catch {
      setSlugs([]);
      setErreur(true);
    }
    setPret(true);
  }, []);

  useEffect(() => {
    if (!pret) return;
    try {
      window.sessionStorage.setItem(CLE_HISTORIQUE, JSON.stringify(slugs));
      setErreur(false);
    } catch {
      setErreur(true);
    }
  }, [pret, slugs]);

  const enregistrer = useCallback((slug: string) => {
    setSlugs((courants) => ajouterConsultation(courants, slug));
  }, []);

  const retirer = useCallback((slug: string) => {
    setSlugs((courants) => retirerConsultation(courants, slug));
  }, []);

  const effacer = useCallback(() => setSlugs([]), []);

  const valeur = useMemo(
    () => ({ slugs, pret, erreur, enregistrer, retirer, effacer }),
    [slugs, pret, erreur, enregistrer, retirer, effacer]
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
