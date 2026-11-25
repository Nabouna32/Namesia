import { ImageResponse } from "next/og";
import { getNameOpenGraphBySlug } from "@/lib/names";
import { chargerPolicesOpenGraph } from "@/lib/polices-open-graph";
import { getMaterialThemeTokens } from "@/lib/material-theme";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const alt = "Aperçu d’une fiche prénom Namesia";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type Props = { params: Promise<{ slug: string }> };

export default async function Image({ params }: Props) {
  const { slug } = await params;
  const name = await getNameOpenGraphBySlug(slug);
  if (!name) return new Response("Fiche introuvable", { status: 404 });

  const tailleNom = Math.min(116, Math.max(54, Math.floor(1080 / (name.name.length * 0.58))));
  const theme = getMaterialThemeTokens(false);

  return new ImageResponse(
    <div style={{
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      padding: "52px 68px",
      background: theme["--md-sys-color-background"],
      color: theme["--md-sys-color-on-background"],
      fontFamily: "Roboto"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{
          width: 48,
          height: 48,
          borderRadius: 16,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: theme["--md-sys-color-primary"],
          color: theme["--md-sys-color-on-primary"],
          fontSize: 25
        }}>n.</div>
        <div style={{ fontSize: 25, letterSpacing: 0.2 }}>namesia</div>
      </div>
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: 24,
        padding: 44,
        borderRadius: 28,
        background: theme["--md-sys-color-surface-container-lowest"]
      }}>
        <div style={{
          fontSize: tailleNom,
          lineHeight: 1.04,
          letterSpacing: -2
        }}>{name.name}<span style={{ color: theme["--md-sys-color-primary"] }}>.</span></div>
        <div style={{
          alignSelf: "flex-start",
          padding: "10px 18px",
          borderRadius: 20,
          background: theme["--md-sys-color-secondary-container"],
          color: theme["--md-sys-color-on-secondary-container"],
          fontSize: 20
        }}>{name.gender} · Lettre {name.initial}</div>
      </div>
      <div style={{ color: theme["--md-sys-color-on-surface-variant"], fontSize: 16 }}>ORIGINE · HISTOIRE · USAGES</div>
    </div>,
    { ...size, fonts: await chargerPolicesOpenGraph() }
  );
}
