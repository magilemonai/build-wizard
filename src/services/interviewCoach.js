/**
 * Interview coach client.
 *
 * Sends the user's free-text work problem to the Worker with the
 * "interview_coach" touchpoint, parses the JSON response, validates
 * its shape, and returns a normalized result. Never throws. On any
 * failure the caller falls back to keyword-based matching.
 */
import { sendMessage } from "./api.js";
import templates, { getTemplateById } from "../data/templates.js";

const VALID_BUCKETS = new Set(["information", "production", "thinking"]);
const KNOWN_TEMPLATE_IDS = new Set(templates.map((t) => t.id));

/** Try to extract a JSON object from a model response that may have
 *  stray whitespace, a code fence, or a prose preamble. */
function extractJson(text) {
  if (typeof text !== "string") return null;
  const trimmed = text.trim();
  // Direct parse first
  try { return JSON.parse(trimmed); } catch { /* fall through */ }
  // Strip ```json fences if present
  const fenced = trimmed.replace(/^```(?:json)?\s*/i, "").replace(/```$/, "").trim();
  if (fenced !== trimmed) {
    try { return JSON.parse(fenced); } catch { /* fall through */ }
  }
  // Fall back to first "{" through last "}"
  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start >= 0 && end > start) {
    const candidate = trimmed.slice(start, end + 1);
    try { return JSON.parse(candidate); } catch { /* fall through */ }
  }
  return null;
}

/** Normalize + validate the parsed coach JSON. Returns null if unusable. */
function normalize(parsed) {
  if (!parsed || typeof parsed !== "object") return null;
  const bucket = typeof parsed.bucket === "string" ? parsed.bucket : null;
  if (!bucket || !VALID_BUCKETS.has(bucket)) return null;

  const rawTemplates = Array.isArray(parsed.templates) ? parsed.templates : [];
  const templateIds = rawTemplates
    .filter((id) => typeof id === "string")
    .filter((id) => KNOWN_TEMPLATE_IDS.has(id));
  if (templateIds.length === 0) return null;

  const message = typeof parsed.message === "string" ? parsed.message.trim() : "";
  if (!message) return null;

  const scopeWarning = typeof parsed.scope_warning === "string" && parsed.scope_warning.trim()
    ? parsed.scope_warning.trim()
    : null;

  return { bucket, templateIds, message, scopeWarning };
}

/**
 * Ask the coach to match a work problem to a bucket + templates.
 *
 * @param {string} problem       The user's textarea input.
 * @param {string} sessionId     Lazy session id from useInterview.
 * @returns {Promise<{ok: true, data: {bucket, templateIds, templates, message, scopeWarning}} | {ok: false, error: string}>}
 */
export async function fetchInterviewMatch(problem, sessionId) {
  if (!problem || typeof problem !== "string") {
    return { ok: false, error: "Empty problem." };
  }
  const { response, error } = await sendMessage(
    [{ role: "user", content: problem }],
    sessionId,
    { touchpoint: "interview_coach" },
  );
  if (!response) {
    return { ok: false, error: error || "No response." };
  }
  const parsed = extractJson(response);
  const normalized = normalize(parsed);
  if (!normalized) {
    return { ok: false, error: "Malformed coach response." };
  }
  // Resolve template objects for the caller's convenience
  const templateObjs = normalized.templateIds
    .map(getTemplateById)
    .filter(Boolean);
  if (templateObjs.length === 0) {
    return { ok: false, error: "No known templates in coach response." };
  }
  return {
    ok: true,
    data: {
      bucket: normalized.bucket,
      templateIds: normalized.templateIds,
      templates: templateObjs,
      message: normalized.message,
      scopeWarning: normalized.scopeWarning,
    },
  };
}
