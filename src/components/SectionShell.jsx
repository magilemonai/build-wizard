import { useState, useCallback, useRef, useEffect } from "react";
import PageTransition from "./PageTransition.jsx";
import BackButton from "./BackButton.jsx";
import { track } from "../services/analytics.js";

/* ━━━ SectionShell ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Reusable navigation + transition wrapper for all build sections.
   Each section provides a step sequence and a render function.
   Optional sectionShapeIndex adds a step progress indicator using
   the section's owned shape.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export default function SectionShell({ steps, renderStep, onBack, onProgress, sectionShapeIndex, initialStep, onStepChange, sectionKey }) {
  const [stepIndex, setStepIndex] = useState(initialStep || 0);
  const [direction, setDirection] = useState(1);
  // Per-step entry time for analytics (ref — not state, no re-render needed).
  const stepEnteredAt = useRef(Date.now());

  const currentStep = steps[stepIndex];

  // Reset the step timer whenever the current step changes (advance or back).
  useEffect(() => {
    stepEnteredAt.current = Date.now();
  }, [stepIndex]);

  const advance = useCallback(() => {
    const elapsed = Date.now() - stepEnteredAt.current;
    if (sectionKey) {
      track("step_complete", { section: sectionKey, step_index: stepIndex, time_on_step_ms: elapsed });
    }
    setDirection(1);
    setStepIndex((i) => {
      const next = i + 1;
      onProgress?.(next / steps.length);
      onStepChange?.(next);
      return next;
    });
  }, [steps.length, onProgress, onStepChange, sectionKey, stepIndex]);

  const goBack = useCallback(() => {
    if (stepIndex <= 0) {
      onBack?.();
      return;
    }
    setDirection(-1);
    setStepIndex((i) => {
      const next = i - 1;
      onProgress?.(next / steps.length);
      onStepChange?.(next);
      return next;
    });
  }, [stepIndex, onBack, steps.length, onProgress, onStepChange]);

  const content = renderStep({
    step: currentStep,
    stepIndex,
    advance,
    goBack,
    BackButton: <BackButton onClick={goBack} />,
  });

  return (
    <div>
      <PageTransition
        transitionKey={stepIndex}
        type="page"
        direction={direction}
      >
        {content}
      </PageTransition>
    </div>
  );
}
