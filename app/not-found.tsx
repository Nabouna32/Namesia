import Link from "next/link";
import { Button } from "@/components/material3/Button";

export default function NotFound() {
  return (
    <main id="contenu" tabIndex={-1} className="page-main">
      <div className="container not-found">
        <span className="eyebrow">Erreur 404</span>
        <h1>Cette page est<br /><em>introuvable.</em></h1>
        <p>Cette adresse ne mène à aucune page disponible. Vérifiez le lien ou reprenez votre exploration.</p>
        <div>
          <Button href="/prenoms">Explorer les prénoms</Button>
          {" "}
          <Link className="text-link" href="/">Retour à l’accueil</Link>
        </div>
      </div>
    </main>
  );
}
