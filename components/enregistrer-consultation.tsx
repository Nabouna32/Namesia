"use client";

import { useEffect } from "react";
import { useHistorique } from "@/components/historique-provider";

export function EnregistrerConsultation({ slug }: { slug: string }) {
  const { pret, enregistrer } = useHistorique();

  useEffect(() => {
    if (pret) enregistrer(slug);
  }, [slug, pret, enregistrer]);

  return null;
}
