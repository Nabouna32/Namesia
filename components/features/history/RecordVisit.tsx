"use client";

import { useEffect } from "react";
import { useHistory } from "@/components/features/history/HistoryProvider";

export function RecordVisit({ slug }: { slug: string }) {
  const { ready, error, recordVisit } = useHistory();

  useEffect(() => {
    if (ready && !error) recordVisit(slug);
  }, [slug, ready, error, recordVisit]);

  return null;
}
