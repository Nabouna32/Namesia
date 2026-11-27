import type { Metadata } from "next";
import { AccountClient, type AccountMode } from "./account-client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Mon compte",
  description: "Gérez votre compte Namesia.",
  robots: { index: false, follow: false }
};

type ParametreUrl = string | string[] | undefined;
type Props = {
  searchParams: Promise<{
    redirect?: ParametreUrl;
    mode?: ParametreUrl;
    confirmed?: ParametreUrl;
  }>;
};

function firstParam(value: ParametreUrl): string {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function getRedirectTo(value: string): string {
  if (value === "/admin" || value === "/favoris") return value;
  return /^\/prenoms\/[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value) ? value : "/";
}

function getInitialMode(value: string): AccountMode {
  if (value === "register" || value === "forgot" || value === "recovery") return value;
  return "login";
}

export default async function AccountPage({ searchParams }: Props) {
  if (process.env.NAMESIA_DEPLOYMENT_ENVIRONMENT === "preview") {
    return <main id="contenu" tabIndex={-1} className="page-main"><div className="container">
      <span className="eyebrow">Environnement de test</span>
      <h1>Comptes indisponibles</h1>
      <p className="page-intro">Les opérations de compte sont désactivées dans les previews Cloudflare pour éviter de créer des utilisateurs dans le projet Supabase de production.</p>
    </div></main>;
  }

  const params = await searchParams;
  const redirectTo = getRedirectTo(firstParam(params.redirect));
  const initialMode = getInitialMode(firstParam(params.mode));

  return (
    <main id="contenu" tabIndex={-1} className="page-main">
      <div className="container">
        <span className="eyebrow">Espace personnel</span>
        <h1>Votre compte</h1>
        <p className="page-intro">Un compte Namesia reste facultatif : le catalogue et toutes les fiches publiques restent accessibles sans inscription.</p>
        <AccountClient
          redirectTo={redirectTo}
          initialMode={initialMode}
          emailConfirmed={firstParam(params.confirmed) === "1"}
        />
      </div>
    </main>
  );
}
