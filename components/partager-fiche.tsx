"use client";

import { useState } from "react";

type Props = { nom: string };

export function PartagerFiche({ nom }: Props) {
  const [message, setMessage] = useState("");

  async function partager() {
    const url = window.location.href;

    try {
      if (typeof navigator.share === "function") {
        await navigator.share({
          title: `${nom} · Namesia`,
          text: `Découvrez le prénom ${nom} sur Namesia.`,
          url
        });
        return;
      }

      await navigator.clipboard.writeText(url);
      setMessage("Lien copié dans le presse-papiers.");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
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