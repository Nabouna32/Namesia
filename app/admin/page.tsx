import type { Metadata } from "next";
import { AdminClient } from "./admin-client";

export const metadata: Metadata = {
  title: "Administration",
  robots: { index: false, follow: false }
};

export default function Administration() {
  return <main id="contenu" className="page-main"><div className="container">
    <span className="eyebrow">Espace privé</span>
    <h1>Administration</h1>
    <p className="page-intro">Importer une fiche JSON, la vérifier, puis décider explicitement de sa publication.</p>
    <AdminClient />
  </div></main>;
}
