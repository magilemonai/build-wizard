import { useState, useEffect } from "react";
import T from "../tokens.js";

/* ━━━ Choice Button (stagger gated by parent signal) ━━━━━━━━━━━━ */
export default function ChoiceButton({ children, selected, onClick, delay = 0, ready = true }) {
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!ready) { setVisible(false); return; }
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [ready, delay]);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "block", width: "100%", padding: "16px 22px", marginBottom: 10,
        background: selected ? T.color.sageSoft : hovered ? T.color.bgSubtle : T.color.bgCard,
        border: `1.5px solid ${selected ? T.color.sageBorder : hovered ? T.color.borderHover : T.color.border}`,
        borderRadius: 12, fontFamily: T.font.body, fontSize: 16,
        fontWeight: selected ? 500 : 400,
        color: selected ? T.color.sage : T.color.text,
        cursor: "pointer", textAlign: "left",
        transition: `all 0.3s ${T.ease.smooth}`,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateX(0) scale(1)" : "translateX(20px) scale(0.97)",
        boxShadow: selected ? `0 2px 12px ${T.color.shadow}` : hovered ? `0 1px 6px ${T.color.shadow}` : "none",
        lineHeight: 1.5,
      }}
    >
      {children}
    </button>
  );
}
