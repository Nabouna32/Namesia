import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

const siteUrl = new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://namesia.vercel.app");

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: { default: "Namesia — Le sens derrière chaque prénom", template: "%s · Namesia" },
  description: "Explorez les origines, les histoires et les traditions des prénoms avec Namesia.",
  applicationName: "Namesia",
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
    <header className="site-header"><div className="header-inner">
      <Link className="brand" href="/" aria-label="Namesia, accueil"><span className="brand-mark">n.</span><span>namesia</span></Link>
      <nav className="site-nav" aria-label="Navigation principale"><Link href="/prenoms">Explorer les prénoms</Link></nav>
    </div></header>
    {children}
    <footer className="site-footer"><div className="footer-inner">
      <Link className="brand footer-brand" href="/"><span className="brand-mark">n.</span><span>namesia</span></Link>
      <p>Les prénoms ont des histoires. Prenons le temps de les raconter.</p>
      <span className="footer-note">© {new Date().getFullYear()} Namesia</span>
    </div></footer>
  </body></html>;
}
