import { useState, useCallback, useRef, useEffect } from "react";
import T from "../tokens.js";
import ContinueButton from "./ContinueButton.jsx";
import { track } from "../services/analytics.js";

/* ━━━ PromptCard ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Shows a prompt the user should copy into Claude in their other tab.
   Includes copy-to-clipboard, outcome feedback, and manual advance.

   Flow: copy prompt → paste in Claude → select outcome → read feedback
   → click Continue to advance. No auto-advance.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export default function PromptCard({ prompt, context, onConfirm, outcomeLabels, analyticsContext }) {
  const [copied, setCopied] = useState(false);
  const [outcome, setOutcome] = useState(null); // null | "worked" | "snag" | "skip"
  const [copyHovered, setCopyHovered] = useState(false);
  const copyTimer = useRef(null);

  useEffect(() => () => clearTimeout(copyTimer.current), []);

  const hasPlaceholders = /\[.+?\]/.test(prompt);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), hasPlaceholders ? 4000 : 2000);
    } catch {
      // Clipboard API unavailable — prompt user to select manually
      setCopied("manual");
      clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), 4000);
    }
    track("prompt_copy", {
      section: analyticsContext?.section,
      step_index: analyticsContext?.stepIndex,
      had_placeholders: hasPlaceholders,
    });
  }, [prompt, hasPlaceholders, analyticsContext]);

  const outcomeContent = {
    worked: {
      message: "Nice work.",
      detail: "If Claude suggested follow-up actions, ignore those for now. The next step is here in the wizard.",
    },
    snag: {
      message: "That's okay. Try this:",
      detail: "Tell Claude what went wrong. \"That didn't work because...\" or \"I wanted X but got Y\" teaches it what you need. Iterate in Claude until you're happy, then come back here.",
    },
    skip: {
      message: "No problem.",
      detail: "The next step may reference what this one built. If something doesn't make sense, you can come back.",
    },
  };

  return (
    <div style={{ marginTop: 24, marginBottom: 8 }}>
      {/* Prompt card */}
      <div style={{
        background: T.color.bgCard,
        border: `1.5px solid ${T.color.border}`,
        borderRadius: 16,
        overflow: "hidden",
      }}>
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
          fontSize: 15, lineHeight: 1.7,
          color: T.color.text,
          whiteSpace: "pre-wrap", wordBreak: "break-word",
          background: T.color.bgSubtle,
          borderTop: `1px solid ${T.color.border}`,
          borderBottom: `1px solid ${T.color.border}`,
        }}>
          {prompt}
        </div>

        {/* Action bar */}
        <div style={{ padding: "16px 20px", background: T.color.bgSubtle }}>
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
              {copied === "manual"
              ? "Select the text above and copy manually"
              : copied
              ? (hasPlaceholders ? "✓ Copied — fill in the [brackets] before pasting" : "✓ Copied")
              : "Copy to clipboard"}
            </button>

          </div>

          <div style={{
            fontSize: 15, color: T.color.textLight,
            marginBottom: 8, fontFamily: T.font.body,
          }}>
            {hasPlaceholders
              ? "Fill in the [brackets], paste into Claude, then come back and pick what happened:"
              : "Paste into Claude, then come back and pick what happened:"}
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {[
              { key: "worked", label: outcomeLabels?.worked || "It worked!" },
              { key: "snag", label: outcomeLabels?.snag || "Hit a snag" },
              { key: "skip", label: outcomeLabels?.skip || "Skip for now" },
            ].map((opt) => (
              <OutcomeButton
                key={opt.key}
                selected={outcome === opt.key}
                onClick={() => {
                  setOutcome(opt.key);
                  track("outcome_choice", {
                    section: analyticsContext?.section,
                    step_index: analyticsContext?.stepIndex,
                    outcome: opt.key,
                  });
                }}
              >
                {opt.label}
              </OutcomeButton>
            ))}
          </div>
        </div>
      </div>

      {/* Outcome feedback + Continue (appears below card when outcome selected) */}
      {outcome && (
        <div style={{
          marginTop: 12,
          padding: "18px 20px",
          background: outcome === "worked" ? T.color.copperSoft : T.color.bgSubtle,
          border: `1.5px solid ${outcome === "worked" ? T.color.copperGlow : T.color.border}`,
          borderRadius: 12,
          animation: "fadeInNotice 0.3s ease",
        }}>
          <div style={{
            fontSize: 15, fontWeight: 500,
            color: outcome === "worked" ? T.color.copper : T.color.textMuted,
            fontFamily: T.font.body, marginBottom: 6,
          }}>
            {outcomeContent[outcome].message}
          </div>
          <div style={{ fontSize: 15, color: T.color.textMuted, lineHeight: 1.6, marginBottom: outcome === "snag" ? 12 : 0 }}>
            {outcomeContent[outcome].detail}
          </div>
          {outcome === "snag" && (
            <button
              onClick={() => setOutcome(null)}
              style={{
                padding: "8px 16px", marginTop: 8,
                background: "transparent",
                color: T.color.textMuted,
                border: `1px solid ${T.color.border}`, borderRadius: 8,
                fontFamily: T.font.body, fontSize: 14,
                cursor: "pointer",
              }}
            >
              Show prompt again
            </button>
          )}
          <ContinueButton onClick={() => onConfirm(outcome)} label="Continue" />
        </div>
      )}
    </div>
  );
}

function OutcomeButton({ children, onClick, selected }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: "8px 16px",
        background: selected ? T.color.copperSoft : hovered ? T.color.bgCard : "transparent",
        border: `1px solid ${selected ? T.color.copper : hovered ? T.color.borderHover : T.color.border}`,
        borderRadius: 8,
        fontFamily: T.font.body, fontSize: 15,
        color: selected ? T.color.copper : T.color.textMuted,
        fontWeight: selected ? 500 : 400,
        cursor: "pointer",
        transition: `all 0.25s ${T.ease.smooth}`,
      }}
    >
      {children}
    </button>
  );
}
