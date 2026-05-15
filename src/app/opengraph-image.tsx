import { ImageResponse } from "next/og";

// Next renders this file into og:image. 1200×630 is the canonical OG size.
export const alt = "BiggDate — See your future, not just a profile";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background: "#050010",
          backgroundImage:
            "radial-gradient(ellipse 600px 400px at 12% 8%, rgba(255,43,214,0.30), transparent), radial-gradient(ellipse 620px 420px at 88% 94%, rgba(43,200,255,0.26), transparent)",
        }}
      >
        {/* Wordmark */}
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "13px",
              background: "linear-gradient(135deg, #ff2bd6, #4d6bff)",
            }}
          />
          <div
            style={{
              fontSize: "34px",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              color: "#f5f0ff",
            }}
          >
            BIGGDATE
          </div>
        </div>

        {/* Headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
          <div
            style={{
              fontSize: "82px",
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: "-0.035em",
              color: "#f5f0ff",
              maxWidth: "900px",
              display: "flex",
            }}
          >
            See your future, not just a profile.
          </div>
          <div
            style={{
              fontSize: "32px",
              fontWeight: 500,
              color: "rgba(245,240,255,0.62)",
              maxWidth: "820px",
              display: "flex",
            }}
          >
            A relationship intelligence platform for people who date with intention.
          </div>
        </div>

        {/* Footer rule */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              height: "4px",
              width: "72px",
              borderRadius: "2px",
              background: "linear-gradient(90deg, #ff2bd6, #4d6bff)",
            }}
          />
          <div style={{ fontSize: "24px", color: "rgba(245,240,255,0.42)", fontWeight: 600 }}>
            biggdate.app
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
