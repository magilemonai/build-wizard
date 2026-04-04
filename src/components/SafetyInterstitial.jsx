import { useState, useEffect } from "react";
import T from "../tokens.js";
import ContinueButton from "./ContinueButton.jsx";

/* ━━━ Safety Interstitial ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   "While we're at it" safety lesson between exercises.
   Supports multi-step acknowledgment: each click of Continue
   reveals the next point with a checkmark on the previous one.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export default function SafetyInterstitial({ title, points, children, onContinue }) {
  const [visible, setVisible] = useState(false);
  const [acknowledged, setAcknowledged] = useState(0);
  useEffect(() => { setTimeout(() => setVisible(true), 100); }, []);

  // If points array provided, use multi-step mode
  const isMultiStep = points && points.length > 0;
  const allAcknowledged = isMultiStep ? acknowledged >= points.length : true;

  const handleContinue = () => {
    if (isMultiStep && acknowledged < points.length) {
      setAcknowledged((a) => a + 1);
      return;
    }
    onContinue();
  };

  return (
    <div style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(16px)",
      transition: `all 0.5s ${T.ease.smooth}`,
    }}>
      <div style={{
        background: T.color.sageSoft,
        border: `1.5px solid ${T.color.sageBorder}`,
        borderRadius: 16,
        padding: "28px 28px",
      }}>
        <div style={{
          fontSize: 13, fontWeight: 500, letterSpacing: "0.08em",
          textTransform: "uppercase", color: T.color.sage,
          marginBottom: 10, fontFamily: T.font.body,
        }}>
          While we're at it
        </div>
        <h3 style={{
          fontFamily: T.font.display, fontSize: 24, fontWeight: 400,
          fontStyle: "italic", lineHeight: 1.3,
          color: T.color.text, margin: "0 0 16px 0",
        }}>
          {title}
        </h3>

        {isMultiStep ? (
          <div>
            {points.map((point, i) => {
              const isRevealed = i <= acknowledged;
              const isChecked = i < acknowledged;
              return (
                <div key={i} style={{
                  padding: "14px 0",
                  borderBottom: i < points.length - 1 ? `1px solid ${T.color.sageBorder}` : "none",
                  opacity: isRevealed ? 1 : 0.3,
                  transition: `all 0.4s ${T.ease.smooth}`,
                }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <span style={{
                      flexShrink: 0, marginTop: 2,
                      color: isChecked ? T.color.sage : T.color.textLight,
                      fontSize: 16, lineHeight: 1,
                      transition: `color 0.3s ${T.ease.smooth}`,
                    }}>
                      {isChecked ? "✓" : "○"}
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
              );
            })}
          </div>
        ) : (
          <div style={{ fontSize: 15, color: T.color.textMuted, lineHeight: 1.7 }}>
            {children}
          </div>
        )}
      </div>
      <ContinueButton
        onClick={handleContinue}
        label={isMultiStep && !allAcknowledged ? "Next point" : "Got it"}
      />
    </div>
  );
}
