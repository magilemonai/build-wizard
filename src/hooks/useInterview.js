import { useState, useCallback, useMemo, useEffect } from "react";
import getInterviewSteps from "../data/interviewSteps.js";
import { SCREENS } from "../screens.js";

/* ━━━ Interview State Hook ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Manages the adaptive interview flow: answers, navigation,
   stagger animation state, and screen transitions.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export default function useInterview(saved, setScreen) {
  const [stepIndex, setStepIndex] = useState(() => saved?.stepIndex || 0);
  const [answers, setAnswers] = useState(() => saved?.answers || {});
  const [currentValue, setCurrentValue] = useState(null);
  const [direction, setDirection] = useState(1);
  const [staggerReady, setStaggerReady] = useState(true);
  const [showFirstLabel, setShowFirstLabel] = useState(() => !saved);

  const steps = useMemo(() => getInterviewSteps(answers), [answers]);
  const currentStep = steps[stepIndex] || null;
  const totalSteps = steps.length;

  useEffect(() => {
    if (stepIndex > 0) setShowFirstLabel(false);
  }, [stepIndex]);

  // Pre-fill value when revisiting a previously answered question
  useEffect(() => {
    if (currentStep && answers[currentStep.id] !== undefined && currentValue === null) {
      setCurrentValue(answers[currentStep.id]);
    }
  }, [stepIndex, currentStep, answers]);

  const navigateForward = useCallback(() => {
    if (!currentStep) return;
    const updated = { ...answers, [currentStep.id]: currentValue };
    setAnswers(updated);
    setCurrentValue(null);
    setStaggerReady(false);
    setDirection(1);
    if (currentStep.id === "setup") {
      setScreen(SCREENS.PATHCARD);
    } else {
      setStepIndex((i) => i + 1);
    }
  }, [currentStep, currentValue, answers, setScreen]);

  const navigateBack = useCallback(() => {
    if (stepIndex <= 0) return;
    setCurrentValue(null);
    setStaggerReady(false);
    setDirection(-1);
    setStepIndex((i) => i - 1);
  }, [stepIndex]);

  const handleTransitionEntered = useCallback(() => {
    setStaggerReady(true);
  }, []);

  const resetInterview = useCallback(() => {
    setStepIndex(0);
    setAnswers({});
    setCurrentValue(null);
    setDirection(1);
    setStaggerReady(true);
    setShowFirstLabel(true);
  }, []);

  return {
    stepIndex, answers, currentValue, direction, staggerReady,
    showFirstLabel, currentStep, totalSteps,
    setCurrentValue, navigateForward, navigateBack,
    handleTransitionEntered, resetInterview,
  };
}
