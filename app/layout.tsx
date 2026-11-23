import type { Metadata } from "next";
import Link from "next/link";
import { FavorisProvider } from "@/components/favoris-provider";
import { HistoriqueProvider } from "@/components/historique-provider";
import { MaterialThemeProvider } from "@/components/material-theme-provider";
import { NavigationAdaptative } from "@/components/navigation-adaptative";
import "./globals.css";
import { jsonLd } from "@/lib/json-ld";
import { siteUrl } from "@/lib/site-url";

const siteTitle = "Namesia — Le sens derrière chaque prénom";
const siteDescription = "Explorez les origines, les histoires et les traditions des prénoms avec Namesia.";

const siteWebData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Namesia",
  url: siteUrl.toString(),
  inLanguage: "fr-FR",
  description: siteDescription
};

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: { default: siteTitle, template: "%s · Namesia" },
  description: siteDescription,
  applicationName: "Namesia",
  twitter: { card: "summary_large_image", images: ["/opengraph-image"] },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Namesia",
    title: siteTitle,
    description: siteDescription,
    url: "/"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="fr" data-scroll-behavior="smooth"><body>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(siteWebData) }} />
    <a className="skip-link" href="#contenu">Aller au contenu</a>
    <MaterialThemeProvider>
      <FavorisProvider>
        <HistoriqueProvider>
          <div className="app-shell">
            <header className="top-app-bar">
              <div className="top-app-bar-inner">
                <Link className="brand" href="/" aria-label="Namesia, accueil">
                  <span className="brand-mark">n.</span>
                  <span>namesia</span>
                </Link>
                <span className="top-app-bar-caption">Le sens derrière chaque prénom</span>
              </div>
            </header>
            <NavigationAdaptative />
            <div className="app-content">
              {children}
              <footer className="site-footer">
                <div className="footer-inner">
                  <Link className="brand footer-brand" href="/">
                    <span className="brand-mark">n.</span>
                    <span>namesia</span>
                  </Link>
                  <p>Les prénoms ont des histoires. Prenons le temps de les raconter.</p>
                  <span className="footer-note">© {new Date().getFullYear()} Namesia</span>
                </div>
              </footer>
            </div>
          </div>
        </HistoriqueProvider>
      </FavorisProvider>
    </MaterialThemeProvider>
  </body></html>;
}
