/**
 * Frontend client for the build-wizard-api Worker.
 *
 * Never throws. Every failure path returns { response: null, error }
 * so callers can branch cleanly without try/catch boilerplate.
 */

export const WORKER_URL = import.meta.env?.VITE_WORKER_URL || "http://localhost:8787";

const REQUEST_TIMEOUT_MS = 30_000;

/**
 * POST /api/chat. Returns { response, usage } on success, or
 * { response: null, error } on any failure (network, timeout, non-200).
 *
 * @param {Array<{role: string, content: string}>} messages
 * @param {string} sessionId
 */
export async function sendMessage(messages, sessionId) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const res = await fetch(`${WORKER_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages, sessionId }),
      signal: controller.signal,
    });

    let body = null;
    try { body = await res.json(); } catch { /* non-JSON body */ }

    if (!res.ok) {
      const message = body?.error?.message || `Request failed with status ${res.status}.`;
      return { response: null, error: message };
    }

    if (typeof body?.response !== "string") {
      return { response: null, error: "Malformed response from server." };
    }

    return { response: body.response, usage: body.usage || null };
  } catch (err) {
    if (err?.name === "AbortError") {
      return { response: null, error: "Request timed out. Try again in a moment." };
    }
    return { response: null, error: "Could not reach the server. Check your connection." };
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Lightweight health check. Posts a minimal message to /api/chat and
 * reports whether the Worker answered successfully. Components call
 * this to decide between "Try it here" (live API) and copy-only mode.
 *
 * Note: this costs a handful of tokens per check. Cache the result at
 * the call site if you need to poll.
 */
export async function isApiAvailable() {
  const { response } = await sendMessage(
    [{ role: "user", content: "ping" }],
    "healthcheck",
  );
  return response !== null;
}
