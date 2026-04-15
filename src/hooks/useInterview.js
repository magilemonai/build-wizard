import { useState, useCallback, useMemo, useEffect } from "react";
import getInterviewSteps from "../data/interviewSteps.js";
import { derivePathCard } from "../data/projectTemplates.js";
import { SCREENS } from "../screens.js";

/* ━━━ Interview State Hook ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Owns everything the interview produces: adaptive question flow,
   answers, navigation/stagger state, and the derived values that
   downstream sections read (path type, quick-path flag, path card,
   governance notice). App.jsx only handles screen routing.
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

  // ── Derived values ──────────────────────────────────────────────
  // Work/personal path tracking
  const isWork = answers.fork === "work";

  // Quick Path flag: 30-minute users skip IceBreaker exercises
  const isQuickPath = answers.time === "30min";

  // Project template match + personalized path card
  // (includes the experience-level label via derivePathCard's levelMap)
  const pathCard = useMemo(() => derivePathCard(answers), [answers]);

  // Governance notice for work-fork acknowledgment (shown on "fork" step
  // once user has selected "work"). Kept here so App.jsx stays routing-only.
  const forkNotice = currentStep?.id === "fork" && currentValue === "work"
    ? {
        title: "Quick heads-up",
        body: "Some workplaces have rules about AI tools and data. If you're not sure about yours, check with your manager or IT team before sharing real work data. We'll cover this more later.",
      }
    : null;

  return {
    // Raw state
    stepIndex, answers, currentValue, direction, staggerReady,
    showFirstLabel, currentStep, totalSteps,
    // Actions
    setCurrentValue, navigateForward, navigateBack,
    handleTransitionEntered, resetInterview,
    // Derived
    isWork, isQuickPath, pathCard, forkNotice,
  };
}
