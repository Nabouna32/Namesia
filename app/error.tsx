"use client";

import { useEffect } from "react";
import Link from "next/link";

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
          Cette page n’a pas pu être chargée. Le problème a été signalé ; vous pouvez réessayer.
        </p>
        <p>
          <button className="button button-dark" type="button" onClick={reset}>
            Réessayer
          </button>{" "}
          <Link className="text-link" href="/">
            Retour à l’accueil
          </Link>
        </p>
        {error.digest && <p className="footer-note">Référence : {error.digest}</p>}
      </div>
    </main>
  );
}
