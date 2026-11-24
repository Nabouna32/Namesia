"use client";

import { useEffect } from "react";
import { useHistory } from "@/components/HistoryProvider";

export function RecordConsultation({ slug }: { slug: string }) {
  const { pret, enregistrer } = useHistory();

  useEffect(() => {
    if (pret) enregistrer(slug);
  }, [slug, pret, enregistrer]);

  return null;
}
