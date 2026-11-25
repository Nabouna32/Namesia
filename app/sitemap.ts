import type { MetadataRoute } from "next";
import { getNamesSitemap } from "@/lib/names";
import { siteUrl } from "@/lib/site-url";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const names = await getNamesSitemap();

  return [
    { url: new URL("/", siteUrl).toString(), changeFrequency: "weekly", priority: 1 },
    { url: new URL("/prenoms", siteUrl).toString(), changeFrequency: "weekly", priority: 0.9 },
    { url: new URL("/tendances", siteUrl).toString(), changeFrequency: "monthly", priority: 0.7 },
    ...names.map((name) => ({
      url: new URL(`/prenoms/${name.slug}`, siteUrl).toString(),
      lastModified: name.publishedAt,
      changeFrequency: "monthly" as const,
      priority: 0.8
    }))
  ];
}