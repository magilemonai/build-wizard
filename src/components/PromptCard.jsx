import { useState, useCallback } from "react";
import T from "../tokens.js";

/* ━━━ PromptCard ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Shows a prompt the user should copy into Claude in their other tab.
   Includes copy-to-clipboard and a "I tried it" confirmation.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export default function PromptCard({ prompt, context, onConfirm }) {
  const [copied, setCopied] = useState(false);
  const [hovered, setHovered] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const ta = document.createElement("textarea");
      ta.value = prompt;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [prompt]);

  return (
    <div style={{
      background: T.color.bgCard,
      border: `1.5px solid ${T.color.border}`,
      borderRadius: 14,
      overflow: "hidden",
      marginTop: 24,
      marginBottom: 8,
    }}>
      {/* Context line above the prompt */}
      {context && (
        <div style={{
          padding: "12px 20px 0",
          fontSize: 13,
          color: T.color.textMuted,
          lineHeight: 1.6,
        }}>
          {context}
        </div>
      )}

      {/* The prompt itself */}
      <div style={{
        padding: "16px 20px",
        fontFamily: "'DM Sans', monospace",
        fontSize: 14,
        lineHeight: 1.7,
        color: T.color.text,
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
      }}>
        {prompt}
      </div>

      {/* Action bar */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 20px",
        borderTop: `1px solid ${T.color.border}`,
        background: T.color.bgSubtle,
      }}>
        <button
          onClick={handleCopy}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "7px 14px",
            background: copied ? T.color.sageSoft : hovered ? T.color.bgCard : "transparent",
            border: `1px solid ${copied ? T.color.sageBorder : hovered ? T.color.borderHover : T.color.border}`,
            borderRadius: 8,
            fontFamily: T.font.body, fontSize: 13,
            color: copied ? T.color.sage : T.color.textMuted,
            cursor: "pointer",
            transition: `all 0.25s ${T.ease.smooth}`,
          }}
        >
          {copied ? "✓ Copied" : "Copy to clipboard"}
        </button>

        <button
          onClick={onConfirm}
          style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "7px 14px",
            background: T.color.copper,
            border: "none",
            borderRadius: 8,
            fontFamily: T.font.body, fontSize: 13, fontWeight: 500,
            color: "#fff",
            cursor: "pointer",
            transition: `all 0.25s ${T.ease.smooth}`,
          }}
        >
          I tried it →
        </button>
      </div>
    </div>
  );
}
