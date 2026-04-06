import { useState, useEffect } from "react";
import T from "../tokens.js";
import ContinueButton from "./ContinueButton.jsx";

/* ━━━ Path Card (project plan) ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export default function PathCard({ data, onContinue, quickPath }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), 200); return () => clearTimeout(t); }, []);

  return (
    <div style={{
      background: T.color.bgCard, borderRadius: 20, overflow: "hidden",
      boxShadow: `0 8px 40px ${T.color.shadowDeep}, 0 1px 3px ${T.color.shadow}`,
      border: `1px solid ${T.color.border}`,
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0) scale(1)" : "translateY(24px) scale(0.97)",
      transition: `all 0.6s ${T.ease.smooth}`,
    }}>
      {/* Gradient stripe */}
      <div style={{ height: 4, background: `linear-gradient(90deg, ${T.color.copper}, ${T.color.sage})` }} />

      {/* Header */}
      <div style={{ padding: "24px 28px 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: T.color.copper, fontFamily: T.font.body }}>
            Your Project
          </div>
          <div style={{ fontSize: 13, fontWeight: 500, letterSpacing: "0.04em", color: T.color.textLight, fontFamily: T.font.body, padding: "4px 12px", borderRadius: 20, background: T.color.bgSubtle }}>
            {data.level}
          </div>
        </div>
        <h2 style={{ fontFamily: T.font.display, fontSize: 26, fontWeight: 400, margin: 0, fontStyle: "italic", lineHeight: 1.3 }}>
          {data.projectName}
        </h2>
      </div>

      {/* Description + details */}
      <div style={{ padding: "0 28px 8px" }}>
        <p style={{ color: T.color.textMuted, fontSize: 15, lineHeight: 1.65, margin: "0 0 20px 0" }}>
          {data.projectDescription}
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 16 }}>
          {[{ label: "Duration", value: data.time }, { label: "Up next", value: quickPath ? "Foundation" : "Ice Breaker" }, { label: "Setup", value: data.setup }].map((item) => (
            <div key={item.label} style={{ padding: "12px 0", borderTop: `1px solid ${T.color.border}` }}>
              <div style={{ fontSize: 13, fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", color: T.color.textLight, marginBottom: 4, fontFamily: T.font.body }}>{item.label}</div>
              <div style={{ fontSize: 15, fontWeight: 500, fontFamily: T.font.body }}>{item.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Skills footer */}
      <div style={{ background: T.color.bgSubtle, padding: "20px 28px 24px", borderTop: `1px solid ${T.color.border}` }}>
        <div style={{ fontSize: 14, fontWeight: 500, letterSpacing: "0.04em", color: T.color.textMuted, marginBottom: 6 }}>
          What you'll pick up along the way
        </div>
        <div style={{ fontSize: 15, color: T.color.text, lineHeight: 1.65 }}>{data.learns}</div>
        {quickPath && (
          <p style={{ fontSize: 14, color: T.color.textLight, margin: "10px 0 0", lineHeight: 1.5, fontStyle: "italic" }}>
            Since you have experience and limited time, we'll skip the warm-up exercises and jump straight into building.
          </p>
        )}
        <ContinueButton onClick={onContinue} label="Start building" />
      </div>
    </div>
  );
}
