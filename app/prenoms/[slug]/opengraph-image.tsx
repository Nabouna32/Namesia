import { ImageResponse } from "next/og";
import { getPrenom } from "@/lib/prenoms";
import { chargerPolicesOpenGraph } from "@/lib/polices-open-graph";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const alt = "Aperçu d’une fiche prénom Namesia";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type Props = { params: Promise<{ slug: string }> };

export default async function Image({ params }: Props) {
  const { slug } = await params;
  const prenom = await getPrenom(slug);
  if (!prenom) return new Response("Fiche introuvable", { status: 404 });

  const extrait = prenom.introduction.length > 150
    ? `${prenom.introduction.slice(0, 147).trimEnd()}…`
    : prenom.introduction;
  const tailleNom = prenom.nom.length > 14 ? 74 : prenom.nom.length > 10 ? 88 : 108;

  return new ImageResponse(
    <div style={{
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      padding: "48px 64px",
      background: "#f2f3fa",
      color: "#191b20",
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
          background: "linear-gradient(105deg, #ef568b 0%, #f29a42 19%, #e8c94c 36%, #55b987 54%, #49a9d5 72%, #8669d4 88%, #d76bb5 100%)",
          color: "#ffffff",
          fontSize: 25
        }}>n.</div>
        <div style={{ fontSize: 25, letterSpacing: 0.2 }}>namesia</div>
      </div>
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: 16,
        padding: 36,
        borderRadius: 28,
        background: "#f9f9ff"
      }}>
        <div style={{
          alignSelf: "flex-start",
          padding: "8px 14px",
          borderRadius: 18,
          background: "#dbe2f9",
          color: "#131b2c",
          fontSize: 18
        }}>Découvrir un prénom</div>
        <div style={{
          display: "flex",
          alignItems: "baseline",
          fontSize: tailleNom,
          lineHeight: 1.04,
          letterSpacing: -2
        }}>{prenom.nom}<span style={{ color: "#005ac1" }}>.</span></div>
        <div style={{
          maxWidth: 1000,
          color: "#44474f",
          fontSize: 23,
          lineHeight: 1.35
        }}>{extrait}</div>
        <div style={{ display: "flex", gap: 12, marginTop: 4 }}>
          <div style={{
            padding: "8px 16px",
            borderRadius: 20,
            background: "#dbe2f9",
            color: "#131b2c",
            fontSize: 17
          }}>{prenom.genre}</div>
          <div style={{
            padding: "8px 16px",
            borderRadius: 20,
            background: "#dbe2f9",
            color: "#131b2c",
            fontSize: 17
          }}>Lettre {prenom.lettre}</div>
        </div>
      </div>
      <div style={{ color: "#44474f", fontSize: 16 }}>ORIGINE · HISTOIRE · USAGES</div>
    </div>,
    { ...size, fonts: await chargerPolicesOpenGraph() }
  );
}
