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

const HistoryContext = createContext<HistoryContextValue>({
  slugs: [],
  ready: true,
  error: false,
  recordVisit: () => undefined,
  removeVisit: () => undefined,
  clearHistory: () => undefined
});

export function HistoryProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export function useHistory(): HistoryContextValue {
  return useContext(HistoryContext);
}
