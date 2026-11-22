"use client";

import { useState } from "react";

type Props = { nom: string };

export function PartagerFiche({ nom }: Props) {
  const [message, setMessage] = useState("");

  async function partager() {
    const url = new URL(window.location.pathname, window.location.origin).toString();

    if (typeof navigator.share === "function") {
      try {
        await navigator.share({
          title: `${nom} · Namesia`,
          text: `Découvrez le prénom ${nom} sur Namesia.`,
          url
        });
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setMessage("Lien copié dans le presse-papiers.");
    } catch {
      setMessage("Le partage n’est pas disponible sur cet appareil.");
    }
  }

  return (
    <div className="profile-share">
      <button className="share-button" type="button" onClick={partager}>Partager la fiche</button>
      {message && <span className="share-feedback" role="status">{message}</span>}
    </div>
  );
}