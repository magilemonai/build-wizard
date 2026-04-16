import { useEffect, useState } from "react";
import T from "../tokens.js";
import SectionShell from "../components/SectionShell.jsx";
import ContinueButton from "../components/ContinueButton.jsx";
import SectionCelebration from "../components/SectionCelebration.jsx";
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
        <h2 style={{
          fontFamily: T.font.display, fontSize: "clamp(26px,5vw,32px)",
          fontWeight: 400, fontStyle: "italic", lineHeight: 1.25,
          margin: "0 0 10px 0", color: T.color.text,
        }}>
          Six things Claude does.
        </h2>
        <p style={{
          fontSize: 15, lineHeight: 1.65, color: T.color.textMuted,
          margin: 0,
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
        margin: "0 0 10px 0", color: T.color.text,
      }}>
        {feature.heading}
      </h3>
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
