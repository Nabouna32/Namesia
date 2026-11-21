import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPrenom, getPrenoms, type Source } from "@/lib/prenoms";
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
  const sourceEntries = prenom.claims.flatMap((claim) => claim.claim_sources.map((item) => item.sources).filter((source): source is Source => source !== null));
  const sources = Array.from(new Map<string, Source>(sourceEntries.map((source) => [source.url, source])).values());
  return <main className="page-main profile-main"><div className="container profile">
    <Link href="/prenoms" className="back-link">← Tous les prénoms</Link>
    <div className="profile-heading"><span className="eyebrow">Prénom · {prenom.genre}</span><h1>{prenom.nom}<span>.</span></h1><p>{prenom.introduction}</p></div>
    <div className="profile-grid">
      {prenom.origine && <section className="profile-panel"><span className="panel-index">01 / ÉTYMOLOGIE</span><h2>Origine & signification</h2><p className="profile-copy">{prenom.origine}</p></section>}
      {prenom.histoire && <section className="profile-panel"><span className="panel-index">02 / REPÈRES HISTORIQUES</span><h2>Histoire du prénom</h2><p className="profile-copy">{prenom.histoire}</p></section>}
      {prenom.usage && <section className="profile-panel"><span className="panel-index">03 / AUJOURD'HUI</span><h2>Variantes & usages</h2><p className="profile-copy">{prenom.usage}</p></section>}
      <section className="profile-panel"><span className="panel-index">04 / POUR ALLER PLUS LOIN</span><h2>Repères documentaires</h2>
        {prenom.claims.length ? <ul className="claim-list">{prenom.claims.map((claim) => <li key={claim.id}><p>{claim.content}</p><span className={claim.claim_status === "etabli" ? "claim-status" : "claim-status claim-discussed"}>{claim.claim_status === "etabli" ? "Repère établi" : "Piste à nuancer"}</span></li>)}</ul> : <p className="profile-copy">Les références de cette fiche seront enrichies au fil des recherches.</p>}
      </section>
    </div>
    {prenom.symboles.length > 0 && <section className="symbolic-section"><span className="eyebrow">Regards culturels</span><h2>Symbolique & traditions</h2><div className="symbolic-grid">{prenom.symboles.map((symbol) => <article className="symbolic-card" key={symbol.id}><span>{symbol.category}</span><h3>{symbol.value}</h3><p>{symbol.context_note}</p><small>{symbol.disclaimer}</small></article>)}</div></section>}
    {sources.length > 0 && <section className="sources-section"><span className="eyebrow">Références</span><h2>Pour approfondir</h2><ol>{sources.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.title} ↗</a>{source.publisher && <span>{source.publisher}</span>}</li>)}</ol></section>}
    <p className="profile-disclaimer">Les étymologies peuvent comporter plusieurs hypothèses. Les interprétations culturelles ou symboliques, lorsqu'elles sont présentées, ne décrivent pas la personnalité des personnes qui portent un prénom.</p>
  </div></main>;
}
