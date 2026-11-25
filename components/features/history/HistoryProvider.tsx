"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode
} from "react";
import {
  addHistoryVisit,
  parseSessionHistory,
  removeHistoryVisit
} from "@/lib/history";

const HISTORY_KEY = "namesia:historique-session:v1";

type HistoryContextValue = {
  slugs: string[];
  ready: boolean;
  error: boolean;
  recordVisit: (slug: string) => void;
  removeVisit: (slug: string) => void;
  clearHistory: () => void;
};

const HistoryContext = createContext<HistoryContextValue | null>(null);

export function HistoryProvider({ children }: { children: ReactNode }) {
  const historyRef = useRef<string[]>([]);
  const [slugs, setSlugs] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    try {
      const storedHistory = parseSessionHistory(window.sessionStorage.getItem(HISTORY_KEY));
      historyRef.current = storedHistory;
      setSlugs(storedHistory);
    } catch {
      setError(true);
    } finally {
      setReady(true);
    }
  }, []);

  const persist = useCallback((nextSlugs: string[]) => {
    try {
      window.sessionStorage.setItem(HISTORY_KEY, JSON.stringify(nextSlugs));
      historyRef.current = nextSlugs;
      setSlugs(nextSlugs);
      setError(false);
    } catch {
      setError(true);
    }
  }, []);

  const recordVisit = useCallback((slug: string) => {
    persist(addHistoryVisit(historyRef.current, slug));
  }, [persist]);

  const removeVisit = useCallback((slug: string) => {
    persist(removeHistoryVisit(historyRef.current, slug));
  }, [persist]);

  const clearHistory = useCallback(() => persist([]), [persist]);

  const value = useMemo(
    () => ({ slugs, ready, error, recordVisit, removeVisit, clearHistory }),
    [slugs, ready, error, recordVisit, removeVisit, clearHistory]
  );

  return (
    <HistoryContext.Provider value={value}>
      {children}
    </HistoryContext.Provider>
  );
}

export function useHistory(): HistoryContextValue {
  const context = useContext(HistoryContext);
  if (!context) throw new Error("useHistory must be used within HistoryProvider.");
  return context;
}
