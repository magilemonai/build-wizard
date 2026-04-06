import { useState, useEffect } from "react";
import T from "../tokens.js";

/* ━━━ Threshold Interstitial (user-paced transition) ━━━━━━━━━━━ */
export default function ThresholdInterstitial({
  onComplete,
  headline = "Let's figure out what to build.",
  subtext = "A few questions, then we start.",
}) {
  const [phase, setPhase] = useState(0); // 0=entering, 1=visible
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setPhase(1), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{
        minHeight: "100vh", background: T.color.bg, position: "relative",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: T.font.body,
      }}>
        <div style={{
          textAlign: "center", padding: "0 20px",
          opacity: phase === 1 ? 1 : 0,
          transform: phase === 0
            ? "translateY(24px) scale(0.96)"
            : "translateY(0) scale(1)",
          transition: `all 0.6s ${T.ease.smooth}`,
        }}>
          <div style={{
            fontFamily: T.font.display, fontSize: 28, fontStyle: "italic",
            color: T.color.text, marginBottom: 8,
          }}>
            {headline}
          </div>
          <div style={{ fontSize: 15, color: T.color.textMuted, marginBottom: 32 }}>
            {subtext}
          </div>
          <button
            onClick={onComplete}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
              padding: "12px 32px",
              background: hovered ? T.color.copper : "transparent",
              color: hovered ? "#fff" : T.color.copper,
              border: `1.5px solid ${T.color.copper}`,
              borderRadius: 10,
              fontFamily: T.font.body,
              fontSize: 15,
              fontWeight: 500,
              cursor: "pointer",
              transition: `all 0.25s ${T.ease.smooth}`,
              opacity: phase === 1 ? 1 : 0,
              transform: phase === 1 ? "translateY(0)" : "translateY(8px)",
            }}
          >
            Continue →
          </button>
        </div>
      </div>
  );
}
