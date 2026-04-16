import T from "../tokens.js";
import SectionShell from "../components/SectionShell.jsx";
import ContinueButton from "../components/ContinueButton.jsx";
import SectionCelebration from "../components/SectionCelebration.jsx";

/* ━━━ Stage 6: Keep Going (stub) ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   5–7 seed ideas for what else Claude can do. Climax celebration.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export default function KeepGoing({ onComplete, onBack, onProgress, initialStep, onStepChange, onStartOver }) {
  const steps = [{ type: "seeds" }, { type: "anchor" }];

  return (
    <SectionShell
      sectionKey="keep_going"
      steps={steps}
      onBack={onBack}
      onProgress={onProgress}
      initialStep={initialStep}
      onStepChange={onStepChange}
      renderStep={({ step, advance, BackButton }) => {
        if (step.type === "seeds") {
          return (
            <div>
              {BackButton}
              <h2 style={{
                fontFamily: T.font.display, fontSize: "clamp(26px,5vw,34px)",
                fontWeight: 400, fontStyle: "italic", lineHeight: 1.3,
                margin: "0 0 16px 0", color: T.color.text,
              }}>
                Keep going.
              </h2>
              <p style={{ fontSize: 16, color: T.color.textMuted, lineHeight: 1.7, margin: "0 0 24px 0" }}>
                Five to seven seed ideas for what else Claude can do. Send-off
                goes here.
              </p>
              <ContinueButton onClick={advance} label="Continue" />
            </div>
          );
        }
        if (step.type === "anchor") {
          return (
            <div style={{ padding: "40px 0", textAlign: "center" }}>
              {BackButton}
              <SectionCelebration heroShapeIndex={4} intensity={3} />
              <h2 style={{
                fontFamily: T.font.display, fontSize: "clamp(28px,6vw,38px)",
                fontWeight: 400, fontStyle: "italic", margin: "0 0 12px 0",
              }}>
                You're off.
              </h2>
              <p style={{ fontSize: 16, color: T.color.textMuted, lineHeight: 1.7, margin: "0 auto 24px", maxWidth: 460 }}>
                You built a prompt that solves a real problem. Go use it.
              </p>
              {onStartOver && (
                <button
                  onClick={onStartOver}
                  style={{
                    background: "none", border: "none", cursor: "pointer",
                    color: T.color.textLight, fontFamily: T.font.body, fontSize: 14,
                    textDecoration: "underline", textUnderlineOffset: 3,
                  }}
                >
                  Start over
                </button>
              )}
            </div>
          );
        }
        return null;
      }}
    />
  );
}
