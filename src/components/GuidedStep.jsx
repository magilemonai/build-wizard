import { useState, useEffect } from "react";
import T from "../tokens.js";
import PromptCard from "./PromptCard.jsx";

/* ━━━ GuidedStep ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   The teach-then-do pattern for build sections.

   Structure:
   1. Skill label (what you're learning)
   2. Headline + explanation (why this matters)
   3. A "try this" tip (the concept in one line)
   4. PromptCard (the thing to actually do in Claude)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export default function GuidedStep({
  skillLabel,
  title,
  explanation,
  prompt,
  hint,
  showThinkingNote,
  onConfirm,
}) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), 60); return () => clearTimeout(t); }, []);

  return (
    <div style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(12px)",
      transition: `all 0.4s ${T.ease.smooth}`,
    }}>
      {/* Skill label */}
      {skillLabel && (
        <div style={{
          fontSize: 13, fontWeight: 500, letterSpacing: "0.08em",
          textTransform: "uppercase", color: T.color.copper,
          marginBottom: 10, fontFamily: T.font.body,
        }}>
          {skillLabel}
        </div>
      )}

      {/* Title */}
      <h2 style={{
        fontFamily: T.font.display, fontSize: "clamp(26px,5vw,34px)",
        fontWeight: 400, lineHeight: 1.3, margin: "0 0 10px 0",
        color: T.color.text,
      }}>
        {title}
      </h2>

      {/* Explanation */}
      <p style={{
        fontSize: 16, color: T.color.textMuted,
        margin: "0 0 20px 0", lineHeight: 1.65,
      }}>
        {explanation}
      </p>

      {/* Prompt card */}
      <PromptCard
        key={prompt}
        prompt={prompt}
        context="Try this in Claude:"
        outcomeLabels={{ worked: "Output looks good", snag: "Need to iterate", skip: "Skip (next step builds on this)" }}
        onConfirm={onConfirm}
      />

      {/* Hint */}
      {showThinkingNote && (
        <div style={{
          marginTop: 14, padding: "10px 14px",
          background: T.color.bgSubtle,
          border: `1px solid ${T.color.border}`,
          borderRadius: 8,
          display: "flex", alignItems: "center", gap: 8,
          fontSize: 14, color: T.color.textMuted, lineHeight: 1.5,
        }}>
          <span style={{ fontSize: 16 }}>⏳</span>
          Claude may take a moment on this one. That's normal for longer responses.
        </div>
      )}

      {hint && (
        <p style={{
          fontSize: 14, color: T.color.textMuted,
          marginTop: 8, lineHeight: 1.6,
          fontStyle: "italic",
        }}>
          {hint}
        </p>
      )}
    </div>
  );
}
