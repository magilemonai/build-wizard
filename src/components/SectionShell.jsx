import { useState, useCallback } from "react";
import PageTransition from "./PageTransition.jsx";
import BackButton from "./BackButton.jsx";
import T from "../tokens.js";
import OrganicShape from "./OrganicShape.jsx";

/* ━━━ SectionShell ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Reusable navigation + transition wrapper for all build sections.
   Each section provides a step sequence and a render function.
   Optional sectionShapeIndex adds a step progress indicator using
   the section's owned shape.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export default function SectionShell({ steps, renderStep, onBack, onProgress, sectionShapeIndex }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const currentStep = steps[stepIndex];

  const advance = useCallback(() => {
    setDirection(1);
    setStepIndex((i) => {
      const next = i + 1;
      onProgress?.(next / steps.length);
      return next;
    });
  }, [steps.length, onProgress]);

  const goBack = useCallback(() => {
    if (stepIndex <= 0) {
      onBack?.();
      return;
    }
    setDirection(-1);
    setStepIndex((i) => {
      const next = i - 1;
      onProgress?.(next / steps.length);
      return next;
    });
  }, [stepIndex, onBack, steps.length, onProgress]);

  const content = renderStep({
    step: currentStep,
    stepIndex,
    advance,
    goBack,
    BackButton: <BackButton onClick={goBack} />,
  });

  return (
    <div>
      {/* Step progress indicator */}
      {sectionShapeIndex != null && steps.length > 1 && (
        <div style={{
          display: "flex", alignItems: "center", gap: 6,
          marginBottom: 16,
        }}>
          {steps.map((_, i) => (
            <div key={i} style={{
              transition: `all 0.4s ${T.ease.smooth}`,
              opacity: i <= stepIndex ? 1 : 0.3,
              transform: i === stepIndex ? "scale(1.3)" : "scale(1)",
              lineHeight: 0,
            }}>
              <OrganicShape
                shapeIndex={sectionShapeIndex}
                size={i === stepIndex ? 10 : 7}
                color={i < stepIndex ? T.color.sage : i === stepIndex ? T.color.copper : T.color.border}
              />
            </div>
          ))}
          <span style={{
            fontSize: 12, color: T.color.textLight, fontFamily: T.font.body,
            marginLeft: 4,
          }}>
            {stepIndex + 1} of {steps.length}
          </span>
        </div>
      )}
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
