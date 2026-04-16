import { useState, useCallback } from "react";

/* ━━━ Interview State Hook ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Stub for the Launcher rebuild. Stage 3 (Interview) will own its
   own input state; for now this hook exposes only what other code
   genuinely needs:
     - a lazy API sessionId for the coach call
     - a bag of answers (problem, bucket, template) we can grow into
     - a reset that clears both
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function generateSessionId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `s-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export default function useInterview(saved) {
  const [answers, setAnswers] = useState(() => saved?.answers || {});
  const [sessionId, setSessionId] = useState(() => saved?.sessionId || null);

  const ensureSessionId = useCallback(() => {
    if (sessionId) return sessionId;
    const fresh = generateSessionId();
    setSessionId(fresh);
    return fresh;
  }, [sessionId]);

  const resetInterview = useCallback(() => {
    setAnswers({});
    setSessionId(null);
  }, []);

  return {
    answers, setAnswers, sessionId,
    ensureSessionId, resetInterview,
  };
}
