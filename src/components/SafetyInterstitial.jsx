import { useState, useEffect } from "react";
import T from "../tokens.js";
import ContinueButton from "./ContinueButton.jsx";
import OrganicShape from "./OrganicShape.jsx";

/* ━━━ Safety Interstitial ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Safety checkpoint between exercises. Warm red/warning tone to
   signal importance. Points visible at once. Single "Got it" button.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export default function SafetyInterstitial({ title, points, children, onContinue, sectionShapeIndex }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), 80); return () => clearTimeout(t); }, []);

  const hasPoints = points && points.length > 0;

  return (
    <div style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(12px)",
      transition: `all 0.5s ${T.ease.smooth}`,
    }}>
      <div style={{
        background: T.color.warningSoft,
        border: `1.5px solid ${T.color.warningBorder}`,
        borderRadius: 16,
        padding: "28px 28px",
      }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          fontSize: 13, fontWeight: 600, letterSpacing: "0.08em",
          textTransform: "uppercase", color: T.color.warning,
          marginBottom: 10, fontFamily: T.font.body,
        }}>
          {sectionShapeIndex != null && (
            <OrganicShape shapeIndex={sectionShapeIndex} size={10} color={T.color.warning} />
          )}
          Important
        </div>
        <h3 style={{
          fontFamily: T.font.display, fontSize: "clamp(22px,4vw,28px)", fontWeight: 400,
          fontStyle: "italic", lineHeight: 1.3,
          color: T.color.text, margin: "0 0 16px 0",
        }}>
          {title}
        </h3>

        {hasPoints ? (
          <div>
            {points.map((point, i) => (
              <div key={i} style={{
                padding: "14px 0",
                borderBottom: i < points.length - 1 ? `1px solid ${T.color.warningBorder}` : "none",
                opacity: 1,
                animation: `fadeInNotice 0.4s ease ${0.1 + i * 0.15}s both`,
              }}>
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <span style={{
                    flexShrink: 0, marginTop: 1,
                    color: T.color.warning,
                    fontSize: 13, fontWeight: 600, lineHeight: "22px",
                    fontFamily: T.font.body,
                  }}>
                    {i + 1}.
                  </span>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 500, color: T.color.text, marginBottom: 4 }}>
                      {point.title}
                    </div>
                    <div style={{ fontSize: 15, color: T.color.textMuted, lineHeight: 1.6 }}>
                      {point.body}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ fontSize: 15, color: T.color.textMuted, lineHeight: 1.7 }}>
            {children}
          </div>
        )}
      </div>
      <ContinueButton onClick={onContinue} label="Got it" />
    </div>
  );
}
