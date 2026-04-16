import { useState, useCallback } from "react";
import T from "../tokens.js";
import PageTransition from "../components/PageTransition.jsx";
import BackButton from "../components/BackButton.jsx";
import ContinueButton from "../components/ContinueButton.jsx";
import SectionCelebration from "../components/SectionCelebration.jsx";
import { track } from "../services/analytics.js";

/* ━━━ Stage 4: Build Your Prompt (stub) ━━━━━━━━━━━━━━━━━━━━━━━━
   Does NOT use SectionShell because the final layout is a
   horizontal split (questions top, prompt preview bottom) that
   needs to persist across sub-step transitions. Owns its own
   sub-step state for now.

   Sub-steps: Role → Context → Task → Format → Constraints → Review
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const SUB_STEPS = ["role", "context", "task", "format", "constraints", "review"];

export default function Build({ onComplete, onBack, onProgress, initialStep, onStepChange }) {
  const [stepIndex, setStepIndex] = useState(initialStep || 0);
  const [direction, setDirection] = useState(1);

  const isReview = stepIndex >= SUB_STEPS.length - 1;

  const advance = useCallback(() => {
    track("prompt_step_complete", { step: SUB_STEPS[stepIndex], step_index: stepIndex });
    setDirection(1);
    setStepIndex((i) => {
      const next = i + 1;
      if (next >= SUB_STEPS.length) {
        track("prompt_assembled", {});
        onComplete?.();
        return i;
      }
      onProgress?.(next / SUB_STEPS.length);
      onStepChange?.(next);
      return next;
    });
  }, [stepIndex, onComplete, onProgress, onStepChange]);

  const goBack = useCallback(() => {
    if (stepIndex <= 0) { onBack?.(); return; }
    setDirection(-1);
    setStepIndex((i) => {
      const next = i - 1;
      onProgress?.(next / SUB_STEPS.length);
      onStepChange?.(next);
      return next;
    });
  }, [stepIndex, onBack, onProgress, onStepChange]);

  return (
    <div>
      <PageTransition transitionKey={stepIndex} type="page" direction={direction}>
        <div>
          <BackButton onClick={goBack} />
          {isReview ? (
            <div style={{ padding: "40px 0", textAlign: "center" }}>
              <SectionCelebration heroShapeIndex={2} intensity={3} />
              <h2 style={{
                fontFamily: T.font.display, fontSize: "clamp(26px,5vw,34px)",
                fontWeight: 400, fontStyle: "italic", margin: "0 0 12px 0",
              }}>
                Your prompt is ready.
              </h2>
              <ContinueButton onClick={advance} label="Continue" />
            </div>
          ) : (
            <div>
              <h2 style={{
                fontFamily: T.font.display, fontSize: "clamp(26px,5vw,34px)",
                fontWeight: 400, fontStyle: "italic", lineHeight: 1.3,
                margin: "0 0 16px 0", color: T.color.text,
              }}>
                Step {stepIndex + 1} of {SUB_STEPS.length - 1}: {SUB_STEPS[stepIndex]}
              </h2>
              <p style={{ fontSize: 16, color: T.color.textMuted, lineHeight: 1.7, margin: "0 0 16px 0" }}>
                Prompt builder goes here. Questions on top, prompt preview
                growing on the bottom.
              </p>
              <div style={{
                padding: "16px 20px",
                background: T.color.bgSubtle,
                border: `1px dashed ${T.color.border}`,
                borderRadius: 12,
                fontFamily: "'Courier New', Courier, monospace",
                fontSize: 14, color: T.color.textLight, lineHeight: 1.6,
                minHeight: 120, marginBottom: 24,
              }}>
                [prompt preview will assemble here]
              </div>
              <ContinueButton onClick={advance} label="Continue" />
            </div>
          )}
        </div>
      </PageTransition>
    </div>
  );
}
