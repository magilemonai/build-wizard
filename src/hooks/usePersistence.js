import { useRef } from "react";
import { SCREENS } from "../screens.js";

/* ━━━ Persistence (localStorage) ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Save/restore wizard state so users can take breaks and return.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const STORAGE_KEY = "build-wizard-state";

export const defaultProgress = {
  [SCREENS.ICEBREAKER]: 0, [SCREENS.FOUNDATION]: 0,
  [SCREENS.POWERUP]: 0, [SCREENS.SHIP]: 0,
};

export const defaultSteps = {
  [SCREENS.ICEBREAKER]: 0, [SCREENS.FOUNDATION]: 0,
  [SCREENS.POWERUP]: 0, [SCREENS.SHIP]: 0,
};

export function loadSavedState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch { return null; }
}

export function saveState(state) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
}

export function clearSavedState() {
  try { localStorage.removeItem(STORAGE_KEY); } catch {}
}

/** Returns a ref holding saved state (or null). Read once at mount. */
export function useSavedState() {
  return useRef(loadSavedState());
}
