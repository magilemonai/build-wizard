import { useState, useCallback, useRef, useEffect } from "react";
import T from "../tokens.js";

/* ━━━ PromptCard ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Shows a prompt the user should copy into Claude in their other tab.
   Includes copy-to-clipboard and outcome feedback.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export default function PromptCard({ prompt, context, onConfirm, outcomeLabels }) {
  const [copied, setCopied] = useState(false);
  const [outcome, setOutcome] = useState(null); // null | "worked" | "snag" | "skip"
  const [copyHovered, setCopyHovered] = useState(false);
  const copyTimer = useRef(null);
  const outcomeTimer = useRef(null);

  useEffect(() => () => {
    clearTimeout(copyTimer.current);
    clearTimeout(outcomeTimer.current);
  }, []);

  const hasPlaceholders = /\[.+?\]/.test(prompt);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), hasPlaceholders ? 4000 : 2000);
    } catch {
      // Clipboard API unavailable: user can select & copy manually
    }
  }, [prompt, hasPlaceholders]);

  const handleOutcome = useCallback((result) => {
    setOutcome(result);
    // "snag" stays visible until user clicks Continue (manual advance)
    // "worked" gets a brief celebration, "skip" advances quickly
    clearTimeout(outcomeTimer.current);
    if (result === "worked") {
      outcomeTimer.current = setTimeout(() => onConfirm(result), 800);
    } else if (result === "skip") {
      outcomeTimer.current = setTimeout(() => onConfirm(result), 600);
    }
    // "snag" waits for manual Continue click
  }, [onConfirm]);

  const outcomeMessages = {
    worked: "Nice. Let's keep going.",
    snag: "That's okay. Try this:",
    skip: "Skipping this one. Moving on.",
  };

  // Show celebration/acknowledgment state
  if (outcome) {
    return (
      <div style={{
        marginTop: 24, marginBottom: 8,
        padding: outcome === "snag" ? "24px" : "32px 24px",
        background: outcome === "worked" ? T.color.copperSoft : T.color.bgSubtle,
        border: `1.5px solid ${outcome === "worked" ? "rgba(191,123,94,0.2)" : T.color.border}`,
        borderRadius: 16,
        textAlign: outcome === "snag" ? "left" : "center",
        animation: "fadeInNotice 0.3s ease",
      }}>
        <div style={{
          fontSize: 15, fontWeight: 500,
          color: outcome === "worked" ? T.color.copper : T.color.textMuted,
          fontFamily: T.font.body,
          marginBottom: outcome === "snag" ? 10 : 0,
        }}>
          {outcomeMessages[outcome]}
        </div>
        {outcome === "snag" && (
          <>
            <div style={{ fontSize: 15, color: T.color.textMuted, lineHeight: 1.6, marginBottom: 16 }}>
              Tell Claude what went wrong. "That didn't work because..." or "I wanted X
              but got Y" teaches it what you need. Go back to your Claude tab, iterate on the
              result, then come back here when you're ready.
            </div>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <button
                onClick={() => onConfirm("snag")}
                style={{
                  padding: "10px 20px",
                  background: T.color.copper,
                  color: "#fff",
                  border: "none", borderRadius: 8,
                  fontFamily: T.font.body, fontSize: 15, fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                Ready to continue
              </button>
              <button
                onClick={() => setOutcome(null)}
                style={{
                  padding: "10px 20px",
                  background: "transparent",
                  color: T.color.textMuted,
                  border: `1px solid ${T.color.border}`, borderRadius: 8,
                  fontFamily: T.font.body, fontSize: 15,
                  cursor: "pointer",
                }}
              >
                Show prompt again
              </button>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div style={{
      background: T.color.bgCard,
      border: `1.5px solid ${T.color.border}`,
      borderRadius: 16,
      overflow: "hidden",
      marginTop: 24,
      marginBottom: 8,
    }}>
      {/* Header + prompt */}
      {context && (
        <div style={{
          padding: "14px 20px",
          fontSize: 13, fontWeight: 500, letterSpacing: "0.03em",
          color: T.color.textLight,
          borderBottom: `1px solid ${T.color.border}`,
          fontFamily: T.font.body,
        }}>
          {context}
        </div>
      )}
      <div style={{
        padding: "16px 20px",
        fontFamily: "'Courier New', Courier, monospace",
        fontSize: 15,
        lineHeight: 1.7,
        color: T.color.text,
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
        background: "rgba(44,41,37,0.05)",
        borderTop: `1px solid ${T.color.border}`,
        borderBottom: `1px solid ${T.color.border}`,
      }}>
        {prompt}
      </div>

      {/* Action bar: copy + outcome choices */}
      <div style={{
        padding: "16px 20px",
        background: T.color.bgSubtle,
      }}>
        {/* Copy button */}
        <div style={{ marginBottom: 12 }}>
          <button
            onClick={handleCopy}
            onMouseEnter={() => setCopyHovered(true)}
            onMouseLeave={() => setCopyHovered(false)}
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "8px 16px",
              background: copied ? T.color.sageSoft : copyHovered ? T.color.bgCard : "transparent",
              border: `1px solid ${copied ? T.color.sageBorder : copyHovered ? T.color.borderHover : T.color.border}`,
              borderRadius: 8,
              fontFamily: T.font.body, fontSize: 15,
              color: copied ? T.color.sage : T.color.textMuted,
              cursor: "pointer",
              transition: `all 0.25s ${T.ease.smooth}`,
            }}
          >
            {copied
            ? (hasPlaceholders ? "✓ Copied — fill in the [brackets] before pasting" : "✓ Copied")
            : "Copy to clipboard"}
          </button>
        </div>

        {/* Outcome choices */}
        <div style={{
          fontSize: 15, color: T.color.textLight,
          marginBottom: 8, fontFamily: T.font.body,
        }}>
          {hasPlaceholders
            ? "Fill in the [brackets], paste into Claude, then tell us how it went:"
            : "Paste it into Claude, then tell us how it went:"}
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {[
            { key: "worked", label: outcomeLabels?.worked || "It worked!" },
            { key: "snag", label: outcomeLabels?.snag || "Hit a snag" },
            { key: "skip", label: outcomeLabels?.skip || "Skip for now" },
          ].map((opt) => (
            <OutcomeButton key={opt.key} onClick={() => handleOutcome(opt.key)}>
              {opt.label}
            </OutcomeButton>
          ))}
        </div>
      </div>
    </div>
  );
}

function OutcomeButton({ children, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: "8px 16px",
        background: hovered ? T.color.bgCard : "transparent",
        border: `1px solid ${hovered ? T.color.borderHover : T.color.border}`,
        borderRadius: 8,
        fontFamily: T.font.body, fontSize: 15,
        color: T.color.textMuted,
        cursor: "pointer",
        transition: `all 0.25s ${T.ease.smooth}`,
      }}
    >
      {children}
    </button>
  );
}
