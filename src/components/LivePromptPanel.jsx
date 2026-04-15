import { useEffect, useRef, useState } from "react";
import T from "../tokens.js";
import { sendMessage } from "../services/api.js";
import { getApiAvailability } from "../services/apiAvailability.js";

/* ━━━ LivePromptPanel ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Renders a "Try it here" button next to PromptCard's Copy button
   and, on click, sends the prompt to Claude and displays the reply
   inline.

   Degrade policy:
   - If the API is unavailable (cached check on mount), render null.
     PromptCard falls back to copy-only with no indication that another
     option ever existed.
   - On any send error, show a quiet single-line message inside the
     panel. Never surface the raw error.

   Placement note:
   - The button renders in PromptCard's action bar. The response area
     renders below the button, still inside the PromptCard's action
     region, so outcome choices continue to sit below it. Long
     responses scroll inside a max-height container.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export default function LivePromptPanel({ prompt, getSessionId }) {
  const [available, setAvailable] = useState(null); // null = checking, true/false = known
  const [status, setStatus] = useState("idle");     // idle | loading | ready
  const [response, setResponse] = useState("");
  const [hovered, setHovered] = useState(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  // One-time availability check (shared cache across all panels).
  useEffect(() => {
    let cancelled = false;
    getApiAvailability().then((ok) => {
      if (cancelled || !mountedRef.current) return;
      setAvailable(Boolean(ok));
    });
    return () => { cancelled = true; };
  }, []);

  const handleTryHere = async () => {
    if (status === "loading") return;
    setStatus("loading");
    setResponse("");
    const sessionId = getSessionId();
    const result = await sendMessage(
      [{ role: "user", content: prompt }],
      sessionId,
    );
    if (!mountedRef.current) return;
    if (!result.response) {
      // eslint-disable-next-line no-console
      console.warn("[Build Wizard API] Try-it-here failed:", result.error);
      // Silent failure: return to idle so the button is clickable again.
      // The user can retry or fall back to the copy flow.
      setStatus("idle");
      return;
    }
    setResponse(result.response);
    setStatus("ready");
  };

  // Render nothing until we know, and nothing forever if unavailable.
  if (available !== true) return null;

  return (
    <div style={{ marginTop: 10 }}>
      <button
        onClick={handleTryHere}
        disabled={status === "loading"}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          padding: "8px 16px",
          background: status === "loading"
            ? T.color.sageSoft
            : hovered ? T.color.copperSoft : "transparent",
          border: `1px solid ${status === "loading" ? T.color.sageBorder : T.color.copper}`,
          borderRadius: 8,
          fontFamily: T.font.body, fontSize: 15,
          color: status === "loading" ? T.color.sage : T.color.copper,
          cursor: status === "loading" ? "default" : "pointer",
          transition: `all 0.25s ${T.ease.smooth}`,
        }}
      >
        {status === "loading" ? "Claude is thinking…" : "Try it here"}
      </button>

      {status === "loading" && (
        <div
          aria-live="polite"
          style={{
            marginTop: 10,
            padding: "14px 16px",
            background: T.color.bgSubtle,
            border: `1px solid ${T.color.border}`,
            borderRadius: 12,
            fontSize: 14, color: T.color.textLight, fontFamily: T.font.body,
            display: "flex", alignItems: "center", gap: 10,
            animation: `sagePulse 1.8s ease-in-out infinite`,
          }}
        >
          <div style={{
            width: 8, height: 8, borderRadius: "50%",
            background: T.color.sage,
          }} />
          Sending to Claude…
        </div>
      )}

      {status === "ready" && response && (
        <div
          aria-live="polite"
          style={{
            marginTop: 10,
            padding: "14px 16px",
            background: T.color.bgCard,
            border: `1px solid ${T.color.sageBorder}`,
            borderRadius: 12,
            maxHeight: 360, overflowY: "auto",
            fontSize: 15, lineHeight: 1.65,
            color: T.color.text, fontFamily: T.font.body,
            whiteSpace: "pre-wrap", wordBreak: "break-word",
            animation: "fadeInNotice 0.35s ease",
          }}
        >
          <div style={{
            fontSize: 12, fontWeight: 500, letterSpacing: "0.08em",
            textTransform: "uppercase", color: T.color.sage,
            marginBottom: 8,
          }}>
            Claude's reply
          </div>
          {response}
        </div>
      )}

    </div>
  );
}
