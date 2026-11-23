import { ImageResponse } from "next/og";
import { chargerPolicesOpenGraph } from "@/lib/polices-open-graph";

export const runtime = "nodejs";
export const alt = "Namesia — Le sens derrière chaque prénom";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    <div style={{
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      padding: "52px 64px",
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
        gap: 18,
        padding: 38,
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
        }}>L’univers des prénoms</div>
        <div style={{
          display: "flex",
          flexDirection: "column",
          fontSize: 82,
          lineHeight: 1.04,
          letterSpacing: -2
        }}>
          <div>Chaque prénom</div>
          <div style={{ color: "#005ac1" }}>a son histoire.</div>
        </div>
        <div style={{
          maxWidth: 850,
          color: "#44474f",
          fontSize: 24,
          lineHeight: 1.4
        }}>Découvrez les origines, les histoires et les traditions qui se cachent derrière les prénoms.</div>
      </div>
      <div style={{ color: "#44474f", fontSize: 16 }}>NAMESIA · DÉCOUVRIR AUTREMENT</div>
    </div>,
    { ...size, fonts: await chargerPolicesOpenGraph() }
  );
}
