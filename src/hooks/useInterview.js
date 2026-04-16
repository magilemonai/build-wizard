import { useState, useCallback } from "react";
import { getTemplateById } from "../data/templates.js";

/* ━━━ Interview State Hook ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Owns everything Stage 3 (Interview) produces:
     - problem:          user's free-text work problem
     - bucket:           matched bucket ("information"|"production"|"thinking")
     - selectedTemplate: full template object (or null)
     - scopeAnswer:      response to the template's scoping question (or null)
     - coachResponse:    AI coach response (null until wired)
     - isCoachLoading:   whether an AI call is in flight
     - coachError:       whether the AI call failed
     - sessionId:        lazy API session id for the coach call

   Downstream stages (Build, Launch) read selectedTemplate and
   scopeAnswer to drive prompt construction.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function generateSessionId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `s-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export default function useInterview(saved) {
  const [problem, setProblem] = useState(() => saved?.interview?.problem || "");
  const [bucket, setBucket] = useState(() => saved?.interview?.bucket || null);
  const [selectedTemplate, setSelectedTemplate] = useState(() => {
    // Rehydrate from saved id to full object
    const id = saved?.interview?.selectedTemplateId;
    return id ? (getTemplateById(id) || null) : null;
  });
  const [scopeAnswer, setScopeAnswer] = useState(() => saved?.interview?.scopeAnswer || null);
  const [coachResponse, setCoachResponse] = useState(null);
  const [isCoachLoading, setIsCoachLoading] = useState(false);
  const [coachError, setCoachError] = useState(false);
  const [sessionId, setSessionId] = useState(() => saved?.sessionId || null);

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
  }, []);

  /** Serializable snapshot for persistence. We store the template id,
      not the full object, so templates.js remains the source of truth. */
  const getInterviewState = useCallback(() => ({
    problem,
    bucket,
    selectedTemplateId: selectedTemplate?.id || null,
    scopeAnswer,
  }), [problem, bucket, selectedTemplate, scopeAnswer]);

  return {
    // State
    problem, setProblem,
    bucket, setBucket,
    selectedTemplate, setSelectedTemplate,
    scopeAnswer, setScopeAnswer,
    coachResponse, setCoachResponse,
    isCoachLoading, setIsCoachLoading,
    coachError, setCoachError,
    sessionId, ensureSessionId,
    // Persistence helper
    getInterviewState,
    // Reset
    resetInterview,
  };
}
