import { useState, useCallback } from "react";
import { getTemplateById } from "../data/templates.js";

/* ━━━ Interview + Build State Hook ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Owns everything Stage 3 (Interview) and Stage 4 (Build) produce:

   Interview:
     - problem, bucket, selectedTemplate, scopeAnswer
     - coachResponse, isCoachLoading, coachError
     - sessionId

   Build:
     - buildAnswers: { role, context, task, format, constraints }
     - assembledPrompt: final joined prompt text (editable)

   Downstream stages (Launch) read assembledPrompt.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function generateSessionId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `s-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

const EMPTY_BUILD = { role: "", context: "", task: "", format: "", constraints: "" };

export default function useInterview(saved) {
  // ── Interview state ──
  const [problem, setProblem] = useState(() => saved?.interview?.problem || "");
  const [bucket, setBucket] = useState(() => saved?.interview?.bucket || null);
  const [selectedTemplate, setSelectedTemplate] = useState(() => {
    const id = saved?.interview?.selectedTemplateId;
    return id ? (getTemplateById(id) || null) : null;
  });
  const [scopeAnswer, setScopeAnswer] = useState(() => saved?.interview?.scopeAnswer || null);
  const [coachResponse, setCoachResponse] = useState(null);
  const [isCoachLoading, setIsCoachLoading] = useState(false);
  const [coachError, setCoachError] = useState(false);
  const [sessionId, setSessionId] = useState(() => saved?.sessionId || null);

  // ── Build state ──
  const [buildAnswers, setBuildAnswers] = useState(
    () => saved?.interview?.buildAnswers || { ...EMPTY_BUILD },
  );
  const [assembledPrompt, setAssembledPrompt] = useState(
    () => saved?.interview?.assembledPrompt || "",
  );

  const ensureSessionId = useCallback(() => {
    if (sessionId) return sessionId;
    const fresh = generateSessionId();
    setSessionId(fresh);
    return fresh;
  }, [sessionId]);

  const resetInterview = useCallback(() => {
    setProblem("");
    setBucket(null);
    setSelectedTemplate(null);
    setScopeAnswer(null);
    setCoachResponse(null);
    setIsCoachLoading(false);
    setCoachError(false);
    setSessionId(null);
    setBuildAnswers({ ...EMPTY_BUILD });
    setAssembledPrompt("");
  }, []);

  /** Serializable snapshot for persistence. */
  const getInterviewState = useCallback(() => ({
    problem,
    bucket,
    selectedTemplateId: selectedTemplate?.id || null,
    scopeAnswer,
    buildAnswers,
    assembledPrompt,
  }), [problem, bucket, selectedTemplate, scopeAnswer, buildAnswers, assembledPrompt]);

  return {
    // Interview
    problem, setProblem,
    bucket, setBucket,
    selectedTemplate, setSelectedTemplate,
    scopeAnswer, setScopeAnswer,
    coachResponse, setCoachResponse,
    isCoachLoading, setIsCoachLoading,
    coachError, setCoachError,
    sessionId, ensureSessionId,
    // Build
    buildAnswers, setBuildAnswers,
    assembledPrompt, setAssembledPrompt,
    // Persistence + reset
    getInterviewState,
    resetInterview,
  };
}
