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
  tip,
  prompt,
  promptContext,
  hint,
  onConfirm,
}) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), 60); }, []);

  return (
    <div style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(12px)",
      transition: `all 0.4s ${T.ease.smooth}`,
    }}>
      {/* Skill label */}
      {skillLabel && (
        <div style={{
          fontSize: 11, fontWeight: 500, letterSpacing: "0.08em",
          textTransform: "uppercase", color: T.color.copper,
          marginBottom: 10, fontFamily: T.font.body,
        }}>
          {skillLabel}
        </div>
      )}

      {/* Title */}
      <h2 style={{
        fontFamily: T.font.display, fontSize: "clamp(24px,5vw,30px)",
        fontWeight: 400, lineHeight: 1.3, margin: "0 0 8px 0",
        color: T.color.text,
      }}>
        {title}
      </h2>

      {/* Explanation */}
      <p style={{
        fontSize: 15, color: T.color.textMuted,
        margin: "0 0 20px 0", lineHeight: 1.65,
      }}>
        {explanation}
      </p>

      {/* Tip callout */}
      {tip && (
        <div style={{
          padding: "12px 16px",
          background: T.color.copperSoft,
          border: `1px solid rgba(191,123,94,0.15)`,
          borderRadius: 10,
          fontSize: 13, color: T.color.textMuted, lineHeight: 1.6,
          marginBottom: 4,
        }}>
          <strong style={{ color: T.color.copper }}>The move:</strong> {tip}
        </div>
      )}

      {/* Prompt card */}
      <PromptCard
        key={prompt}
        prompt={prompt}
        context={promptContext || "Try this in Claude:"}
        outcomeLabels={{ worked: "Output looks good", snag: "Need to iterate", skip: "Skip for now" }}
        onConfirm={onConfirm}
      />

      {/* Hint */}
      {hint && (
        <p style={{
          fontSize: 13, color: T.color.textLight,
          marginTop: 12, lineHeight: 1.6,
        }}>
          {hint}
        </p>
      )}
    </div>
  );
}
