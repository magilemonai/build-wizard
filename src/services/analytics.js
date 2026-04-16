/**
 * Build Wizard — Analytics
 *
 * In-memory event sink. Nothing is sent over the network; on
 * `beforeunload` the accumulated events are dumped to console as a
 * single `[Build Wizard Analytics]` log with a summary header.
 *
 * Event shape:
 *   {
 *     seq:         monotonically increasing integer,
 *     ts:          ISO-8601 timestamp (when track() was called),
 *     session_id:  analytics-only session id (UUID, separate from the
 *                  API sessionId used for the Worker),
 *     event:       event name,
 *     properties:  arbitrary, shallow JSON-safe object,
 *   }
 *
 * This shape is deliberately PostHog/Mixpanel-friendly — both accept
 * { event, properties } as the primary payload. Dropping this into a
 * real backend later is a matter of replacing the beforeunload dump
 * with a batched POST.
 *
 * Every public entry point is wrapped in try/catch. Analytics must
 * never take the wizard down.
 */

const events = [];
let sequence = 0;
let analyticsSessionId = null;
let firstEventMs = null;
let lastEventMs = null;
let furthestScreen = null;

/* Heuristic screen ordering so we can report "furthest reached" in the
   session summary without relying on the caller to know the order.
   Six-stage Launcher taxonomy. */
const SCREEN_ORDER = [
  "orientation",
  "cockpit-transition",
  "cockpit",
  "interview-transition",
  "interview",
  "build-transition",
  "build",
  "launch-transition",
  "launch",
  "keep_going-transition",
  "keep_going",
];

/* Known Launcher events (for reference — track() accepts any name):
     session_start, screen_view, session_end           (lifecycle)
     step_complete                                      (SectionShell)
     prompt_copy, outcome_choice                        (PromptCard)
     safety_complete                                    (SafetyInterstitial)
     api_call                                           (services/api.js)
     bucket_match, coach_scope_warning                  (Stage 3)
     prompt_step_complete, prompt_assembled             (Stage 4)
   Old events removed in the rebuild: template_match,
   prompt_live_try, interview_answer, artifact_download. */

function screenRank(name) {
  if (!name) return -1;
  const idx = SCREEN_ORDER.indexOf(name);
  return idx === -1 ? -1 : idx;
}

function ensureSessionId() {
  if (analyticsSessionId) return analyticsSessionId;
  try {
    analyticsSessionId = (typeof crypto !== "undefined" && crypto.randomUUID)
      ? crypto.randomUUID()
      : `a-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  } catch {
    analyticsSessionId = `a-${Date.now()}`;
  }
  return analyticsSessionId;
}

/**
 * Record an event. Silent on any internal failure.
 * @param {string} name
 * @param {object} [properties]
 */
export function track(name, properties = {}) {
  try {
    if (typeof name !== "string" || !name) return;
    const nowMs = Date.now();
    if (firstEventMs === null) firstEventMs = nowMs;
    lastEventMs = nowMs;
    const sid = ensureSessionId();
    const safeProps = (properties && typeof properties === "object") ? properties : {};

    events.push({
      seq: sequence++,
      ts: new Date(nowMs).toISOString(),
      session_id: sid,
      event: name,
      properties: safeProps,
    });

    // Real-time per-event log for debugging. console.debug is filtered
    // out of DevTools' default "All levels" view unless the user opts
    // in, so this doesn't clutter the main console.
    // eslint-disable-next-line no-console
    console.debug("[Build Wizard Analytics]", name, safeProps);

    // Track furthest screen reached for the session summary
    if (name === "screen_view" && safeProps.screen) {
      if (screenRank(safeProps.screen) > screenRank(furthestScreen)) {
        furthestScreen = safeProps.screen;
      }
    }
  } catch {
    // Never throw out of track().
  }
}

/** Return a copy of the event array (debugging / tests). */
export function getEvents() {
  try { return events.slice(); } catch { return []; }
}

/** Return the analytics session id, generating it if needed. */
export function getAnalyticsSessionId() {
  return ensureSessionId();
}

function summarize() {
  const total = events.length;
  const first = firstEventMs ?? Date.now();
  const last = lastEventMs ?? first;
  const duration_ms = Math.max(0, last - first);
  const total_steps_completed = events.filter((e) => e.event === "step_complete").length;
  const total_api_calls = events.filter((e) => e.event === "api_call").length;
  return {
    session_id: analyticsSessionId,
    total_events: total,
    duration_ms,
    furthest_screen: furthestScreen,
    total_steps_completed,
    total_api_calls,
  };
}

/** Public: flush the log to console. Safe to call multiple times; idempotent flush state is not tracked (by design — last call wins). */
export function flushToConsole() {
  try {
    const summary = summarize();
    // Emit a session_end event if we haven't already, so the persisted
    // array reflects the same summary fields the log shows.
    if (!events.some((e) => e.event === "session_end")) {
      track("session_end", {
        total_duration_ms: summary.duration_ms,
        furthest_screen: summary.furthest_screen,
        total_steps_completed: summary.total_steps_completed,
        total_api_calls: summary.total_api_calls,
      });
    }
    const refreshed = summarize();
    // eslint-disable-next-line no-console
    console.log(
      `[Build Wizard Analytics] session_end — events:${refreshed.total_events} duration_ms:${refreshed.duration_ms} furthest:${refreshed.furthest_screen ?? "none"} steps_completed:${refreshed.total_steps_completed} api_calls:${refreshed.total_api_calls}`,
      JSON.stringify(events),
    );
  } catch {
    // Swallow — see module-level contract.
  }
}

/** Test-only: reset module-level state so each test starts clean. */
export function __resetAnalytics() {
  events.length = 0;
  sequence = 0;
  analyticsSessionId = null;
  firstEventMs = null;
  lastEventMs = null;
  furthestScreen = null;
}

if (typeof window !== "undefined") {
  try {
    // `pagehide` is more reliable than `beforeunload` on iOS/Safari and
    // still covers desktop close/refresh/nav.
    window.addEventListener("pagehide", flushToConsole, { capture: true });
    window.addEventListener("beforeunload", flushToConsole, { capture: true });
  } catch {
    // No-op: headless/test environments.
  }
}
