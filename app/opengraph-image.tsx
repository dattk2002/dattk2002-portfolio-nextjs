import { ImageResponse } from "next/og";

import { BrandMark } from "@/components/brand-mark";

export const alt = "Tran Kim Dat — Full-stack Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#090b0c", color: "#f1efe7", padding: "64px", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <BrandMark style={{ width: 42, height: 42, color: "#c7f36b" }} />
          <span style={{ fontWeight: 700 }}>TRAN KIM DAT</span>
        </div>
        <span style={{ color: "#7ea2b8", fontSize: 18 }}>FULL-STACK DEVELOPER · HO CHI MINH CITY</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: 82, lineHeight: 0.95, letterSpacing: "-5px", maxWidth: 1000 }}>Digital products from interface to infrastructure.</div>
        <div style={{ marginTop: 34, fontSize: 22, color: "#a7adb0" }}>Tran Kim Dat · Portfolio</div>
      </div>
      <div style={{ display: "flex", width: "100%", height: 6, background: "#151a1d" }}><div style={{ width: "36%", background: "#c7f36b" }} /></div>
    </div>,
    size,
  );
}
