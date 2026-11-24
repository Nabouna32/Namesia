"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Erreur non récupérée dans une page Namesia :", error);
  }, [error]);

  return (
    <main id="contenu" tabIndex={-1} className="page-main">
      <div className="container not-found">
        <span className="eyebrow">Incident temporaire</span>
        <h1>Un petit détour<br /><em>technique.</em></h1>
        <p role="alert">
          Cette page n’a pas pu être chargée. Vous pouvez réessayer ou revenir à l’accueil.
        </p>
        <p>
          <Button onClick={reset}>Réessayer</Button>{" "}
          <Link className="text-link" href="/">
            Retour à l’accueil
          </Link>
        </p>
        {error.digest && <p className="footer-note">Référence : {error.digest}</p>}
      </div>
    </main>
  );
}
