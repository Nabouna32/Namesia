import type { Metadata } from "next";
import { AdminClient } from "./admin-client";

export const metadata: Metadata = {
  title: "Administration",
  robots: { index: false, follow: false }
};

export default function Administration() {
  if (process.env.NAMESIA_DEPLOYMENT_ENVIRONMENT === "preview") {
    return <main id="contenu" tabIndex={-1} className="page-main"><div className="container">
      <span className="eyebrow">Environnement de test</span>
      <h1>Administration indisponible</h1>
      <p className="page-intro">Les opérations d’administration sont désactivées dans les previews Cloudflare.</p>
    </div></main>;
  }

  return <main id="contenu" tabIndex={-1} className="page-main"><div className="container">
    <span className="eyebrow">Espace privé</span>
    <h1>Administration</h1>
    <p className="page-intro">Importer une fiche JSON, la vérifier, puis décider explicitement de sa publication.</p>
    <AdminClient />
  </div></main>;
}
