import type { MetadataRoute } from "next";
import { getPrenoms } from "@/lib/prenoms";

export const dynamic = "force-dynamic";

const siteUrl = new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://namesia.vercel.app");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const prenoms = await getPrenoms();

  return [
    { url: new URL("/", siteUrl).toString(), changeFrequency: "weekly", priority: 1 },
    { url: new URL("/prenoms", siteUrl).toString(), changeFrequency: "weekly", priority: 0.9 },
    ...prenoms.map((prenom) => ({
      url: new URL(`/prenoms/${prenom.slug}`, siteUrl).toString(),
      changeFrequency: "monthly" as const,
      priority: 0.8
    }))
  ];
}