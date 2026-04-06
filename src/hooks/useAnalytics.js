import { useCallback, useRef } from "react";

/* ━━━ Analytics Hook ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Lightweight event tracking. Logs to console in dev, stores events
   in localStorage for later retrieval. Ready for a real analytics
   backend when the time comes.

   Events tracked:
   - section_start / section_complete
   - exercise_outcome (worked / snag / skip)
   - interview_complete (with answers summary)
   - session_resume (returning user)
   - quick_path_activated
   - total_duration
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const ANALYTICS_KEY = "build-wizard-analytics";

function getStoredEvents() {
  try {
    const raw = localStorage.getItem(ANALYTICS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function storeEvent(event) {
  try {
    const events = getStoredEvents();
    events.push(event);
    localStorage.setItem(ANALYTICS_KEY, JSON.stringify(events));
  } catch {}
}

export default function useAnalytics() {
  const sessionStart = useRef(Date.now());

  const track = useCallback((name, data = {}) => {
    const event = {
      name,
      timestamp: new Date().toISOString(),
      sessionDuration: Math.round((Date.now() - sessionStart.current) / 1000),
      ...data,
    };

    // Dev logging
    if (import.meta.env.DEV) {
      console.log("[Analytics]", name, data);
    }

    storeEvent(event);
  }, []);

  const trackSectionStart = useCallback((section) => {
    track("section_start", { section });
  }, [track]);

  const trackSectionComplete = useCallback((section) => {
    track("section_complete", { section });
  }, [track]);

  const trackExerciseOutcome = useCallback((section, exerciseId, outcome) => {
    track("exercise_outcome", { section, exerciseId, outcome });
  }, [track]);

  const trackInterviewComplete = useCallback((answers) => {
    track("interview_complete", {
      fork: answers.fork,
      experience: answers.experience,
      codeFeel: answers.code_feeling,
      time: answers.time,
      hasProjectIdea: !!answers.project_idea?.trim(),
    });
  }, [track]);

  const trackResume = useCallback((screen) => {
    track("session_resume", { resumeScreen: screen });
  }, [track]);

  const trackQuickPath = useCallback(() => {
    track("quick_path_activated");
  }, [track]);

  /** Retrieve all stored events (for future export/upload) */
  const getEvents = useCallback(() => getStoredEvents(), []);

  return {
    track,
    trackSectionStart,
    trackSectionComplete,
    trackExerciseOutcome,
    trackInterviewComplete,
    trackResume,
    trackQuickPath,
    getEvents,
  };
}
