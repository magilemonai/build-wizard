import { useState, useCallback, useMemo, useRef } from "react";
import { SCREENS } from "../screens.js";
import { defaultProgress, defaultSteps } from "./usePersistence.js";

/* ━━━ Section Progress Hook ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Manages per-section progress bars, step positions, visited set,
   and section navigation (with transition skip on re-entry).
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export default function useProgress(saved, setScreen) {
  const [sectionProgress, setSectionProgress] = useState(
    () => saved?.sectionProgress || { ...defaultProgress }
  );
  const [sectionSteps, setSectionSteps] = useState(
    () => saved?.sectionSteps || { ...defaultSteps }
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

  // Stable per-section updaters (memoized to prevent re-renders)
  const progressUpdaters = useMemo(() => {
    const sections = [SCREENS.ICEBREAKER, SCREENS.FOUNDATION, SCREENS.POWERUP, SCREENS.SHIP];
    const result = {};
    for (const s of sections) {
      result[s] = (value) => setSectionProgress((prev) => ({ ...prev, [s]: value }));
    }
    return result;
  }, []);

  const stepUpdaters = useMemo(() => {
    const sections = [SCREENS.ICEBREAKER, SCREENS.FOUNDATION, SCREENS.POWERUP, SCREENS.SHIP];
    const result = {};
    for (const s of sections) {
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
