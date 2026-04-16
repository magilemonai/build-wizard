import T from "../tokens.js";
import SectionShell from "../components/SectionShell.jsx";
import ContinueButton from "../components/ContinueButton.jsx";
import SectionCelebration from "../components/SectionCelebration.jsx";

/* ━━━ Stage 2: Cockpit (stub) ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Claude feature orientation. Placeholder until the feature cards
   are built.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export default function Cockpit({ onComplete, onBack, onProgress, initialStep, onStepChange }) {
  const steps = [{ type: "intro" }, { type: "anchor" }];

  return (
    <SectionShell
      sectionKey="cockpit"
      steps={steps}
      onBack={onBack}
      onProgress={onProgress}
      initialStep={initialStep}
      onStepChange={onStepChange}
      renderStep={({ step, advance, BackButton }) => {
        if (step.type === "intro") {
          return (
            <div>
              {BackButton}
              <h2 style={{
                fontFamily: T.font.display, fontSize: "clamp(26px,5vw,34px)",
                fontWeight: 400, fontStyle: "italic", lineHeight: 1.3,
                margin: "0 0 16px 0", color: T.color.text,
              }}>
                The Cockpit.
              </h2>
              <p style={{ fontSize: 16, color: T.color.textMuted, lineHeight: 1.7, margin: "0 0 24px 0" }}>
                Claude features go here: Models, Extended Thinking, Research,
                Projects, Artifacts, Memory. Compact vertical stack.
              </p>
              <ContinueButton onClick={advance} label="Continue" />
            </div>
          );
        }
        if (step.type === "anchor") {
          return (
            <div style={{ padding: "40px 0", textAlign: "center" }}>
              {BackButton}
              <SectionCelebration heroShapeIndex={0} intensity={1} />
              <h2 style={{
                fontFamily: T.font.display, fontSize: "clamp(24px,5vw,30px)",
                fontWeight: 400, fontStyle: "italic", margin: "0 0 12px 0",
              }}>
                You've seen the cockpit.
              </h2>
              <ContinueButton onClick={onComplete} label="Continue" />
            </div>
          );
        }
        return null;
      }}
    />
  );
}
