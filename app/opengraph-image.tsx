import { ImageResponse } from "next/og";
import { chargerPolicesOpenGraph } from "@/lib/polices-open-graph";
import { getMaterialThemeTokens } from "@/lib/material-theme";

export const runtime = "nodejs";
export const alt = "Namesia — Le sens derrière chaque prénom";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const theme = getMaterialThemeTokens(false);

  return new ImageResponse(
    <div style={{
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      padding: "52px 64px",
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
        gap: 18,
        padding: 38,
        borderRadius: 28,
        background: theme["--md-sys-color-surface-container-lowest"]
      }}>
        <div style={{
          alignSelf: "flex-start",
          padding: "8px 14px",
          borderRadius: 18,
          background: theme["--md-sys-color-secondary-container"],
          color: theme["--md-sys-color-on-secondary-container"],
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
          <div style={{ color: theme["--md-sys-color-primary"] }}>a son histoire.</div>
        </div>
        <div style={{
          maxWidth: 850,
          color: theme["--md-sys-color-on-surface-variant"],
          fontSize: 24,
          lineHeight: 1.4
        }}>Découvrez les origines, les histoires et les traditions qui se cachent derrière les prénoms.</div>
      </div>
      <div style={{ color: theme["--md-sys-color-on-surface-variant"], fontSize: 16 }}>NAMESIA · DÉCOUVRIR AUTREMENT</div>
    </div>,
    { ...size, fonts: await chargerPolicesOpenGraph() }
  );
}
