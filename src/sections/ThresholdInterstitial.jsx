import { useState, useEffect } from "react";
import T from "../tokens.js";
import GrainOverlay from "../components/GrainOverlay.jsx";

/* ━━━ Threshold Interstitial (self-contained, auto-advances) ━━━━ */
export default function ThresholdInterstitial({ onComplete }) {
  const [phase, setPhase] = useState(0); // 0=entering, 1=visible, 2=exiting

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 50);
    const t2 = setTimeout(() => setPhase(2), 1800);
    const t3 = setTimeout(() => onComplete(), 2400);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete]);

  return (
    <>
      <GrainOverlay />
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
            : phase === 2
            ? "translateY(-16px) scale(1.02)"
            : "translateY(0) scale(1)",
          filter: phase === 1 ? "blur(0px)" : "blur(3px)",
          transition: phase === 2
            ? `all 0.5s ${T.ease.page}`
            : `all 0.6s ${T.ease.smooth}`,
        }}>
          <div style={{
            fontFamily: T.font.display, fontSize: 28, fontStyle: "italic",
            color: T.color.text, marginBottom: 8,
          }}>
            Let's find your project.
          </div>
          <div style={{ fontSize: 15, color: T.color.textMuted }}>
            A few questions, then we build.
          </div>
        </div>
      </div>
    </>
  );
}
