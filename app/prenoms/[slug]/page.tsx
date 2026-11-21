import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPrenom, getPrenoms } from "@/lib/prenoms";
type Props = { params: Promise<{ slug: string }> };
export const revalidate = 3600;
export async function generateStaticParams() {
  return (await getPrenoms()).map(({ slug }) => ({ slug }));
}
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
    <div className="profile-heading"><span className="eyebrow">Prénom · {prenom.genre}</span><h1>{prenom.nom}<span>.</span></h1><p>{prenom.introduction}</p></div>
    <div className="profile-grid">
      {prenom.origine && <section className="profile-panel"><h2>Origine & signification</h2><p className="profile-copy">{prenom.origine}</p></section>}
      {prenom.histoire && <section className="profile-panel"><h2>Histoire du prénom</h2><p className="profile-copy">{prenom.histoire}</p></section>}
      {prenom.usage && <section className="profile-panel"><h2>Variantes & usages</h2><p className="profile-copy">{prenom.usage}</p></section>}
    </div>
    {prenom.symboles.length > 0 && <section className="symbolic-section"><span className="eyebrow">Regards culturels</span><h2>Symbolique & traditions</h2><div className="symbolic-grid">{prenom.symboles.map((symbol) => <article className="symbolic-card" key={symbol.id}><span>{symbol.category}</span><h3>{symbol.value}</h3><p>{symbol.context_note}</p><small>{symbol.disclaimer}</small></article>)}</div></section>}
    <p className="profile-disclaimer">Les étymologies peuvent comporter plusieurs hypothèses. Les interprétations culturelles ou symboliques, lorsqu'elles sont présentées, ne décrivent pas la personnalité des personnes qui portent un prénom.</p>
  </div></main>;
}
