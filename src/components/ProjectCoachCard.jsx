import { useEffect, useRef, useState } from "react";
import T from "../tokens.js";
import { sendMessage } from "../services/api.js";
import { getApiAvailability } from "../services/apiAvailability.js";

/* ━━━ ProjectCoachCard ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Sits under the PathCard on the "Your Plan" screen. Asks the Claude
   coach to personalize a 2-3 sentence encouragement for the user's
   specific project and experience.

   Degrade policy:
   - If the API is unavailable, render null (no error, no empty card).
   - If the API call fails, render null (same).
   - No layout shift: the card only appears once a response is in hand.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function buildCoachPrompt(answers, pathCard) {
  const path = answers.fork === "work" ? "work" : "personal";
  const idea = answers.project_idea?.trim() || "(no idea provided yet)";
  const experience = answers.experience || "unknown";
  const time = answers.time || "unknown";
  const longOutput = answers.long_output || "unknown";

  return [
    `A user just finished the interview in an AI onboarding wizard and chose this project plan:`,
    ``,
    `- Path: ${path}`,
    `- Their own description: "${idea}"`,
    `- Matched template: ${pathCard.projectName}`,
    `- Experience with AI: ${experience}`,
    `- Time available: ${time}`,
    `- Has asked AI for long output before: ${longOutput}`,
    ``,
    `In 2-3 sentences, speak directly to them:`,
    `1. Confirm their goal in their own words so they feel heard.`,
    `2. Suggest one angle or consideration they might not have thought of.`,
    `3. Set expectations for what they'll actually have at the end.`,
    ``,
    `Keep it warm and specific. No preamble, no headers, no bullet points in your reply.`,
  ].join("\n");
}

export default function ProjectCoachCard({ answers, pathCard, ensureSessionId }) {
  const [status, setStatus] = useState("pending"); // pending | loading | ready | hidden
  const [response, setResponse] = useState("");
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const available = await getApiAvailability();
      if (cancelled || !mountedRef.current) return;
      if (!available) { setStatus("hidden"); return; }

      setStatus("loading");
      const sessionId = ensureSessionId();
      const prompt = buildCoachPrompt(answers, pathCard);
      const result = await sendMessage(
        [{ role: "user", content: prompt }],
        sessionId,
      );
      if (cancelled || !mountedRef.current) return;

      if (!result.response) {
        // eslint-disable-next-line no-console
        console.warn("[Build Wizard API] Coach card failed:", result.error);
        setStatus("hidden");
        return;
      }
      setResponse(result.response.trim());
      setStatus("ready");
    })();
    return () => { cancelled = true; };
    // Build one response per path-card render. Answers/pathCard shouldn't
    // change under this screen, so an empty dep list is correct here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (status === "hidden") return null;

  if (status === "pending" || status === "loading") {
    return (
      <div
        aria-live="polite"
        style={{
          marginTop: 16,
          padding: "16px 20px",
          background: T.color.bgSubtle,
          border: `1px solid ${T.color.border}`,
          borderRadius: 14,
          display: "flex", alignItems: "center", gap: 12,
          animation: `sagePulse 1.8s ease-in-out infinite`,
        }}
      >
        <div style={{
          width: 8, height: 8, borderRadius: "50%",
          background: T.color.sage,
        }} />
        <div style={{
          fontSize: 14, color: T.color.textLight, fontFamily: T.font.body,
          letterSpacing: "0.02em",
        }}>
          Your coach is writing a note…
        </div>
      </div>
    );
  }

  return (
    <div
      role="note"
      style={{
        marginTop: 16,
        padding: "18px 22px",
        background: T.color.bgCard,
        border: `1px solid ${T.color.sageBorder}`,
        borderRadius: 14,
        animation: "fadeInNotice 0.45s ease",
      }}
    >
      <div style={{
        fontSize: 13, fontWeight: 500, letterSpacing: "0.08em",
        textTransform: "uppercase", color: T.color.sage,
        marginBottom: 8, fontFamily: T.font.body,
      }}>
        A note from your coach
      </div>
      <p style={{
        margin: 0, fontSize: 15, lineHeight: 1.65,
        color: T.color.text, fontFamily: T.font.body,
        whiteSpace: "pre-wrap",
      }}>
        {response}
      </p>
    </div>
  );
}
