import { ImageResponse } from "next/og";

export const alt = "CreditMap turns early college credit into an explainable degree plan.";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

const outcomes = [
  { school: "UF", course: "ECO 2013", use: "Degree requirement" },
  { school: "FIU", course: "ECO 2013", use: "Degree requirement" },
  { school: "UCF", course: "ECO 2013", use: "Degree requirement" },
] as const;

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "#f7fbf9",
          color: "#103341",
          display: "flex",
          fontFamily: "Arial, sans-serif",
          height: "100%",
          justifyContent: "space-between",
          padding: "72px",
          position: "relative",
          width: "100%",
        }}
      >
        <div
          style={{
            backgroundImage:
              "linear-gradient(rgba(16,51,65,0.055) 1px, transparent 1px), linear-gradient(90deg, rgba(16,51,65,0.055) 1px, transparent 1px)",
            backgroundSize: "38px 38px",
            inset: 0,
            position: "absolute",
          }}
        />

        <div style={{ display: "flex", flexDirection: "column", position: "relative", width: "610px" }}>
          <div style={{ alignItems: "center", display: "flex", fontSize: 28, fontWeight: 800 }}>
            <div
              style={{
                alignItems: "center",
                background: "#103341",
                borderRadius: 14,
                color: "#c7f3dd",
                display: "flex",
                height: 52,
                justifyContent: "center",
                marginRight: 16,
                width: 52,
              }}
            >
              C
            </div>
            CreditMap
          </div>
          <div style={{ display: "flex", flexDirection: "column", fontSize: 66, fontWeight: 800, letterSpacing: "-3px", lineHeight: 1.02, marginTop: 54 }}>
            <span>College credit,</span>
            <span>mapped clearly.</span>
          </div>
          <div style={{ color: "#4f6871", fontSize: 25, lineHeight: 1.45, marginTop: 26 }}>
            See how AP, CLEP, IB, AICE, and dual-enrollment credit can move a student toward a degree.
          </div>
          <div style={{ display: "flex", marginTop: 38 }}>
            {["Source-conscious", "Duplicate-safe", "Explainable"].map((label) => (
              <div
                key={label}
                style={{
                  background: "#e4f8ee",
                  border: "1px solid #a9e3c7",
                  borderRadius: 999,
                  color: "#176342",
                  fontSize: 17,
                  fontWeight: 700,
                  marginRight: 12,
                  padding: "10px 16px",
                }}
              >
                {label}
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            background: "#ffffff",
            border: "1px solid #cddbd6",
            borderRadius: 30,
            boxShadow: "0 24px 60px rgba(16,51,65,0.15)",
            display: "flex",
            flexDirection: "column",
            padding: "30px",
            position: "relative",
            width: "390px",
          }}
        >
          <div style={{ color: "#607780", display: "flex", fontSize: 16, fontWeight: 700, justifyContent: "space-between" }}>
            <span>AP Macroeconomics</span>
            <span>Score 4</span>
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, marginTop: 12 }}>One exam. Three paths.</div>
          <div style={{ display: "flex", flexDirection: "column", marginTop: 24 }}>
            {outcomes.map((outcome) => (
              <div
                key={outcome.school}
                style={{
                  alignItems: "center",
                  borderTop: "1px solid #e2ebe7",
                  display: "flex",
                  padding: "20px 0",
                }}
              >
                <div
                  style={{
                    alignItems: "center",
                    background: "#103341",
                    borderRadius: 12,
                    color: "white",
                    display: "flex",
                    fontSize: 16,
                    fontWeight: 800,
                    height: 44,
                    justifyContent: "center",
                    marginRight: 16,
                    width: 52,
                  }}
                >
                  {outcome.school}
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span style={{ fontSize: 19, fontWeight: 800 }}>{outcome.course}</span>
                  <span style={{ color: "#4f6871", fontSize: 15, marginTop: 3 }}>{outcome.use}</span>
                </div>
              </div>
            ))}
          </div>
          <div style={{ background: "#fff6dc", borderRadius: 14, color: "#755100", display: "flex", fontSize: 15, lineHeight: 1.35, marginTop: 4, padding: "13px 15px" }}>
            Every result shows its rule and official evidence.
          </div>
        </div>
      </div>
    ),
    size,
  );
}
