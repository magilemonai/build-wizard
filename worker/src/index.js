/**
 * Build Wizard — Claude API Proxy Worker
 *
 * Accepts POST /api/chat from the wizard frontend, forwards to the
 * Anthropic Messages API, returns { response, usage }. Keeps the API
 * key server-side so the frontend never sees it.
 *
 * Rate limiting is per-IP, in-memory. In-memory state is scoped to a
 * single Worker isolate and is NOT durable across isolates or deploys;
 * that is an accepted tradeoff for a simple proxy. For stronger limits
 * swap the Map for KV or Durable Objects later.
 */

const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-sonnet-4-20250514";
const MAX_TOKENS = 1024;

const SYSTEM_PROMPT = `You are a friendly, concise AI learning coach inside the Build Wizard — an onboarding tool that teaches people how to work with AI by having them actually build something.

Your job is to help the user understand what just happened and why. When they ran a prompt and got a surprising or confusing result, explain the mechanics in plain language. When they're stuck, ask one focused question to unblock them rather than lecturing.

Rules:
- Never condescending. Assume the user is smart but new to this specific thing.
- Keep responses under 150 words unless the user explicitly asks for more detail.
- Prefer analogies over jargon. If you must use a term, define it in the same sentence.
- No em-dashes. No "it's not just X, it's Y" phrasing.
- If the user asks something outside the scope of learning AI (personal advice, unrelated factual lookups, long creative tasks), gently redirect them back to the exercise they're working on.`;

const ALLOWED_ORIGINS = new Set([
  "https://build.codywymore.com",
  "http://localhost:5173",
]);

// ── Rate limiting (in-memory, per-isolate) ─────────────────────────
const RATE_LIMIT_MAX = 60;           // requests per window per IP
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const rateLimitBuckets = new Map();  // ip -> { count, resetAt }

function checkRateLimit(ip) {
  const now = Date.now();
  const bucket = rateLimitBuckets.get(ip);
  if (!bucket || bucket.resetAt <= now) {
    rateLimitBuckets.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true, retryAfterSec: 0 };
  }
  if (bucket.count >= RATE_LIMIT_MAX) {
    return { allowed: false, retryAfterSec: Math.ceil((bucket.resetAt - now) / 1000) };
  }
  bucket.count += 1;
  return { allowed: true, retryAfterSec: 0 };
}

// Sweep expired buckets opportunistically so the Map doesn't grow
// unbounded during a long-lived isolate.
function sweepRateLimitBuckets() {
  const now = Date.now();
  for (const [ip, bucket] of rateLimitBuckets) {
    if (bucket.resetAt <= now) rateLimitBuckets.delete(ip);
  }
}

// ── CORS ───────────────────────────────────────────────────────────
function corsHeaders(origin) {
  const allowed = origin && ALLOWED_ORIGINS.has(origin);
  return {
    "Access-Control-Allow-Origin": allowed ? origin : "https://build.codywymore.com",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin",
  };
}

function jsonResponse(body, status, origin) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders(origin),
    },
  });
}

function errorResponse(code, message, status, origin, extra = {}) {
  return jsonResponse({ error: { code, message, ...extra } }, status, origin);
}

// ── Main handler ───────────────────────────────────────────────────
export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin");

    // Preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }

    const url = new URL(request.url);
    if (url.pathname !== "/api/chat" || request.method !== "POST") {
      return errorResponse("not_found", "Unknown endpoint.", 404, origin);
    }

    // Rate limit (best effort, per isolate)
    const ip = request.headers.get("cf-connecting-ip") || "unknown";
    if (Math.random() < 0.05) sweepRateLimitBuckets();
    const rl = checkRateLimit(ip);
    if (!rl.allowed) {
      return errorResponse(
        "rate_limited",
        `You've hit the hourly limit for this tool. Try again in about ${Math.ceil(rl.retryAfterSec / 60)} minutes.`,
        429,
        origin,
        { retry_after_seconds: rl.retryAfterSec },
      );
    }

    // Parse + validate
    let payload;
    try {
      payload = await request.json();
    } catch {
      return errorResponse("bad_request", "Request body must be valid JSON.", 400, origin);
    }

    const { messages, sessionId } = payload || {};
    if (!Array.isArray(messages) || messages.length === 0) {
      return errorResponse("bad_request", "`messages` must be a non-empty array.", 400, origin);
    }
    if (typeof sessionId !== "string" || sessionId.length === 0) {
      return errorResponse("bad_request", "`sessionId` is required.", 400, origin);
    }

    if (!env.ANTHROPIC_API_KEY) {
      return errorResponse("server_misconfigured", "Worker is missing ANTHROPIC_API_KEY.", 500, origin);
    }

    // Forward to Anthropic
    let upstream;
    try {
      upstream = await fetch(ANTHROPIC_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: MODEL,
          max_tokens: MAX_TOKENS,
          system: SYSTEM_PROMPT,
          messages,
        }),
      });
    } catch (err) {
      return errorResponse("upstream_network", "Could not reach the model provider.", 502, origin, {
        detail: String(err?.message || err),
      });
    }

    if (!upstream.ok) {
      let detail = null;
      try { detail = await upstream.json(); } catch { /* ignore */ }
      return errorResponse(
        "upstream_error",
        "The model provider returned an error.",
        502,
        origin,
        { upstream_status: upstream.status, upstream_body: detail },
      );
    }

    let data;
    try {
      data = await upstream.json();
    } catch {
      return errorResponse("upstream_parse", "Could not parse provider response.", 502, origin);
    }

    // Concatenate text content blocks (Anthropic returns content: [{type, text}, ...])
    const text = Array.isArray(data?.content)
      ? data.content.filter((b) => b?.type === "text").map((b) => b.text).join("")
      : "";

    return jsonResponse(
      {
        response: text,
        usage: {
          input_tokens: data?.usage?.input_tokens ?? 0,
          output_tokens: data?.usage?.output_tokens ?? 0,
        },
      },
      200,
      origin,
    );
  },
};
