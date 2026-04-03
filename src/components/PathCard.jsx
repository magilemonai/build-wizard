import { useState, useEffect } from "react";
import T from "../tokens.js";
import ContinueButton from "./ContinueButton.jsx";

/* ━━━ Boarding Pass Path Card ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export default function PathCard({ data, onContinue }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), 200); }, []);

  return (
    <div style={{
      background: T.color.bgCard, borderRadius: 20, overflow: "hidden",
      boxShadow: `0 8px 40px ${T.color.shadowDeep}, 0 1px 3px ${T.color.shadow}`,
      border: `1px solid ${T.color.border}`,
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0) scale(1)" : "translateY(24px) scale(0.97)",
      transition: `all 0.6s ${T.ease.smooth}`,
    }}>
      <div style={{ height: 4, background: `linear-gradient(90deg, ${T.color.copper}, ${T.color.sage})` }} />
      <div style={{ padding: "28px 28px 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: T.color.copper, fontFamily: T.font.body }}>
            Boarding Pass
          </div>
          <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: "0.06em", color: T.color.textLight, fontFamily: T.font.body, padding: "3px 10px", borderRadius: 20, background: T.color.bgSubtle }}>
            {data.level}
          </div>
        </div>
        <h2 style={{ fontFamily: T.font.display, fontSize: 24, fontWeight: 400, margin: 0, fontStyle: "italic", lineHeight: 1.3 }}>
          {data.projectName}
        </h2>
      </div>

      {/* Perforation */}
      <div style={{ position: "relative", height: 1, margin: "0 16px" }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, borderTop: `2px dashed ${T.color.border}` }} />
        <div style={{ position: "absolute", left: -25, top: -11, width: 22, height: 22, borderRadius: "50%", background: T.color.bg, boxShadow: `inset 2px 0 4px ${T.color.shadow}` }} />
        <div style={{ position: "absolute", right: -25, top: -11, width: 22, height: 22, borderRadius: "50%", background: T.color.bg, boxShadow: `inset -2px 0 4px ${T.color.shadow}` }} />
      </div>

      <div style={{ padding: "20px 28px 8px" }}>
        <p style={{ color: T.color.textMuted, fontSize: 14, lineHeight: 1.65, margin: "0 0 20px 0" }}>
          {data.projectDescription}
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 16 }}>
          {[{ label: "Duration", value: data.time }, { label: "Up next", value: "Ice Breaker" }, { label: "Setup", value: data.setup }].map((item) => (
            <div key={item.label} style={{ padding: "12px 0", borderTop: `1px solid ${T.color.border}` }}>
              <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: T.color.textLight, marginBottom: 4, fontFamily: T.font.body }}>{item.label}</div>
              <div style={{ fontSize: 15, fontWeight: 500, fontFamily: T.font.body }}>{item.value}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: T.color.bgSubtle, padding: "18px 28px 24px", borderTop: `1px solid ${T.color.border}` }}>
        <div style={{ fontSize: 12, fontWeight: 500, letterSpacing: "0.04em", color: T.color.textMuted, marginBottom: 4 }}>
          What you'll pick up along the way
        </div>
        <div style={{ fontSize: 13, color: T.color.textLight, lineHeight: 1.6 }}>{data.learns}</div>
        <ContinueButton onClick={onContinue} label="Start building" />
      </div>
    </div>
  );
}
