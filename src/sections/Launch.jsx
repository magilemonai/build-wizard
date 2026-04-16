import { useState, useCallback, useRef, useEffect } from "react";
import T from "../tokens.js";
import SectionShell from "../components/SectionShell.jsx";
import ContinueButton from "../components/ContinueButton.jsx";
import SectionCelebration from "../components/SectionCelebration.jsx";
import { track } from "../services/analytics.js";

/* ━━━ Stage 5: Launch ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Copy the assembled prompt, see contextual instructions for
   pasting into Claude, safety policy reminder, celebration on
   copy, transition to Keep Going.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function getModelRecommendation(features) {
  if (features?.includes("extended_thinking")) return "Opus with Extended Thinking turned on";
  return "Opus";
}

function hasResearch(features) {
  return features?.includes("research");
}

export default function Launch({
  onComplete, onBack, onProgress, initialStep, onStepChange,
  assembledPrompt, selectedTemplate,
}) {
  const features = selectedTemplate?.features || [];
  const steps = [{ type: "intro" }, { type: "handoff" }, { type: "transition" }];

  return (
    <SectionShell
      sectionKey="launch"
      steps={steps}
      onBack={onBack}
      onProgress={onProgress}
      initialStep={initialStep}
      onStepChange={onStepChange}
      renderStep={({ step, advance, BackButton }) => {
        if (step.type === "intro") {
          return <IntroStep BackButton={BackButton} onNext={advance} />;
        }
        if (step.type === "handoff") {
          return (
            <HandoffStep
              BackButton={BackButton}
              prompt={assembledPrompt}
              features={features}
              onCopied={advance}
            />
          );
        }
        if (step.type === "transition") {
          return <TransitionStep BackButton={BackButton} onContinue={onComplete} />;
        }
        return null;
      }}
    />
  );
}

/* ━━━ Step 1: Intro ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function IntroStep({ BackButton, onNext }) {
  return (
    <div>
      {BackButton}
      <div style={{
        fontFamily: T.font.body, fontSize: 13, fontWeight: 500,
        letterSpacing: "0.08em", textTransform: "uppercase",
        color: T.color.copper, marginBottom: 10,
      }}>
        The launch
      </div>
      <h2 style={{
        fontFamily: T.font.display, fontSize: "clamp(26px,5vw,34px)",
        fontWeight: 400, fontStyle: "italic", lineHeight: 1.3,
        margin: "0 0 12px 0", color: T.color.text,
      }}>
        Time to fly.
      </h2>
      <p style={{
        fontSize: 16, color: T.color.textMuted, lineHeight: 1.7,
        margin: "0 0 8px 0",
      }}>
        Your prompt is ready. Here's how to use it.
      </p>
      <ContinueButton onClick={onNext} label="Let's go" />
    </div>
  );
}

/* ━━━ Step 2: The Handoff ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function HandoffStep({ BackButton, prompt, features, onCopied }) {
  const [copied, setCopied] = useState(false);
  const [celebrated, setCelebrated] = useState(false);
  const copyTimer = useRef(null);
  useEffect(() => () => clearTimeout(copyTimer.current), []);

  const modelRec = getModelRecommendation(features);
  const showResearch = hasResearch(features);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(prompt || "");
      setCopied(true);
      track("prompt_copy", { section: "launch", step_index: 1 });
      clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), 3000);
    } catch {
      setCopied("manual");
      clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), 4000);
    }
  }, [prompt]);

  if (!prompt) {
    return (
      <div>
        {BackButton}
        <p style={{ fontSize: 16, color: T.color.textMuted, lineHeight: 1.7 }}>
          It looks like your prompt hasn't been built yet. Go back to the Build
          stage to create it.
        </p>
      </div>
    );
  }

  return (
    <div>
      {BackButton}

      {/* Celebration fires after copy */}
      {celebrated && (
        <div style={{ marginBottom: 16 }}>
          <SectionCelebration heroShapeIndex={3} variant="medium" />
        </div>
      )}

      {/* Prompt display */}
      <div style={{
        padding: "16px 18px",
        background: T.color.bgSubtle,
        border: `1px solid ${T.color.border}`,
        borderTop: `2px solid ${T.color.copper}`,
        borderRadius: "0 0 12px 12px",
        fontFamily: "'Courier New', Courier, monospace",
        fontSize: 13, lineHeight: 1.65, color: T.color.text,
        whiteSpace: "pre-wrap", wordBreak: "break-word",
        maxHeight: 280, overflowY: "auto",
        marginBottom: 14,
      }}>
        {prompt}
      </div>

      {/* Copy button */}
      <button
        onClick={() => {
          handleCopy();
          if (!celebrated) setCelebrated(true);
        }}
        style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          padding: "12px 24px",
          background: copied === true ? T.color.sageSoft : T.color.copper,
          color: copied === true ? T.color.sage : "#fff",
          border: copied === true ? `1px solid ${T.color.sageBorder}` : "none",
          borderRadius: 10, fontFamily: T.font.body,
          fontSize: 15, fontWeight: 500, cursor: "pointer",
          transition: `all 0.3s ${T.ease.smooth}`,
          marginBottom: 28,
        }}
      >
        {copied === "manual"
          ? "Select the text above and copy manually"
          : copied
            ? "Copied!"
            : "Copy to clipboard"}
      </button>

      {/* Instructions */}
      <div style={{ marginBottom: 24 }}>
        <h3 style={{
          fontFamily: T.font.display, fontSize: 22,
          fontWeight: 400, fontStyle: "italic", lineHeight: 1.3,
          margin: "0 0 14px 0", color: T.color.text,
        }}>
          Now, in Claude:
        </h3>
        <ol style={{
          margin: 0, padding: "0 0 0 20px",
          fontSize: 15, color: T.color.textMuted, lineHeight: 1.75,
        }}>
          <li style={{ marginBottom: 6 }}>Open claude.ai in your other tab</li>
          <li style={{ marginBottom: 6 }}>
            Select <strong style={{ color: T.color.text }}>{modelRec}</strong> from the model picker. It's Claude's most capable model.
          </li>
          <li style={{ marginBottom: 6 }}>
            Paste your prompt and hit Enter
            {showResearch && (
              <div style={{
                marginTop: 6, padding: "10px 14px",
                background: T.color.copperSoft,
                border: `1px solid ${T.color.copperGlow}`,
                borderRadius: 8,
                fontSize: 14, color: T.color.textMuted, lineHeight: 1.6,
              }}>
                Turn on Research using the + menu if your task needs current
                information. Research takes 10-15 minutes.
              </div>
            )}
          </li>
          <li>Read what comes back. If it's not quite right, tell Claude what to change. It learns from your feedback.</li>
        </ol>
      </div>

      {/* Safety / data policy */}
      <div style={{
        padding: "16px 18px",
        background: T.color.bgSubtle,
        border: `1px solid ${T.color.border}`,
        borderRadius: 12,
        marginBottom: 8,
      }}>
        <div style={{
          fontSize: 14, fontWeight: 500, color: T.color.text,
          marginBottom: 6,
        }}>
          A note on your data
        </div>
        <p style={{
          margin: 0, fontSize: 14, color: T.color.textMuted, lineHeight: 1.65,
        }}>
          You're on your company's enterprise Claude account. Your conversations
          are private to your organization and your data stays within your
          company's security boundary. Follow your team's guidelines on what
          information is appropriate to share with AI tools.
        </p>
      </div>

      <ContinueButton onClick={onCopied} label="Continue" />
    </div>
  );
}

/* ━━━ Step 3: Transition ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function TransitionStep({ BackButton, onContinue }) {
  return (
    <div style={{ padding: "32px 0", textAlign: "center" }}>
      {BackButton}
      <SectionCelebration heroShapeIndex={3} variant="medium" />
      <h2 style={{
        fontFamily: T.font.display, fontSize: "clamp(24px,5vw,30px)",
        fontWeight: 400, fontStyle: "italic", lineHeight: 1.3,
        margin: "0 0 12px 0", color: T.color.text,
      }}>
        Launched.
      </h2>
      <p style={{
        fontSize: 15, color: T.color.textMuted, lineHeight: 1.65,
        margin: "0 auto 8px", maxWidth: 420,
      }}>
        Go try it. When you're ready, come back for a few more ideas.
      </p>
      <ContinueButton onClick={onContinue} label="Continue" />
    </div>
  );
}
