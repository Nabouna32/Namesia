import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Namesia — Le sens derrière chaque prénom";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <div style={{
      width: "100%", height: "100%", display: "flex", flexDirection: "column",
      justifyContent: "space-between", padding: "72px 82px", position: "relative",
      overflow: "hidden",
      background: "linear-gradient(115deg, #fff0f5 0%, #fff8e9 30%, #f0fff5 58%, #eef8ff 78%, #f8efff 100%)",
      color: "#30243b"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <div style={{ width: 58, height: 58, borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #ff5d8f, #ff9f43 28%, #62c88a 54%, #48b8e8 76%, #9870e8)", color: "#fff", fontFamily: "Georgia, serif", fontSize: 38 }}>n.</div>
        <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: 2 }}>NAMESIA</div>
      </div>
      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ color: "#9253a1", fontSize: 22, fontWeight: 700, letterSpacing: 4 }}>L’UNIVERS DES PRÉNOMS</div>
        <div style={{ fontFamily: "Georgia, serif", fontSize: 92, lineHeight: 1.05, letterSpacing: -3 }}>Chaque prénom<br />a son histoire.</div>
        <div style={{ maxWidth: 760, color: "#65586c", fontSize: 27, lineHeight: 1.4 }}>Découvrez les origines, les histoires et les traditions qui se cachent derrière les prénoms.</div>
      </div>
      <div style={{ position: "absolute", right: -110, bottom: -240, width: 600, height: 600, borderRadius: 300, border: "2px solid rgba(164, 99, 181, 0.18)" }} />
      <div style={{ position: "absolute", right: 20, bottom: -160, width: 430, height: 430, borderRadius: 215, border: "2px solid rgba(164, 99, 181, 0.14)" }} />
      <div style={{ color: "#8a7b91", fontSize: 18, letterSpacing: 2 }}>NAMESIA · DÉCOUVRIR AUTREMENT</div>
    </div>,
    size
  );
}