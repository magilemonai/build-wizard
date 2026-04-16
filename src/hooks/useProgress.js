import { useState, useCallback, useMemo, useRef } from "react";
import { defaultProgress, defaultSteps, PROGRESS_STAGES } from "./usePersistence.js";

/* ━━━ Section Progress Hook ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Manages per-stage progress bars, step positions, visited set,
   and stage navigation (with transition skip on re-entry).
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export default function useProgress(saved, setScreen) {
  const [sectionProgress, setSectionProgress] = useState(
    () => ({ ...defaultProgress, ...(saved?.sectionProgress || {}) })
  );
  const [sectionSteps, setSectionSteps] = useState(
    () => ({ ...defaultSteps, ...(saved?.sectionSteps || {}) })
  );
  const visited = useRef(new Set(saved?.visited || []));

  // Navigation: skip transition on re-entry
  const goToSection = useCallback((section) => {
    if (visited.current.has(section)) {
      setScreen(section);
    } else {
      setScreen(`${section}-transition`);
    }
  }, [setScreen]);

  const markVisited = useCallback((section) => {
    visited.current.add(section);
  }, []);

  // Stable per-stage updaters (memoized to prevent re-renders)
  const progressUpdaters = useMemo(() => {
    const result = {};
    for (const s of PROGRESS_STAGES) {
      result[s] = (value) => setSectionProgress((prev) => ({ ...prev, [s]: value }));
    }
    return result;
  }, []);

  const stepUpdaters = useMemo(() => {
    const result = {};
    for (const s of PROGRESS_STAGES) {
      result[s] = (value) => setSectionSteps((prev) => ({ ...prev, [s]: value }));
    }
    return result;
  }, []);

  const resetProgress = useCallback(() => {
    setSectionProgress({ ...defaultProgress });
    setSectionSteps({ ...defaultSteps });
    visited.current.clear();
  }, []);

  return {
    sectionProgress, sectionSteps, visited,
    goToSection, markVisited,
    progressUpdaters, stepUpdaters,
    resetProgress,
  };
}
