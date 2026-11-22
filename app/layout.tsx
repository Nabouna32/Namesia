import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { jsonLd } from "@/lib/json-ld";
import { siteUrl } from "@/lib/site-url";

const siteWebData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Namesia",
  url: siteUrl.toString(),
  inLanguage: "fr-FR",
  description: "Explorez les origines, les histoires et les traditions des prénoms avec Namesia."
};

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: { default: "Namesia — Le sens derrière chaque prénom", template: "%s · Namesia" },
  description: "Explorez les origines, les histoires et les traditions des prénoms avec Namesia.",
  applicationName: "Namesia",
  twitter: { card: "summary_large_image", images: ["/opengraph-image"] },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Namesia",
    title: "Namesia — Le sens derrière chaque prénom",
    description: "Explorez les origines, les histoires et les traditions des prénoms avec Namesia.",
    url: "/"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="fr" data-scroll-behavior="smooth"><body>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(siteWebData) }} />
    <a className="skip-link" href="#contenu">Aller au contenu</a>
    <header className="site-header"><div className="header-inner">
      <Link className="brand" href="/" aria-label="Namesia, accueil"><span className="brand-mark">n.</span><span>namesia</span></Link>
      <nav className="site-nav" aria-label="Navigation principale"><Link href="/prenoms">Explorer</Link><Link href="/comparer">Comparer</Link></nav>
    </div></header>
    {children}
    <footer className="site-footer"><div className="footer-inner">
      <Link className="brand footer-brand" href="/"><span className="brand-mark">n.</span><span>namesia</span></Link>
      <p>Les prénoms ont des histoires. Prenons le temps de les raconter.</p>
      <span className="footer-note">© {new Date().getFullYear()} Namesia</span>
    </div></footer>
  </body></html>;
}
