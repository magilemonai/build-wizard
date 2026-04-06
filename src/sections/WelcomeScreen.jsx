import T from "../tokens.js";
import OrganicShape, { sectionShapes } from "../components/OrganicShape.jsx";
import ContinueButton from "../components/ContinueButton.jsx";
import { journeySteps } from "../components/JourneyProgress.jsx";
import { useIsMobile } from "../hooks.js";

/* ━━━ Welcome Screen ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export default function WelcomeScreen({ onBegin }) {
  const mobile = useIsMobile();
  return (
    <div style={{
      minHeight: "100vh", background: T.color.bg, fontFamily: T.font.body,
      color: T.color.text, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden",
    }}>
      <div style={{ maxWidth: 560, margin: "0 auto", padding: "0 20px", textAlign: "center" }}>

        {/* Shapes fall into place above the headline — top 3, bottom 2 */}
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
          <div style={{
            position: "absolute",
            left: "calc(50% - 16px)", top: "calc(50% - 26px)",
            opacity: 0,
            animation: "fallBounceRight 1.4s cubic-bezier(0.12, 0, 0.25, 1) 0.7s both",
          }}>
            <OrganicShape shapeIndex={1} size={34} color={T.color.sage} />
          </div>
          <div style={{
            position: "absolute",
            left: "calc(50% + 34px)", top: "calc(50% - 20px)",
            opacity: 0,
            animation: "fallBounceStraight 1.4s cubic-bezier(0.12, 0, 0.25, 1) 1.1s both",
          }}>
            <OrganicShape shapeIndex={2} size={32} color={`${T.raw.copper}cc`} />
          </div>
          {/* Bottom row: hexagon, circle — centered under the top 3 */}
          <div style={{
            position: "absolute",
            left: "calc(50% - 34px)", top: "calc(50% + 22px)",
            opacity: 0,
            animation: "fallBounce 1.4s cubic-bezier(0.12, 0, 0.25, 1) 1.5s both",
          }}>
            <OrganicShape shapeIndex={3} size={28} color={`${T.raw.sage}bb`} />
          </div>
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
          fontFamily: T.font.display, fontSize: "clamp(38px,8vw,56px)",
          fontWeight: 400, lineHeight: 1.1, margin: "0 0 24px 0",
          fontStyle: "italic",
        }}>
          Build something<br /><span style={{ color: T.color.copper }}>real</span> with AI
        </h1>

        {/* Subtext */}
        <p style={{
          fontSize: 17, lineHeight: 1.7, color: T.color.textMuted, maxWidth: 420, margin: "0 auto 20px",
        }}>
          We'll figure out what you want to make, hand you the tools,
          teach you what to watch out for, and get out of the way.
          One finished project. No experience required.
        </p>

        {/* Device recommendation — actionable on mobile, gentle on desktop */}
        {mobile ? (
          <div style={{
            background: T.color.copperSoft,
            border: `1px solid ${T.color.copperGlow}`,
            borderRadius: 12, padding: "14px 18px",
            maxWidth: 380, margin: "0 auto 36px",
          }}>
            <p style={{ fontSize: 13, color: T.color.textMuted, lineHeight: 1.6, margin: 0 }}>
              This experience works best on a laptop or desktop, where you can keep
              Claude open in another tab. Consider bookmarking this page and coming back
              on a bigger screen.
            </p>
          </div>
        ) : null}

        {/* Desktop: Open Claude link, then start button below it */}
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
            Open <strong style={{ color: T.color.copper }}>claude.ai</strong> in another tab before you start ↗
          </a>
        )}

        {/* Button — below the Claude link */}
        <div>
          <ContinueButton onClick={onBegin} label="Let's go" />
        </div>

        {/* Journey pills — fade in after shapes have landed */}
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
