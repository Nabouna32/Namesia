"use client";

import { useEffect } from "react";
import { useHistorique } from "@/components/historique-provider";

export function EnregistrerConsultation({ slug }: { slug: string }) {
  const { enregistrer } = useHistorique();

  useEffect(() => {
    enregistrer(slug);
  }, [slug, enregistrer]);

  return null;
}
