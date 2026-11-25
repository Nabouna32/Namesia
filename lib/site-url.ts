const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;

if (!configuredSiteUrl) {
  throw new Error("NEXT_PUBLIC_SITE_URL est obligatoire.");
}

export const siteUrl = new URL(configuredSiteUrl);

if (siteUrl.protocol !== "https:" && siteUrl.protocol !== "http:") {
  throw new Error("NEXT_PUBLIC_SITE_URL doit utiliser HTTP ou HTTPS.");
}

if (process.env.NODE_ENV === "production" && siteUrl.protocol !== "https:") {
  throw new Error("NEXT_PUBLIC_SITE_URL doit utiliser HTTPS en production.");
}

if (siteUrl.pathname !== "/" || siteUrl.search || siteUrl.hash || siteUrl.username || siteUrl.password) {
  throw new Error("NEXT_PUBLIC_SITE_URL doit contenir uniquement l'origine du site.");
}
