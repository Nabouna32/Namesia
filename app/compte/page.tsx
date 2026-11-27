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

function getInitialMode(value: string): AccountMode {
  if (value === "register" || value === "forgot" || value === "recovery") return value;
  return "login";
}

export default async function AccountPage({ searchParams }: Props) {
  const params = await searchParams;
  const redirectTo = firstParam(params.redirect) === "/admin" ? "/admin" : "/";
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
