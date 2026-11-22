"use client";

import { useState } from "react";

type Props = { titre: string; texte: string; label: string; avecParametres?: boolean };

export function PartagerLien({ titre, texte, label, avecParametres = false }: Props) {
  const [message, setMessage] = useState("");

  async function partager() {
    const url = new URL(window.location.pathname, window.location.origin);
    if (avecParametres) {
      const selection = new URL(window.location.href).searchParams.get("prenoms");
      if (selection) url.searchParams.set("prenoms", selection);
    }
    const urlPartage = url.toString();

    if (typeof navigator.share === "function") {
      try {
        await navigator.share({
          title: titre,
          text: texte,
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
      <button className="share-button" type="button" onClick={partager}>{label}</button>
      {message && <span className="share-feedback" role="status">{message}</span>}
    </div>
  );
}

export function PartagerFiche({ nom }: { nom: string }) {
  return (
    <PartagerLien
      titre={`${nom} · Namesia`}
      texte={`Découvrez le prénom ${nom} sur Namesia.`}
      label="Partager la fiche"
    />
  );
}
