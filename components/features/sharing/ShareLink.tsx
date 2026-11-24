"use client";

import { useState } from "react";
import { Button } from "@/components/material3/Button";

type Props = { title: string; text: string; label: string; queryParameters?: string[] };

export function ShareLink({ title, text, label, queryParameters = [] }: Props) {
  const [message, setMessage] = useState("");

  async function partager() {
    const url = new URL(window.location.pathname, window.location.origin);
    const recherche = new URL(window.location.href).searchParams;
    for (const parameter of queryParameters) {
      const value = recherche.get(parameter);
      if (value) url.searchParams.set(parameter, value);
    }
    const urlPartage = url.toString();

    if (typeof navigator.share === "function") {
      try {
        await navigator.share({
          title,
          text,
          url: urlPartage
        });
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }

    try {
      await navigator.clipboard.writeText(urlPartage);
      setMessage("Lien copié dans le presse-papiers.");
    } catch {
      setMessage("Le partage n’est pas disponible sur cet appareil.");
    }
  }

  return (
    <div className="profile-share">
      <Button variant="tonal" type="button" onClick={partager}>{label}</Button>
      {message && <span className="share-feedback" role="status">{message}</span>}
    </div>
  );
}

export function ShareProfile({ name }: { name: string }) {
  return (
    <ShareLink
      title={`${name} · Namesia`}
      text={`Découvrez le prénom ${name} sur Namesia.`}
      label="Partager la fiche"
    />
  );
}
