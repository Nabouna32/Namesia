import type { Metadata } from "next";
import Link from "next/link";
import { RandomDiscovery } from "@/components/features/discovery/RandomDiscovery";
import { RecentNames } from "@/components/features/history/RecentNames";
import { FeaturedNames } from "@/components/features/catalog/FeaturedNames";
import { NameSearch } from "@/components/features/catalog/NameSearch";
import { getNamesIndex, type NameIndexEntry } from "@/lib/names";
import { Icon } from "@/components/material3/Icon";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { alternates: { canonical: "/" } };

export default async function HomePage() {
  const names = await getNamesIndex();
  const dailyOffset = names.length > 0
    ? Math.floor(Date.now() / 86_400_000) % names.length
    : 0;
  const featuredCount = Math.min(3, names.length);
  const featuredNames: NameIndexEntry[] = [];

  for (let position = 0; position < featuredCount; position += 1) {
    const catalogIndex = (dailyOffset + Math.floor(position * names.length / featuredCount)) % names.length;
    const name = names[catalogIndex];
    if (name) featuredNames.push(name);
  }

  return (
    <main id="contenu" tabIndex={-1}>
      <section className="hero">
        <div className="container hero-content">
          <div className="hero-intro">
            <span className="eyebrow"><span className="eyebrow-dot" /> L'univers des prénoms, autrement</span>
            <h1>Chaque prénom<br />a <em>son histoire.</em></h1>
            <p className="hero-copy">Une origine, des sonorités, des cultures et des traditions. Explorez les histoires qui se cachent derrière les prénoms.</p>
          </div>
          <div className="hero-tools">
            <h2>Un prénom en tête ?</h2>
            <NameSearch names={names} compact />
            {names.length > 0 && <RandomDiscovery names={names} />}
            <p className="ai-disclaimer">Les contenus sont générés par IA et peuvent comporter des erreurs.</p>
          </div>
        </div>
      </section>
      <RecentNames names={names} />
      <section className="section explore-section">
        <div className="container">
          <div className="section-heading">
            <div><span className="eyebrow">À explorer</span><h2>Les prénoms à découvrir</h2></div>
            <Link className="text-link" href="/prenoms">Tous les prénoms <Icon name="arrow-up-right" size={18} /></Link>
          </div>
          <FeaturedNames names={featuredNames} />
          {names.length === 0 && <p className="empty-state">Le catalogue sera bientôt disponible.</p>}
        </div>
      </section>
    </main>
  );
}
