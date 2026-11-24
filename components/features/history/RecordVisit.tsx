"use client";

import { useEffect } from "react";
import { useHistory } from "@/components/features/history/HistoryProvider";

export function RecordVisit({ slug }: { slug: string }) {
  const { pret, enregistrer } = useHistory();

  useEffect(() => {
    if (pret) enregistrer(slug);
  }, [slug, pret, enregistrer]);

  return null;
}
