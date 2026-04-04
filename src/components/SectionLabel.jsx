import T from "../tokens.js";

/* ━━━ Section Label ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export default function SectionLabel({ children }) {
  return (
    <div style={{
      fontFamily: T.font.body, fontSize: 13, fontWeight: 500,
      letterSpacing: "0.1em", textTransform: "uppercase",
      color: T.color.sage, marginBottom: 16,
    }}>{children}</div>
  );
}
