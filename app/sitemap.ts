import type { MetadataRoute } from "next";
import { getPrenomsSitemap } from "@/lib/prenoms";
import { siteUrl } from "@/lib/site-url";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const prenoms = await getPrenomsSitemap();

  return [
    { url: new URL("/", siteUrl).toString(), changeFrequency: "weekly", priority: 1 },
    { url: new URL("/prenoms", siteUrl).toString(), changeFrequency: "weekly", priority: 0.9 },
    ...prenoms.map((prenom) => ({
      url: new URL(`/prenoms/${prenom.slug}`, siteUrl).toString(),
      lastModified: prenom.publishedAt,
      changeFrequency: "monthly" as const,
      priority: 0.8
    }))
  ];
}