/**
 * Shared, session-scoped cache for isApiAvailable().
 *
 * Multiple components (ProjectCoachCard, LivePromptPanel) need to know
 * whether the Worker is reachable. We run the check at most once per
 * page load and return the same Promise to all callers.
 *
 * `api.js` is off-limits per task scope, so this cache lives beside it
 * instead of inside it.
 */

import { isApiAvailable as rawIsApiAvailable } from "./api.js";

let cachedPromise = null;

/**
 * Returns a Promise<boolean>. First caller triggers the network check;
 * every subsequent caller gets the same resolved value.
 */
export function getApiAvailability() {
  if (!cachedPromise) {
    cachedPromise = rawIsApiAvailable().catch(() => false);
  }
  return cachedPromise;
}

/** Test hook: reset the cache so a follow-up getApiAvailability() re-checks. */
export function __resetApiAvailability() {
  cachedPromise = null;
}
