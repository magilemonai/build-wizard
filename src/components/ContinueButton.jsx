import { useState } from "react";
import T from "../tokens.js";

/* ━━━ Continue Button ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export default function ContinueButton({ onClick, label = "Continue", disabled }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button onClick={onClick} disabled={disabled}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{
        display: "inline-flex", alignItems: "center", gap: 8,
        padding: "13px 28px", marginTop: 28,
        background: disabled ? T.color.bgSubtle : hovered ? T.color.copperHover : T.color.copper,
        color: disabled ? T.color.textLight : "#fff",
        border: "none", borderRadius: 10, fontFamily: T.font.body,
        fontSize: 15, fontWeight: 500, cursor: disabled ? "default" : "pointer",
        transition: `all 0.35s ${T.ease.smooth}`,
        transform: hovered && !disabled ? "translateY(-1px)" : "translateY(0)",
        boxShadow: hovered && !disabled ? `0 6px 20px ${T.color.copperGlow}` : "none",
        letterSpacing: "0.01em",
      }}>
      {label}
      <span style={{
        display: "inline-block", transition: `transform 0.3s ${T.ease.smooth}`,
        transform: hovered && !disabled ? "translateX(3px)" : "translateX(0)",
      }}>→</span>
    </button>
  );
}
