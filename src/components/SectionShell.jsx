import { useState, useCallback } from "react";
import PageTransition from "./PageTransition.jsx";
import BackButton from "./BackButton.jsx";

/* ━━━ SectionShell ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Reusable navigation + transition wrapper for all build sections.
   Each section provides a step sequence and a render function.
   Optional sectionShapeIndex adds a step progress indicator using
   the section's owned shape.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export default function SectionShell({ steps, renderStep, onBack, onProgress, sectionShapeIndex, initialStep, onStepChange }) {
  const [stepIndex, setStepIndex] = useState(initialStep || 0);
  const [direction, setDirection] = useState(1);

  const currentStep = steps[stepIndex];

  const advance = useCallback(() => {
    setDirection(1);
    setStepIndex((i) => {
      const next = i + 1;
      onProgress?.(next / steps.length);
      onStepChange?.(next);
      return next;
    });
  }, [steps.length, onProgress, onStepChange]);

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
