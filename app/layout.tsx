import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Namesia — Le sens derrière chaque prénom", template: "%s · Namesia" },
  description: "Explorez les origines, les histoires et les traditions des prénoms avec Namesia.",
  applicationName: "Namesia"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="fr" data-scroll-behavior="smooth"><body>
    <header className="site-header"><div className="header-inner">
      <Link className="brand" href="/" aria-label="Namesia, accueil"><span className="brand-mark">n.</span><span>namesia</span></Link>
      <nav aria-label="Navigation principale"><Link href="/prenoms">Explorer les prénoms</Link><a href="/#approche">Notre approche</a></nav>
    </div></header>
    {children}
    <footer className="site-footer"><div className="footer-inner">
      <Link className="brand footer-brand" href="/"><span className="brand-mark">n.</span><span>namesia</span></Link>
      <p>Les prénoms ont des histoires. Prenons le temps de les raconter.</p>
      <span className="footer-note">© {new Date().getFullYear()} Namesia</span>
    </div></footer>
  </body></html>;
}
