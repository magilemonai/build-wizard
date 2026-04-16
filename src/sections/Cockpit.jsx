import { useEffect, useState } from "react";
import T from "../tokens.js";
import SectionShell from "../components/SectionShell.jsx";
import ContinueButton from "../components/ContinueButton.jsx";
import SectionCelebration from "../components/SectionCelebration.jsx";
import OrganicShape from "../components/OrganicShape.jsx";
import cockpitFeatures from "../data/cockpitFeatures.js";

/* ━━━ Stage 2: The Cockpit ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Six Claude capabilities explained with plain-language analogies.
   Vertical stack, one screen, scrollable. Celebration on advance.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export default function Cockpit({ onComplete, onBack, onProgress, initialStep, onStepChange }) {
  const steps = [{ type: "cards" }, { type: "anchor" }];

  return (
    <SectionShell
      sectionKey="cockpit"
      steps={steps}
      onBack={onBack}
      onProgress={onProgress}
      initialStep={initialStep}
      onStepChange={onStepChange}
      renderStep={({ step, advance, BackButton }) => {
        if (step.type === "cards") {
          return <CardsView advance={advance} BackButton={BackButton} />;
        }
        if (step.type === "anchor") {
          return <AnchorView onContinue={onComplete} BackButton={BackButton} />;
        }
        return null;
      }}
    />
  );
}

/* ━━━ Sparkly spinning triangle ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Decorative animated shape: slow-spinning triangle with two
   pulsing sparkle dots. Uses gentleSpin + sparkle keyframes from
   global.css.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function SparklyTriangle() {
  return (
    <div style={{
      position: "relative", width: 36, height: 36,
      display: "inline-block", verticalAlign: "middle",
    }}>
      <div style={{ animation: "gentleSpin 12s linear infinite", lineHeight: 0 }}>
        <OrganicShape shapeIndex={0} size={32} color={T.color.copper} />
      </div>
      {[
        { top: -4, right: -2, delay: 0 },
        { bottom: -2, left: 2, delay: 0.6 },
      ].map((pos, i) => (
        <div key={i} style={{
          position: "absolute",
          top: pos.top, right: pos.right, bottom: pos.bottom, left: pos.left,
          width: 5, height: 5,
          borderRadius: "50%", background: T.color.copper,
          animation: `sparkle 2s ease-in-out ${pos.delay}s infinite`,
        }} />
      ))}
    </div>
  );
}

/* ━━━ Cards view ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function CardsView({ advance, BackButton }) {
  return (
    <div>
      {BackButton}
      <header style={{ marginBottom: 20 }}>
        <div style={{
          fontFamily: T.font.body, fontSize: 13, fontWeight: 500,
          letterSpacing: "0.08em", textTransform: "uppercase",
          color: T.color.copper, marginBottom: 10,
        }}>
          The cockpit
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <h2 style={{
            fontFamily: T.font.display, fontSize: "clamp(26px,5vw,32px)",
            fontWeight: 400, fontStyle: "italic", lineHeight: 1.25,
            margin: 0, color: T.color.text, flex: 1,
          }}>
            Six things Claude does.
          </h2>
          <SparklyTriangle />
        </div>
        <p style={{
          fontSize: 15, lineHeight: 1.65, color: T.color.textMuted,
          margin: "10px 0 0",
        }}>
          A quick tour of the dials and toggles. You don't need to memorize
          these. Come back here any time.
        </p>
      </header>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {cockpitFeatures.map((f, i) => (
          <FeatureCard key={f.id} feature={f} index={i} />
        ))}
      </div>

      <div style={{ marginTop: 28 }}>
        <ContinueButton onClick={advance} label="Got it, let's build" />
      </div>
    </div>
  );
}

/* ━━━ Screenshot image (real or placeholder) ━━━━━━━━━━━━━━━━━━━ */
const IMAGE_BASE = "/images/cockpit/";

function ScreenshotImage({ filename, label }) {
  const [failed, setFailed] = useState(false);
  const src = `${IMAGE_BASE}${filename}`;

  return (
    <div style={{
      width: "100%",
      aspectRatio: "16 / 9",
      borderRadius: 8,
      overflow: "hidden",
      border: `1px solid ${T.color.border}`,
      marginBottom: 12,
      background: T.color.bgSubtle,
    }}>
      {!failed ? (
        <img
          src={src}
          alt={`Claude ${label} interface`}
          onError={() => setFailed(true)}
          style={{
            display: "block", width: "100%", height: "100%",
            objectFit: "cover",
          }}
        />
      ) : (
        <div style={{
          width: "100%", height: "100%",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: T.color.textLight, fontSize: 13,
          fontFamily: T.font.body, letterSpacing: "0.02em",
        }}>
          {label} screenshot
        </div>
      )}
    </div>
  );
}

/* ━━━ Single feature card ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function FeatureCard({ feature, index }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 60 + index * 50);
    return () => clearTimeout(t);
  }, [index]);

  return (
    <article style={{
      background: T.color.bgCard,
      border: `1px solid ${T.color.border}`,
      borderRadius: 14,
      padding: "16px 18px",
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(8px)",
      transition: `all 0.5s ${T.ease.smooth}`,
    }}>
      <div style={{
        fontFamily: T.font.body, fontSize: 12, fontWeight: 500,
        letterSpacing: "0.08em", textTransform: "uppercase",
        color: T.color.sage, marginBottom: 6,
      }}>
        {feature.label}
      </div>
      <h3 style={{
        fontFamily: T.font.display, fontSize: 22,
        fontWeight: 400, fontStyle: "italic", lineHeight: 1.25,
        margin: "0 0 12px 0", color: T.color.text,
      }}>
        {feature.heading}
      </h3>
      {feature.image && (
        <ScreenshotImage filename={feature.image} label={feature.label} />
      )}
      <p style={{
        fontSize: 15, lineHeight: 1.65, color: T.color.textMuted,
        margin: 0,
      }}>
        {feature.body}
      </p>
    </article>
  );
}

/* ━━━ Anchor / celebration view ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function AnchorView({ onContinue, BackButton }) {
  return (
    <div style={{ padding: "32px 0", textAlign: "center" }}>
      {BackButton}
      <SectionCelebration heroShapeIndex={0} intensity={1} />
      <h2 style={{
        fontFamily: T.font.display, fontSize: "clamp(24px,5vw,30px)",
        fontWeight: 400, fontStyle: "italic", lineHeight: 1.3,
        margin: "0 0 12px 0", color: T.color.text,
      }}>
        You've seen the cockpit.
      </h2>
      <p style={{
        fontSize: 15, lineHeight: 1.65, color: T.color.textMuted,
        margin: "0 auto 8px", maxWidth: 420,
      }}>
        Now the fun part: telling Claude about something real at work.
      </p>
      <ContinueButton onClick={onContinue} label="Continue" />
    </div>
  );
}
