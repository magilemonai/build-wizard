import { useState, useEffect } from "react";
import T from "../tokens.js";
import SectionShell from "../components/SectionShell.jsx";
import ContinueButton from "../components/ContinueButton.jsx";
import SectionCelebration from "../components/SectionCelebration.jsx";

/* ━━━ Stage 6: Keep Going ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Six seed ideas for what else Claude can do. Final celebration.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function getSeeds(templateName) {
  return [
    {
      heading: "Iterate on what you built",
      body: "Paste your prompt back into Claude and say 'help me improve this.' Claude can critique its own output and suggest refinements. Your first draft is never your best draft.",
    },
    {
      heading: "Save it in a Project",
      body: "Create a Project in Claude for this workflow. Add your prompt as a Project instruction, and Claude will remember it every time you start a new conversation there.",
    },
    {
      heading: "Try a different template",
      body: `You picked ${templateName || "a template"} today. Come back and try another one. Each template teaches you a different way to work with Claude.`,
    },
    {
      heading: "Prep for your next meeting",
      body: "Before your next big meeting, paste the agenda into Claude and ask for a prep brief: talking points, potential questions, and background on attendees.",
    },
    {
      heading: "Explain something complex",
      body: "Got a technical doc, a dense report, or a policy you need to understand? Paste it into Claude and say 'explain this to me like I'm new to the topic.'",
    },
    {
      heading: "Make Claude your editor",
      body: "Next time you write something important, paste it into Claude and ask: 'What's unclear? What's missing? What would make this stronger?' It's like having a thoughtful colleague review your work.",
    },
  ];
}

export default function KeepGoing({
  onComplete, onBack, onProgress, initialStep, onStepChange,
  onStartOver, templateName,
}) {
  const steps = [{ type: "intro" }, { type: "seeds" }, { type: "finale" }];

  return (
    <SectionShell
      sectionKey="keep_going"
      steps={steps}
      onBack={onBack}
      onProgress={onProgress}
      initialStep={initialStep}
      onStepChange={onStepChange}
      renderStep={({ step, advance, BackButton }) => {
        if (step.type === "intro") {
          return <IntroStep BackButton={BackButton} onNext={advance} />;
        }
        if (step.type === "seeds") {
          return <SeedsStep BackButton={BackButton} templateName={templateName} onNext={advance} />;
        }
        if (step.type === "finale") {
          return <FinaleStep BackButton={BackButton} onStartOver={onStartOver} />;
        }
        return null;
      }}
    />
  );
}

/* ━━━ Step 1: Intro ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function IntroStep({ BackButton, onNext }) {
  return (
    <div>
      {BackButton}
      <div style={{
        fontFamily: T.font.body, fontSize: 13, fontWeight: 500,
        letterSpacing: "0.08em", textTransform: "uppercase",
        color: T.color.copper, marginBottom: 10,
      }}>
        Keep going
      </div>
      <h2 style={{
        fontFamily: T.font.display, fontSize: "clamp(26px,5vw,34px)",
        fontWeight: 400, fontStyle: "italic", lineHeight: 1.3,
        margin: "0 0 12px 0", color: T.color.text,
      }}>
        You're just getting started.
      </h2>
      <p style={{
        fontSize: 16, color: T.color.textMuted, lineHeight: 1.7,
        margin: "0 0 8px 0",
      }}>
        You built your first prompt. Here are more ways Claude can help.
      </p>
      <ContinueButton onClick={onNext} label="Show me" />
    </div>
  );
}

/* ━━━ Step 2: Seed cards ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function SeedsStep({ BackButton, templateName, onNext }) {
  const seeds = getSeeds(templateName);

  return (
    <div>
      {BackButton}
      <h2 style={{
        fontFamily: T.font.display, fontSize: "clamp(24px,5vw,30px)",
        fontWeight: 400, fontStyle: "italic", lineHeight: 1.3,
        margin: "0 0 16px 0", color: T.color.text,
      }}>
        Six more ideas.
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {seeds.map((seed, i) => (
          <SeedCard key={i} seed={seed} index={i} />
        ))}
      </div>

      <ContinueButton onClick={onNext} label="Continue" />
    </div>
  );
}

function SeedCard({ seed, index }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 60 + index * 50);
    return () => clearTimeout(t);
  }, [index]);

  return (
    <div style={{
      padding: "14px 16px",
      background: T.color.bgCard,
      border: `1px solid ${T.color.border}`,
      borderRadius: 12,
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(8px)",
      transition: `all 0.5s ${T.ease.smooth}`,
    }}>
      <div style={{
        fontSize: 15, fontWeight: 500, color: T.color.text,
        marginBottom: 4,
      }}>
        {seed.heading}
      </div>
      <div style={{
        fontSize: 14, color: T.color.textMuted, lineHeight: 1.6,
      }}>
        {seed.body}
      </div>
    </div>
  );
}

/* ━━━ Step 3: Finale ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function FinaleStep({ BackButton, onStartOver }) {
  return (
    <div style={{ padding: "32px 0", textAlign: "center" }}>
      {BackButton}
      <SectionCelebration heroShapeIndex={4} intensity={3} />
      <h2 style={{
        fontFamily: T.font.display, fontSize: "clamp(28px,6vw,38px)",
        fontWeight: 400, fontStyle: "italic", lineHeight: 1.2,
        margin: "0 0 14px 0", color: T.color.text,
      }}>
        The future just got a little more legible.
      </h2>
      <p style={{
        fontSize: 16, color: T.color.textMuted, lineHeight: 1.7,
        margin: "0 auto 28px", maxWidth: 440,
      }}>
        You walked in wondering what AI could do for you. You're walking
        out with a tool that works. Keep going.
      </p>

      <a
        href="https://claude.ai"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          padding: "13px 28px",
          background: T.color.copper, color: "#fff",
          border: "none", borderRadius: 10,
          fontFamily: T.font.body, fontSize: 15, fontWeight: 500,
          textDecoration: "none", cursor: "pointer",
          transition: `all 0.35s ${T.ease.smooth}`,
        }}
      >
        Open Claude ↗
      </a>

      {onStartOver && (
        <div style={{ marginTop: 20 }}>
          <button
            onClick={onStartOver}
            style={{
              background: "none", border: "none", cursor: "pointer",
              color: T.color.textLight, fontFamily: T.font.body, fontSize: 14,
              textDecoration: "underline", textUnderlineOffset: 3,
            }}
          >
            Start over
          </button>
        </div>
      )}
    </div>
  );
}
