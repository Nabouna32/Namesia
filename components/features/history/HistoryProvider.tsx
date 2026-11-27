"use client";

import { createContext, useContext, type ReactNode } from "react";

type HistoryContextValue = {
  slugs: string[];
  ready: boolean;
  error: boolean;
  recordVisit: (slug: string) => void;
  removeVisit: (slug: string) => void;
  clearHistory: () => void;
};

const INACTIVE_HISTORY: HistoryContextValue = {
  slugs: [],
  ready: true,
  error: false,
  recordVisit: () => undefined,
  removeVisit: () => undefined,
  clearHistory: () => undefined
};

const HistoryContext = createContext<HistoryContextValue>(INACTIVE_HISTORY);

export function HistoryProvider({ children }: { children: ReactNode }) {
  return (
    <HistoryContext.Provider value={INACTIVE_HISTORY}>
      {children}
    </HistoryContext.Provider>
  );
}

export function useHistory(): HistoryContextValue {
  return useContext(HistoryContext);
}
