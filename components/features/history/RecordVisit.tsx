"use client";

import { useEffect } from "react";
import { useHistory } from "@/components/features/history/HistoryProvider";

export function RecordVisit({ slug }: { slug: string }) {
  const { ready, recordVisit } = useHistory();

  useEffect(() => {
    if (ready) recordVisit(slug);
  }, [slug, ready, recordVisit]);

  return null;
}
