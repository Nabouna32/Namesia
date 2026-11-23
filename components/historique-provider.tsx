"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode
} from "react";
import { ajouterConsultation } from "@/lib/historique-prenoms";

type ContexteHistorique = {
  slugs: string[];
  enregistrer: (slug: string) => void;
  effacer: () => void;
};

const HistoriqueContext = createContext<ContexteHistorique | null>(null);

export function HistoriqueProvider({ children }: { children: ReactNode }) {
  const [slugs, setSlugs] = useState<string[]>([]);

  const enregistrer = useCallback((slug: string) => {
    setSlugs((courants) => ajouterConsultation(courants, slug));
  }, []);

  const effacer = useCallback(() => setSlugs([]), []);

  const valeur = useMemo(
    () => ({ slugs, enregistrer, effacer }),
    [slugs, enregistrer, effacer]
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
