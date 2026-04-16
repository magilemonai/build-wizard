import { useEffect, useState } from "react";
import T from "../tokens.js";
import SectionShell from "../components/SectionShell.jsx";
import ContinueButton from "../components/ContinueButton.jsx";
import SectionCelebration from "../components/SectionCelebration.jsx";
import { SparklyTriangle } from "../components/SparklyShape.jsx";
import cockpitFeatures from "../data/cockpitFeatures.js";

/* ━━━ Stage 2: The Cockpit ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Six Claude capabilities, one card at a time. Each card is its own
   SectionShell step so the PageTransition handles slide/fade between
   them. The final step is the anchor celebration.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const TOTAL_CARDS = cockpitFeatures.length;

function buildSteps() {
  const steps = cockpitFeatures.map((f) => ({ type: "card", id: f.id }));
  steps.push({ type: "anchor" });
  return steps;
}

export default function Cockpit({ onComplete, onBack, onProgress, initialStep, onStepChange }) {
  const steps = buildSteps();

  return (
    <SectionShell
      sectionKey="cockpit"
      steps={steps}
      onBack={onBack}
      onProgress={onProgress}
      initialStep={initialStep}
      onStepChange={onStepChange}
      renderStep={({ step, stepIndex, advance, BackButton }) => {
        if (step.type === "card") {
          const feature = cockpitFeatures.find((f) => f.id === step.id);
          const isLast = stepIndex === TOTAL_CARDS - 1;
          const nextLabel = isLast
            ? "Got it, let's build"
            : `Next: ${cockpitFeatures[stepIndex + 1]?.heading}`;
          return (
            <SingleCardView
              feature={feature}
              cardIndex={stepIndex}
              nextLabel={nextLabel}
              onNext={advance}
              BackButton={BackButton}
            />
          );
        }
        if (step.type === "anchor") {
          return <AnchorView onContinue={onComplete} BackButton={BackButton} />;
        }
        return null;
      }}
    />
  );
}

/* ━━━ Progress dots ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function CardDots({ current, total }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 6,
      marginBottom: 16,
    }}>
      {Array.from({ length: total }, (_, i) => (
        <div key={i} style={{
          width: i === current ? 18 : 6,
          height: 6,
          borderRadius: 3,
          background: i === current ? T.color.copper : i < current ? T.color.sage : T.color.border,
          transition: `all 0.35s ${T.ease.smooth}`,
        }} />
      ))}
      <span style={{
        marginLeft: 6, fontSize: 12, color: T.color.textLight,
        fontFamily: T.font.body, letterSpacing: "0.02em",
      }}>
        {current + 1} of {total}
      </span>
    </div>
  );
}

/* ━━━ Single card view (one card per step) ━━━━━━━━━━━━━━━━━━━━━ */
function SingleCardView({ feature, cardIndex, nextLabel, onNext, BackButton }) {
  return (
    <div>
      {BackButton}

      {/* Header on first card only */}
      {cardIndex === 0 && (
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
      )}

      <CardDots current={cardIndex} total={TOTAL_CARDS} />
      <FeatureCard feature={feature} />

      <div style={{ marginTop: 20 }}>
        <ContinueButton onClick={onNext} label={nextLabel} />
      </div>
    </div>
  );
}

/* ━━━ Screenshot image (real or placeholder) ━━━━━━━━━━━━━━━━━━━ */
const IMAGE_BASE = "/images/cockpit/";

function ScreenshotImage({ filename, label }) {
  const [failed, setFailed] = useState(false);
  const src = `${IMAGE_BASE}${filename}`;

  if (failed) {
    return (
      <div style={{
        width: "100%",
        minHeight: 120,
        borderRadius: 8,
        border: `1px solid ${T.color.border}`,
        background: T.color.bgSubtle,
        display: "flex", alignItems: "center", justifyContent: "center",
        color: T.color.textLight, fontSize: 13,
        fontFamily: T.font.body, letterSpacing: "0.02em",
      }}>
        {label} screenshot
      </div>
    );
  }

  return (
    <div style={{
      width: "100%",
      borderRadius: 8,
      overflow: "hidden",
      border: `1px solid ${T.color.border}`,
      background: T.color.bgSubtle,
    }}>
      <img
        src={src}
        alt={`Claude ${label} interface`}
        onError={() => setFailed(true)}
        style={{
          display: "block",
          width: "100%",
          height: "auto",
        }}
      />
    </div>
  );
}

/* ━━━ Single feature card ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function FeatureCard({ feature }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(t);
  }, []);

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
      <p style={{
        fontSize: 15, lineHeight: 1.65, color: T.color.textMuted,
        margin: "0 0 12px 0",
      }}>
        {feature.body}
      </p>
      {feature.image && (
        <ScreenshotImage filename={feature.image} label={feature.label} />
      )}
    </article>
  );
}

/* ━━━ Anchor / celebration view ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function AnchorView({ onContinue, BackButton }) {
  return (
    <div style={{ padding: "32px 0", textAlign: "center" }}>
      {BackButton}
      <SectionCelebration heroShapeIndex={0} variant="small" />
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
