import { Button } from "@/components/material3/Button";

export default function NotFound() {
  return <main id="contenu" tabIndex={-1} className="page-main"><div className="container not-found"><span className="eyebrow">Erreur 404</span><h1>Ce prénom reste<br /><em>à découvrir.</em></h1><p>Cette page n'existe pas dans le catalogue pour le moment.</p><Button href="/prenoms">Explorer les prénoms</Button></div></main>;
}
