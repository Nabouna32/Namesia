import type { Metadata } from "next";
import { RecherchePrenoms } from "@/components/recherche-prenoms";

export const metadata: Metadata = { title: "Explorer les prénoms", description: "Parcourez le catalogue Namesia et recherchez un prénom." };

export default function Catalogue() {
  return (
    <main className="page-main">
      <div className="container catalogue">
        <span className="eyebrow">Le catalogue</span>
        <h1>Trouvez le prénom<br /><em>qui vous parle.</em></h1>
        <p className="page-intro">Explorez notre sélection de prénoms. Chaque fiche sera enrichie progressivement avec des informations vérifiées et des sources consultables.</p>
        <div className="demo-notice"><span>ⓘ</span><p><strong>Version de démonstration</strong><br />Le catalogue contient actuellement quelques entrées de test. Les contenus documentaires ne sont pas encore publiés.</p></div>
        <RecherchePrenoms />
      </div>
    </main>
  );
}
