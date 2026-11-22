import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPrenom } from "@/lib/prenoms";

type Props = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const prenom = await getPrenom(slug);
  return prenom ? { title: prenom.nom, description: prenom.introduction } : {};
}

export default async function FichePrenom({ params }: Props) {
  const { slug } = await params;
  const prenom = await getPrenom(slug);
  if (!prenom) notFound();

  return <main className="page-main profile-main"><div className="container profile">
    <Link href="/prenoms" className="back-link">← Tous les prénoms</Link>
    <div className="profile-heading">
      <span className="eyebrow">Prénom · {prenom.genre}</span>
      <h1>{prenom.nom}<span>.</span></h1>
      <p>{prenom.introduction}</p>
    </div>
    <div className="profile-grid">
      {prenom.origin && <section className="profile-panel"><h2>Origine & signification</h2><p className="profile-copy">{prenom.origin}</p></section>}
      {prenom.history && <section className="profile-panel"><h2>Histoire du prénom</h2><p className="profile-copy">{prenom.history}</p></section>}
      {prenom.usage && <section className="profile-panel"><h2>Variantes & usages</h2><p className="profile-copy">{prenom.usage}</p></section>}
    </div>
    {prenom.symbolic_associations.length > 0 && <section className="symbolic-section">
      <span className="eyebrow">Regards culturels</span>
      <h2>Symbolique & traditions</h2>
      <div className="symbolic-grid">{prenom.symbolic_associations.map((symbol) => <article className="symbolic-card" key={`${symbol.category}-${symbol.value}`}>
        <span>{symbol.category}</span>
        <h3>{symbol.value}</h3>
        <p>{symbol.context_note}</p>
        <small>Association symbolique ou culturelle, sans valeur scientifique ou prédictive.</small>
      </article>)}</div>
    </section>}
    <p className="profile-disclaimer">Les contenus de cette fiche sont générés par intelligence artificielle et peuvent comporter des erreurs. Les interprétations culturelles ou symboliques ne décrivent pas la personnalité des personnes qui portent ce prénom.</p>
  </div></main>;
}
