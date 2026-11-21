import Link from "next/link";

export default function NotFound() {
  return <main className="page-main"><div className="container not-found"><span className="eyebrow">Erreur 404</span><h1>Ce prénom reste<br /><em>à découvrir.</em></h1><p>Cette page n'existe pas dans le catalogue pour le moment.</p><Link className="button button-dark" href="/prenoms">Explorer les prénoms</Link></div></main>;
}
