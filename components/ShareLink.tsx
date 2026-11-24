"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

type Props = { titre: string; texte: string; label: string; parametres?: string[] };

export function ShareLink({ titre, texte, label, parametres = [] }: Props) {
  const [message, setMessage] = useState("");

  async function partager() {
    const url = new URL(window.location.pathname, window.location.origin);
    const recherche = new URL(window.location.href).searchParams;
    for (const parametre of parametres) {
      const valeur = recherche.get(parametre);
      if (valeur) url.searchParams.set(parametre, valeur);
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
      <Button variant="tonal" type="button" onClick={partager}>{label}</Button>
      {message && <span className="share-feedback" role="status">{message}</span>}
    </div>
  );
}

export function PartagerFiche({ nom }: { nom: string }) {
  return (
    <ShareLink
      titre={`${nom} · Namesia`}
      texte={`Découvrez le prénom ${nom} sur Namesia.`}
      label="Partager la fiche"
    />
  );
}
