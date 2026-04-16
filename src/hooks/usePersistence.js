import { useRef } from "react";
import { SCREENS, STAGES } from "../screens.js";

/* ━━━ Persistence (localStorage) ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Save/restore wizard state so users can take breaks and return.
   Schema v3: six-stage Launcher.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const STORAGE_KEY = "build-wizard-state";
const SCHEMA_VERSION = 3; // Bump when saved state shape changes

// Stages that have progress bars (everything after Orientation).
export const PROGRESS_STAGES = STAGES.filter((s) => s !== SCREENS.ORIENTATION);

export const defaultProgress = Object.fromEntries(PROGRESS_STAGES.map((s) => [s, 0]));
export const defaultSteps = Object.fromEntries(PROGRESS_STAGES.map((s) => [s, 0]));

export function loadSavedState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    // Clear if schema version doesn't match (prevents corrupted state)
    if (parsed._v !== SCHEMA_VERSION) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return parsed;
  } catch {
    // Also clear on parse errors so a bad write doesn't stick.
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
    return null;
  }
}

export function saveState(state) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, _v: SCHEMA_VERSION })); } catch {}
}

export function clearSavedState() {
  try { localStorage.removeItem(STORAGE_KEY); } catch {}
}

/** Returns a ref holding saved state (or null). Read once at mount. */
export function useSavedState() {
  return useRef(loadSavedState());
}
