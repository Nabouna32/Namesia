import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { Roboto } from "next/font/google";
import { FavoritesProvider } from "@/components/features/favorites/FavoritesProvider";
import { HistoryProvider } from "@/components/features/history/HistoryProvider";
import { NavigationBar } from "@/components/material3/NavigationBar";
import { NavigationRail } from "@/components/material3/NavigationRail";
import { TopAppBar } from "@/components/material3/TopAppBar";
import "./globals.css";
import { jsonLd } from "@/lib/json-ld";
import { siteUrl } from "@/lib/site-url";
import { materialThemeCss, materialThemeViewportColors } from "@/lib/material-theme";

const roboto = Roboto({
  weight: ["400", "500"],
  subsets: ["latin", "latin-ext"],
  display: "block",
  adjustFontFallback: false,
  variable: "--font-roboto"
});

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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: materialThemeViewportColors.light },
    { media: "(prefers-color-scheme: dark)", color: materialThemeViewportColors.dark }
  ]
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
  return <html lang="fr" className={roboto.variable} data-scroll-behavior="smooth"><head><style dangerouslySetInnerHTML={{ __html: materialThemeCss }} /></head><body>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(siteWebData) }} />
    <a className="skip-link" href="#contenu">Aller au contenu</a>
    <FavoritesProvider>
      <HistoryProvider>
        <div className="app-shell">
          <TopAppBar />
          <NavigationBar />
          <NavigationRail />
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
      </HistoryProvider>
    </FavoritesProvider>
  </body></html>;
}
