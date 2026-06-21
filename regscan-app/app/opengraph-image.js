import { ImageResponse } from "next/og";

// Default social-share image for any page that doesn't set its own (posts use
// their featured image). Generated at build time — no binary asset to maintain.
export const alt = "RegScan — Check your MOT & tax in seconds";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#0E1014",
          color: "#ffffff",
        }}
      >
        <div style={{ display: "flex", fontSize: 36, fontWeight: 700, color: "#F5B301" }}>
          RegScan
        </div>
        <div style={{ display: "flex", fontSize: 66, fontWeight: 800, lineHeight: 1.1, marginTop: 24 }}>
          Check your MOT &amp; tax in seconds
        </div>
        <div style={{ display: "flex", fontSize: 28, color: "#A9B0B8", marginTop: 22 }}>
          Official DVSA &amp; DVLA data · Free to use
        </div>
      </div>
    ),
    { ...size }
  );
}
