import { ImageResponse } from "next/og";
import { getPrenom } from "@/lib/prenoms";

export const runtime = "edge";
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
      width: "100%", height: "100%", display: "flex", flexDirection: "column",
      justifyContent: "space-between", padding: "64px 76px", position: "relative",
      overflow: "hidden",
      background: "linear-gradient(118deg, #fff0f5 0%, #fff9ed 38%, #effaf5 70%, #f2efff 100%)",
      color: "#30243b"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ width: 48, height: 48, borderRadius: 17, display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #ff5d8f, #ff9f43 28%, #62c88a 54%, #48b8e8 76%, #9870e8)", color: "#fff", fontFamily: "Georgia, serif", fontSize: 32 }}>n.</div>
        <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: 2 }}>NAMESIA</div>
      </div>
      <div style={{ position: "relative", zIndex: 1, maxWidth: 880, display: "flex", flexDirection: "column", gap: 18 }}>
        <div style={{ color: "#9253a1", fontSize: 20, fontWeight: 700, letterSpacing: 4 }}>DÉCOUVRIR UN PRÉNOM</div>
        <div style={{ fontFamily: "Georgia, serif", fontSize: tailleNom, lineHeight: 1.02, letterSpacing: -3 }}>{prenom.nom}<span style={{ color: "#a85ab7" }}>.</span></div>
        <div style={{ maxWidth: 820, color: "#51445a", fontSize: 25, lineHeight: 1.4 }}>{extrait}</div>
        <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
          <div style={{ padding: "9px 18px", borderRadius: 24, border: "1px solid rgba(126, 77, 143, 0.24)", background: "rgba(255,255,255,0.75)", color: "#684875", fontSize: 17 }}>{prenom.genre}</div>
          <div style={{ padding: "9px 18px", borderRadius: 24, border: "1px solid rgba(126, 77, 143, 0.24)", background: "rgba(255,255,255,0.75)", color: "#684875", fontSize: 17 }}>Lettre {prenom.lettre}</div>
        </div>
      </div>
      <div style={{ position: "absolute", right: 24, bottom: -210, color: "rgba(124, 75, 145, 0.10)", fontFamily: "Georgia, serif", fontSize: 460, lineHeight: 1 }}>{prenom.lettre}</div>
      <div style={{ color: "#8a7b91", fontSize: 17, letterSpacing: 1 }}>ORIGINE · HISTOIRE · USAGES</div>
    </div>,
    size
  );
}