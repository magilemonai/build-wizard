import { useState, useCallback, useMemo, useEffect } from "react";
import getInterviewSteps from "../data/interviewSteps.js";
import projectTemplates, { derivePathCard, matchProject } from "../data/projectTemplates.js";
import { SCREENS } from "../screens.js";
import { track } from "../services/analytics.js";

/* ━━━ Interview State Hook ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Owns everything the interview produces: adaptive question flow,
   answers, navigation/stagger state, and the derived values that
   downstream sections read (path type, quick-path flag, path card,
   governance notice). App.jsx only handles screen routing.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/** Create a unique session id. Uses crypto.randomUUID when available,
    falls back to a timestamp-plus-random string otherwise. */
function generateSessionId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `s-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export default function useInterview(saved, setScreen) {
  const [stepIndex, setStepIndex] = useState(() => saved?.stepIndex || 0);
  const [answers, setAnswers] = useState(() => saved?.answers || {});
  const [currentValue, setCurrentValue] = useState(null);
  const [direction, setDirection] = useState(1);
  const [staggerReady, setStaggerReady] = useState(true);
  const [showFirstLabel, setShowFirstLabel] = useState(() => !saved);
  // sessionId is generated lazily on first API call and persisted so it
  // survives page refresh. Null until first needed.
  const [sessionId, setSessionId] = useState(() => saved?.sessionId || null);

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

    // interview_answer: structured choices only. Free-text fields
    // (textarea) record the question_id but omit the value.
    const isStructured = currentStep.type === "choice";
    track("interview_answer", {
      question_id: currentStep.id,
      ...(isStructured ? { answer_value: currentValue } : {}),
    });

    setCurrentValue(null);
    setStaggerReady(false);
    setDirection(1);
    if (currentStep.id === "setup") {
      // Setup is the last question — we now have everything derivePathCard
      // needs. Emit template_match based on the full answer set.
      const type = updated.fork === "work" ? "work" : "personal";
      const matched = matchProject(updated.project_idea, type);
      const fallback = projectTemplates.fallback?.[type] || projectTemplates.fallback?.personal;
      const wasFallback = matched === fallback;
      const score = !wasFallback && matched?.keywords
        ? matched.keywords.filter((kw) => (updated.project_idea || "").toLowerCase().includes(kw)).length
        : 0;
      track("template_match", {
        template_id: wasFallback ? `fallback_${type}` : (matched?.name || null),
        match_score: score,
        was_fallback: wasFallback,
      });
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
    setSessionId(null);
  }, []);

  /** Return the existing sessionId, or generate+persist a new one on first call. */
  const ensureSessionId = useCallback(() => {
    if (sessionId) return sessionId;
    const fresh = generateSessionId();
    setSessionId(fresh);
    return fresh;
  }, [sessionId]);

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
    showFirstLabel, currentStep, totalSteps, sessionId,
    // Actions
    setCurrentValue, navigateForward, navigateBack,
    handleTransitionEntered, resetInterview, ensureSessionId,
    // Derived
    isWork, isQuickPath, pathCard, forkNotice,
  };
}
