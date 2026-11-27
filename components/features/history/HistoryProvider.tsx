"use client";

import { createContext, useContext, useEffect, type ReactNode } from "react";

type HistoryContextValue = {
  slugs: string[];
  ready: boolean;
  error: boolean;
  recordVisit: (slug: string) => void;
  removeVisit: (slug: string) => void;
  clearHistory: () => void;
};

const LEGACY_HISTORY_KEY = "namesia:historique-session:v1";\n\nconst HistoryContext = createContext<HistoryContextValue>({
  slugs: [],
  ready: true,
  error: false,
  recordVisit: () => undefined,
  removeVisit: () => undefined,
  clearHistory: () => undefined
});

export function HistoryProvider({ children }: { children: ReactNode }) {
  return (
    <HistoryContext.Provider value={{
      slugs: [],
      ready: true,
      error: false,
      recordVisit: () => undefined,
      removeVisit: () => undefined,
      clearHistory: () => undefined
    }}>
      {children}
    </HistoryContext.Provider>
  );
}

export function useHistory(): HistoryContextValue {
  return useContext(HistoryContext);
}
