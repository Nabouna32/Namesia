import { LienBouton } from "@/components/ui/lien-bouton";

export default function NotFound() {
  return <main id="contenu" tabIndex={-1} className="page-main"><div className="container not-found"><span className="eyebrow">Erreur 404</span><h1>Ce prénom reste<br /><em>à découvrir.</em></h1><p>Cette page n'existe pas dans le catalogue pour le moment.</p><LienBouton href="/prenoms">Explorer les prénoms</LienBouton></div></main>;
}
