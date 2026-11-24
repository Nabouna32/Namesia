"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

type Props = { title: string; text: string; label: string; parameters?: string[] };

export function ShareLink({ title, text, label, parameters = [] }: Props) {
  const [message, setMessage] = useState("");

  async function share() {
    const url = new URL(window.location.pathname, window.location.origin);
    const recherche = new URL(window.location.href).searchParams;
    for (const parameter of parameters) {
      const valeur = recherche.get(parameter);
      if (valeur) url.searchParams.set(parameter, valeur);
    }
    const shareUrl = url.toString();

    if (typeof navigator.share === "function") {
      try {
        await navigator.share({
          title: title,
          text: text,
          url: shareUrl
        });
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      setMessage("Lien copié dans le presse-papiers.");
    } catch {
      setMessage("Le partage n’est pas disponible sur cet appareil.");
    }
  }

  return (
    <div className="profile-share">
      <Button variant="tonal" type="button" onClick={share}>{label}</Button>
      {message && <span className="share-feedback" role="status">{message}</span>}
    </div>
  );
}

export function ShareName({ name }: { name: string }) {
  return (
    <ShareLink
      title={`${name} · Namesia`}
      text={`Découvrez le prénom ${name} sur Namesia.`}
      label="Partager la fiche"
    />
  );
}
