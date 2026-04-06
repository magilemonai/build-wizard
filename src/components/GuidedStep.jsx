import { useState, useEffect } from "react";
import T from "../tokens.js";
import PromptCard from "./PromptCard.jsx";
import OrganicShape from "./OrganicShape.jsx";

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
  sectionShapeIndex,
  coachingNote,
}) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), 80); return () => clearTimeout(t); }, []);

  return (
    <div style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(12px)",
      transition: `all 0.4s ${T.ease.smooth}`,
    }}>
      {/* Skill label with section shape */}
      {skillLabel && (
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          fontSize: 13, fontWeight: 500, letterSpacing: "0.08em",
          textTransform: "uppercase", color: T.color.copper,
          marginBottom: 10, fontFamily: T.font.body,
        }}>
          {sectionShapeIndex != null && (
            <OrganicShape shapeIndex={sectionShapeIndex} size={10} color={T.color.copper} />
          )}
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

      {/* Hint: shown before prompt so user reads it before switching tabs */}
      {hint && (
        <p style={{
          fontSize: 15, color: T.color.textMuted,
          margin: "0 0 6px 0", lineHeight: 1.6,
          fontStyle: "italic",
        }}>
          {hint}
        </p>
      )}

      {/* Shape coaching note: the section's shape "speaks" with personality */}
      {coachingNote && sectionShapeIndex != null && (
        <div style={{
          display: "flex", gap: 16, alignItems: "flex-start",
          padding: "16px 18px",
          background: T.color.bgSubtle,
          border: `1px solid ${T.color.border}`,
          borderRadius: 14,
          marginBottom: 10,
          position: "relative",
        }}>
          {/* Animated shape with sparkles */}
          <div style={{ flexShrink: 0, position: "relative", width: 36, height: 36 }}>
            <div style={{
              animation: "gentleSpin 12s linear infinite",
              lineHeight: 0,
            }}>
              <OrganicShape shapeIndex={sectionShapeIndex} size={32} color={T.color.copper} />
            </div>
            {/* Sparkles */}
            {[
              { top: -4, right: -2, delay: 0 },
              { top: 8, right: -6, delay: 1.2 },
              { bottom: -2, left: 2, delay: 0.6 },
            ].map((pos, i) => (
              <div key={i} style={{
                position: "absolute", ...pos, width: 5, height: 5,
                borderRadius: "50%",
                background: T.color.copper,
                animation: `sparkle 2s ease-in-out ${pos.delay}s infinite`,
              }} />
            ))}
          </div>
          {/* Speech bubble-style text */}
          <div style={{
            fontSize: 15, color: T.color.textMuted, lineHeight: 1.6,
            paddingTop: 4,
          }}>
            {coachingNote}
          </div>
        </div>
      )}

      {/* Thinking note: before prompt so user knows to expect a wait */}
      {showThinkingNote && (
        <div style={{
          marginBottom: 8, padding: "10px 14px",
          background: T.color.bgSubtle,
          border: `1px solid ${T.color.border}`,
          borderRadius: 12,
          display: "flex", alignItems: "center", gap: 8,
          fontSize: 15, color: T.color.textMuted, lineHeight: 1.5,
        }}>
          <span style={{ fontSize: 16 }}>⏳</span>
          Claude may take a moment on this one. That's normal for longer responses.
        </div>
      )}

      {/* Prompt card */}
      <PromptCard
        key={prompt}
        prompt={prompt}
        context="Try this in Claude:"
        outcomeLabels={{ worked: "Output looks good", snag: "Need to iterate", skip: "Skip (next step builds on this)" }}
        onConfirm={onConfirm}
      />
    </div>
  );
}
