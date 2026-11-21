import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prenoms, trouverPrenom } from "@/lib/prenoms";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return prenoms.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const prenom = trouverPrenom(slug);
  return prenom ? { title: prenom.nom, description: `Découvrez la future fiche documentée du prénom ${prenom.nom} sur Namesia.` } : {};
}

export default async function FichePrenom({ params }: Props) {
  const { slug } = await params;
  const prenom = trouverPrenom(slug);
  if (!prenom) notFound();

  return (
    <main className="page-main profile-main">
      <div className="container profile">
        <Link href="/prenoms" className="back-link">← Retour au catalogue</Link>
        <div className="profile-heading">
          <span className="eyebrow">Fiche prénom · Démonstration</span>
          <h1>{prenom.nom}<span>.</span></h1>
          <p>{prenom.accroche}</p>
        </div>
        <div className="demo-notice"><span>ⓘ</span><p><strong>Fiche de démonstration</strong><br />Cette page illustre la structure éditoriale. Aucune origine, signification ou association symbolique n'est affirmée sans documentation vérifiée.</p></div>
        <div className="profile-grid">
          <section className="profile-panel">
            <span className="panel-index">01 / DOCUMENTATION</span>
            <h2>Origine & histoire</h2>
            <p className="pending">Les informations étymologiques et historiques seront ajoutées après vérification de sources fiables.</p>
            <span className="source-placeholder">Sources : en cours de constitution</span>
          </section>
          <section className="profile-panel">
            <span className="panel-index">02 / CULTURE</span>
            <h2>Symbolique & traditions</h2>
            <p className="pending">Les traditions et associations culturelles seront présentées avec leur contexte, sans portée scientifique ou prédictive.</p>
            <span className="source-placeholder">Contexte culturel : à documenter</span>
          </section>
        </div>
        <p className="profile-disclaimer">Namesia distingue les faits documentés des interprétations symboliques. Cette fiche n'est pas encore une publication éditoriale.</p>
      </div>
    </main>
  );
}
