import { useState } from "react";
import T from "../tokens.js";

/* ━━━ Back Button ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export default function BackButton({ onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        padding: "6px 0", marginBottom: 20, background: "none", border: "none",
        fontFamily: T.font.body, fontSize: 14, color: T.color.textLight,
        cursor: "pointer", transition: `color 0.2s ${T.ease.smooth}`,
        ...(hovered && { color: T.color.textMuted }),
      }}>
      <span style={{
        display: "inline-block", transition: `transform 0.2s ${T.ease.smooth}`,
        transform: hovered ? "translateX(-2px)" : "translateX(0)",
      }}>←</span>
      Back
    </button>
  );
}
