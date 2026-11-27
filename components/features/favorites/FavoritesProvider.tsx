"use client";

import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { LIMITE_FAVORIS, normaliserSlugsFavoris } from "@/lib/sauvegarde-favoris";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react";

type FavoriteRecord = { nameId: string; slug: string | null };
type FavoriteImportResult = {
  nombreAjoute: number;
  nombreIgnoreLimite: number;
  nombreIgnoreIndisponible: number;
};

type FavoritesContextValue = {
  slugs: string[];
  unavailableCount: number;
  authenticated: boolean;
  ready: boolean;
  error: boolean;
  basculer: (slug: string) => Promise<"ajoute" | "retire" | "limite" | "erreur" | "auth">;
  retirerIndisponibles: () => Promise<void>;
  ajouterPlusieurs: (slugs: string[]) => Promise<FavoriteImportResult | null>;
};

const FavoritesContext = createContext<FavoritesContextValue | null>(null);
const supabase = createSupabaseBrowserClient();

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);
  const [records, setRecords] = useState<FavoriteRecord[]>([]);
  const [ready, setReady] = useState(false);
  const [loadedUserId, setLoadedUserId] = useState<string | null | undefined>(undefined);
  const [error, setError] = useState(false);

  const refresh = useCallback(async (targetUserId: string | null = userId) => {
    setReady(false);
    setError(false);
    setRecords([]);

    if (!targetUserId) {
      setLoadedUserId(null);
      setReady(true);
      return;
    }

    try {
      const { data, error: queryError } = await supabase
        .from("user_favorites")
        .select("name_id, created_at, names(slug)")
        .eq("user_id", targetUserId)
        .order("created_at", { ascending: true });

      if (queryError || !data) {
        setLoadedUserId(targetUserId);
        setError(true);
        setReady(true);
        return;
      }

      setRecords(data.map((row) => ({
        nameId: row.name_id,
        slug: row.names?.slug ?? null
      })));
      setLoadedUserId(targetUserId);
      setReady(true);
    } catch {
      setLoadedUserId(targetUserId);
      setError(true);
      setReady(true);
    }
  }, [userId]);

  useEffect(() => {
    try {
      window.localStorage.removeItem("namesia:favoris:v1");
    } catch {
      // La suppression des anciennes données ne doit pas bloquer l'exploration.
    }

    try {
      window.sessionStorage.removeItem("namesia:historique-session:v1");
    } catch {
      // Le stockage de session peut être inaccessible selon le navigateur.
    }
  }, []);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const nextUserId = session?.user.id ?? null;
      setUserId((current) => current === nextUserId ? current : nextUserId);
      setInitialized(true);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!initialized) return;
    void refresh(userId);
  }, [initialized, userId, refresh]);

  const basculer = useCallback(async (
    slug: string
  ): Promise<"ajoute" | "retire" | "limite" | "erreur" | "auth"> => {
    if (!userId) return "auth";

    try {
      const existing = records.find((record) => record.slug === slug);
      if (existing) {
        const { error: deleteError } = await supabase
          .from("user_favorites")
          .delete()
          .eq("user_id", userId)
          .eq("name_id", existing.nameId);
        if (deleteError) {
          setError(true);
          return "erreur";
        }
        await refresh(userId);
        return "retire";
      }

      if (records.length >= LIMITE_FAVORIS) return "limite";

      const { data: name, error: nameError } = await supabase
        .from("names")
        .select("id")
        .eq("slug", slug)
        .maybeSingle();

      if (nameError || !name) {
        setError(true);
        return "erreur";
      }

      const { error: insertError } = await supabase
        .from("user_favorites")
        .insert({ user_id: userId, name_id: name.id });

      if (insertError) {
        setError(true);
        return "erreur";
      }

      await refresh(userId);
      return "ajoute";
    } catch {
      setError(true);
      return "erreur";
    }
  }, [records, refresh, userId]);

  const retirerIndisponibles = useCallback(async () => {
    if (!userId) return;
    try {
      const ids = records.filter((record) => record.slug === null).map((record) => record.nameId);
      if (ids.length === 0) return;

      const { error: deleteError } = await supabase
        .from("user_favorites")
        .delete()
        .eq("user_id", userId)
        .in("name_id", ids);

      if (deleteError) {
        setError(true);
        return;
      }
      await refresh(userId);
    } catch {
      setError(true);
    }
  }, [records, refresh, userId]);

  const ajouterPlusieurs = useCallback(async (
    slugsToAdd: string[]
  ): Promise<FavoriteImportResult | null> => {
    if (!userId) return null;
    try {
      const normalized = normaliserSlugsFavoris(slugsToAdd);
      if (!normalized) {
        setError(true);
        return null;
      }
      if (normalized.length === 0) {
        return { nombreAjoute: 0, nombreIgnoreLimite: 0, nombreIgnoreIndisponible: 0 };
      }

      const { data: names, error: namesError } = await supabase
        .from("names")
        .select("id, slug")
        .in("slug", normalized);

      if (namesError || !names) {
        setError(true);
        return null;
      }

      const known = new Set(names.map((name) => name.slug));
      const existingIds = new Set(records.map((record) => record.nameId));
      const candidates = names.filter((name) => !existingIds.has(name.id));
      const availableSlots = Math.max(0, LIMITE_FAVORIS - records.length);
      const accepted = candidates.slice(0, availableSlots);
      const ignoredUnavailable = normalized.filter((slug) => !known.has(slug)).length;

      if (accepted.length > 0) {
        const { error: insertError } = await supabase
          .from("user_favorites")
          .upsert(
            accepted.map((name) => ({ user_id: userId, name_id: name.id })),
            { onConflict: "user_id,name_id", ignoreDuplicates: true }
          );

        if (insertError) {
          setError(true);
          return null;
        }
      }

      await refresh(userId);
      return {
        nombreAjoute: accepted.length,
        nombreIgnoreLimite: candidates.length - accepted.length,
        nombreIgnoreIndisponible: ignoredUnavailable
      };
    } catch {
      setError(true);
      return null;
    }
  }, [records, refresh, userId]);

  const slugs = useMemo(
    () => records.flatMap((record) => record.slug ? [record.slug] : []),
    [records]
  );

  const dataReady = initialized && ready && loadedUserId === userId;
  const value = useMemo(() => ({
    slugs: dataReady ? slugs : [],
    unavailableCount: dataReady ? records.filter((record) => record.slug === null).length : 0,
    authenticated: Boolean(userId),
    ready: dataReady,
    error,
    basculer,
    retirerIndisponibles,
    ajouterPlusieurs
  }), [
    slugs, records, userId, dataReady, error,
    basculer, retirerIndisponibles, ajouterPlusieurs
  ]);

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites(): FavoritesContextValue {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error("useFavorites must be used within FavoritesProvider.");
  return context;
}
