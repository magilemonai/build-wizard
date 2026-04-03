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

        {/* Shapes fall into place above the headline */}
        <div style={{
          position: "relative", width: 160, height: 100,
          margin: "0 auto 40px",
        }}>
          <div style={{
            position: "absolute",
            left: "calc(50% - 40px)", top: "calc(50% - 4px)",
            opacity: 0,
            animation: "fallBounce 1.4s cubic-bezier(0.12, 0, 0.25, 1) 0.3s both",
          }}>
            <OrganicShape shapeIndex={0} size={46} color={T.color.copper} />
          </div>
          <div style={{
            position: "absolute",
            left: "calc(50% + 12px)", top: "calc(50% - 10px)",
            opacity: 0,
            animation: "fallBounceRight 1.4s cubic-bezier(0.12, 0, 0.25, 1) 0.9s both",
          }}>
            <OrganicShape shapeIndex={1} size={36} color={T.color.sage} />
          </div>
          <div style={{
            position: "absolute",
            left: "calc(50% - 8px)", top: "calc(50% + 22px)",
            opacity: 0,
            animation: "fallBounceStraight 1.4s cubic-bezier(0.12, 0, 0.25, 1) 1.5s both",
          }}>
            <OrganicShape shapeIndex={4} size={29} color={`${T.color.text}25`} />
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
            border: `1px solid rgba(191,123,94,0.18)`,
            borderRadius: 12, padding: "14px 18px",
            maxWidth: 380, margin: "0 auto 36px",
          }}>
            <p style={{ fontSize: 13, color: T.color.textMuted, lineHeight: 1.6, margin: 0 }}>
              This experience works best on a laptop or desktop, where you can keep
              Claude open in another tab. Consider bookmarking this page and coming back
              on a bigger screen.
            </p>
          </div>
        ) : (
          <p style={{
            fontSize: 13, color: T.color.textLight, maxWidth: 380,
            margin: "0 auto 40px", lineHeight: 1.6,
          }}>
            This works best with Claude open in another tab while you build.
          </p>
        )}

        {/* Button — visible immediately */}
        <ContinueButton onClick={onBegin} label="Let's go" />

        {/* Journey pills — fade in after shapes have landed */}
        <div style={{ marginTop: 56, display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 8 }}>
          {journeySteps.map((s, i) => (
            <span key={s.key} style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              fontSize: 12, fontWeight: 400, color: T.color.textLight,
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
