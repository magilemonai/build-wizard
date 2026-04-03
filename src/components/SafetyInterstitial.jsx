import { useState, useEffect } from "react";
import T from "../tokens.js";
import ContinueButton from "./ContinueButton.jsx";

/* ━━━ Safety Interstitial ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   "While we're at it" safety lesson between exercises.
   Sage-tinted, warm tone, not scolding.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export default function SafetyInterstitial({ icon, title, children, onContinue }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), 100); }, []);

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
        padding: "28px 24px",
      }}>
        {icon && (
          <div style={{
            fontSize: 24, marginBottom: 12, lineHeight: 1,
          }}>
            {icon}
          </div>
        )}
        <div style={{
          fontSize: 11, fontWeight: 500, letterSpacing: "0.1em",
          textTransform: "uppercase", color: T.color.sage,
          marginBottom: 8, fontFamily: T.font.body,
        }}>
          While we're at it
        </div>
        <h3 style={{
          fontFamily: T.font.display, fontSize: 22, fontWeight: 400,
          fontStyle: "italic", lineHeight: 1.3,
          color: T.color.text, margin: "0 0 12px 0",
        }}>
          {title}
        </h3>
        <div style={{
          fontSize: 14, color: T.color.textMuted, lineHeight: 1.7,
        }}>
          {children}
        </div>
      </div>
      <ContinueButton onClick={onContinue} label="Got it" />
    </div>
  );
}
