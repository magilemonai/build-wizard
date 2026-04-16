import T from "../tokens.js";
import OrganicShape, { sectionShapes } from "../components/OrganicShape.jsx";
import ContinueButton from "../components/ContinueButton.jsx";
import { journeySteps } from "../components/JourneyProgress.jsx";
import { useIsMobile } from "../hooks.js";

/* ━━━ Stage 1: Orientation ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   "What You're Walking Into." Framing only. No celebration shape,
   no interaction beyond the CTA. Decorative falling shapes above
   the headline and journey pills below the button.
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
      <div style={{ maxWidth: 520, margin: "0 auto", padding: "0 20px", textAlign: "center" }}>

        {/* Shapes fall into place above the headline: top 3, bottom 2 */}
        <div style={{
          position: "relative", width: 220, height: 120,
          margin: "0 auto 40px", left: 8,
        }}>
          {/* Triangle (copper) */}
          <div style={{
            position: "absolute",
            left: "calc(50% - 72px)", top: "calc(50% - 22px)",
            opacity: 0,
            animation: "fallBounce 1.4s cubic-bezier(0.12, 0, 0.25, 1) 0.3s both",
          }}>
            <OrganicShape shapeIndex={0} size={42} color={T.color.copper} />
          </div>
          {/* Square (sage) */}
          <div style={{
            position: "absolute",
            left: "calc(50% - 16px)", top: "calc(50% - 26px)",
            opacity: 0,
            animation: "fallBounceRight 1.4s cubic-bezier(0.12, 0, 0.25, 1) 0.7s both",
          }}>
            <OrganicShape shapeIndex={1} size={34} color={T.color.sage} />
          </div>
          {/* Pentagon (copper translucent) */}
          <div style={{
            position: "absolute",
            left: "calc(50% + 34px)", top: "calc(50% - 20px)",
            opacity: 0,
            animation: "fallBounceStraight 1.4s cubic-bezier(0.12, 0, 0.25, 1) 1.1s both",
          }}>
            <OrganicShape shapeIndex={2} size={32} color={`${T.raw.copper}cc`} />
          </div>
          {/* Hexagon (sage translucent) */}
          <div style={{
            position: "absolute",
            left: "calc(50% - 34px)", top: "calc(50% + 22px)",
            opacity: 0,
            animation: "fallBounce 1.4s cubic-bezier(0.12, 0, 0.25, 1) 1.5s both",
          }}>
            <OrganicShape shapeIndex={3} size={28} color={`${T.raw.sage}bb`} />
          </div>
          {/* Circle (sage) */}
          <div style={{
            position: "absolute",
            left: "calc(50% + 10px)", top: "calc(50% + 24px)",
            opacity: 0,
            animation: "fallBounceRight 1.4s cubic-bezier(0.12, 0, 0.25, 1) 1.9s both",
          }}>
            <OrganicShape shapeIndex={4} size={26} color={T.color.sage} />
          </div>
        </div>

        {/* Headline */}
        <h1 style={{
          fontFamily: T.font.display, fontSize: "clamp(30px,6vw,42px)",
          fontWeight: 400, lineHeight: 1.2, margin: "0 0 24px 0",
          fontStyle: "italic",
        }}>
          You're about to build your<br />
          <span style={{ color: T.color.copper }}>first AI prompt.</span>
        </h1>

        {/* Body copy: left-aligned within centered container */}
        <div style={{ textAlign: "left", maxWidth: 480, margin: "0 auto" }}>
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
            Claude is an AI you can talk to like a colleague. It does exactly
            what you ask, so learning to ask well is the whole game. That's
            what we're here for.
          </p>
        </div>

        {mobile && (
          <div style={{
            background: T.color.copperSoft,
            border: `1px solid ${T.color.copperGlow}`,
            borderRadius: 12, padding: "14px 18px",
            maxWidth: 380, margin: "0 auto 24px",
          }}>
            <p style={{ fontSize: 13, color: T.color.textMuted, lineHeight: 1.6, margin: 0 }}>
              This works best on a laptop or desktop. Bookmark this page and
              come back on a bigger screen.
            </p>
          </div>
        )}

        {!mobile && (
          <a
            href="https://claude.ai"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "10px 20px", borderRadius: 20,
              border: `1px solid ${T.color.border}`,
              background: T.color.bgSubtle,
              marginBottom: 24,
              fontSize: 15, color: T.color.textMuted, lineHeight: 1.5,
              textDecoration: "none", cursor: "pointer",
              transition: `all 0.2s ${T.ease.smooth}`,
            }}
          >
            Open <strong style={{ color: T.color.copper }}>claude.ai</strong> in another tab ↗
          </a>
        )}

        <div>
          <ContinueButton onClick={onBegin} label="Let's go" />
        </div>

        {/* Journey pills: fade in after shapes have landed */}
        <div style={{ marginTop: 56, display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 8 }}>
          {journeySteps.map((s, i) => (
            <span key={s.key} style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              fontSize: 13, fontWeight: 400, color: T.color.textLight,
              padding: "5px 12px", borderRadius: 20, border: `1px solid ${T.color.border}`,
              opacity: 0,
              animation: `softFadeUp 0.5s ${T.ease.smooth} ${2.6 + i * 0.08}s both`,
            }}>
              <OrganicShape shapeIndex={sectionShapes[i]} size={10} color={T.color.textLight} />
              {s.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
