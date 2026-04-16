import T from "../tokens.js";
import ContinueButton from "../components/ContinueButton.jsx";
import { useIsMobile } from "../hooks.js";

/* ━━━ Stage 1: Orientation ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   "What You're Walking Into." Framing only. No celebration shape,
   no interaction beyond the CTA.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export default function Orientation({ onBegin }) {
  const mobile = useIsMobile();
  return (
    <div style={{
      minHeight: "100vh", background: T.color.bg, fontFamily: T.font.body,
      color: T.color.text,
      display: "flex", alignItems: "center", justifyContent: "center",
      overflow: "hidden",
    }}>
      <div style={{ maxWidth: 520, margin: "0 auto", padding: "48px 20px", textAlign: "left" }}>

        <h1 style={{
          fontFamily: T.font.display, fontSize: "clamp(30px,6vw,42px)",
          fontWeight: 400, lineHeight: 1.2, margin: "0 0 24px 0",
          fontStyle: "italic",
        }}>
          You're about to build your<br />
          <span style={{ color: T.color.copper }}>first AI prompt.</span>
        </h1>

        <p style={{
          fontSize: 16, lineHeight: 1.7, color: T.color.textMuted,
          margin: "0 0 16px 0",
        }}>
          In the next hour, you're going to tell Claude about a real problem
          from your work, build a prompt that solves it, and walk away with
          something you can use tomorrow.
        </p>

        <p style={{
          fontSize: 16, lineHeight: 1.7, color: T.color.textMuted,
          margin: "0 0 16px 0",
        }}>
          You don't need to know anything about AI to start. You just need
          something at work that takes too long, happens too often, or could
          be better.
        </p>

        <p style={{
          fontSize: 16, lineHeight: 1.7, color: T.color.textMuted,
          margin: "0 0 32px 0",
        }}>
          Claude is an AI you can talk to like a colleague. It's literal — it
          does exactly what you ask — so learning to ask well is the whole
          game. That's what we're here for.
        </p>

        {mobile && (
          <div style={{
            background: T.color.copperSoft,
            border: `1px solid ${T.color.copperGlow}`,
            borderRadius: 12, padding: "14px 18px",
            margin: "0 0 24px",
          }}>
            <p style={{ fontSize: 13, color: T.color.textMuted, lineHeight: 1.6, margin: 0 }}>
              This works best on a laptop or desktop. Bookmark this page and
              come back on a bigger screen.
            </p>
          </div>
        )}

        <ContinueButton onClick={onBegin} label="Let's go" />
      </div>
    </div>
  );
}
