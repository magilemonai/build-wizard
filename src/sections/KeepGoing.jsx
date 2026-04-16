import { useState, useEffect } from "react";
import T from "../tokens.js";
import SectionShell from "../components/SectionShell.jsx";
import ContinueButton from "../components/ContinueButton.jsx";
import SectionCelebration from "../components/SectionCelebration.jsx";
import OrganicShape, { sectionShapes } from "../components/OrganicShape.jsx";

/* ━━━ Stage 6: Keep Going ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Four steps: intro → seeds → recap → finale. The recap is the
   shareable moment: a single polished card designed to be
   screenshotted and pasted into Slack/chat.
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

/* ── Feature id → display name ──────────────────────────────────── */
const FEATURE_DISPLAY = {
  artifacts: "Artifacts",
  model_selection: "Model Selection",
  extended_thinking: "Extended Thinking",
  research: "Research",
  projects: "Projects",
  memory: "Memory",
};

export default function KeepGoing({
  onComplete, onBack, onProgress, initialStep, onStepChange,
  onStartOver,
  selectedTemplate, assembledPrompt, startedAt,
}) {
  const steps = [{ type: "intro" }, { type: "seeds" }, { type: "recap" }, { type: "finale" }];

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
          return (
            <SeedsStep
              BackButton={BackButton}
              templateName={selectedTemplate?.name}
              onNext={advance}
            />
          );
        }
        if (step.type === "recap") {
          return (
            <RecapStep
              BackButton={BackButton}
              template={selectedTemplate}
              assembledPrompt={assembledPrompt}
              startedAt={startedAt}
              onNext={advance}
            />
          );
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

/* ━━━ Step 3: Recap (shareable card) ━━━━━━━━━━━━━━━━━━━━━━━━━━━
   A single, polished card framed by all five organic shapes doing
   gentle ambient motion. Designed to be screenshotted.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function RecapStep({ BackButton, template, assembledPrompt, startedAt, onNext }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  const minutesSpent = computeMinutesSpent(startedAt);
  const promptExcerpt = excerptPrompt(assembledPrompt, 3);
  const features = template?.features || [];

  return (
    <div>
      {BackButton}
      <h2 style={{
        fontFamily: T.font.display, fontSize: "clamp(24px,5vw,30px)",
        fontWeight: 400, fontStyle: "italic", lineHeight: 1.3,
        margin: "0 0 8px 0", color: T.color.text,
      }}>
        One more thing.
      </h2>
      <p style={{
        fontSize: 15, color: T.color.textMuted, lineHeight: 1.65,
        margin: "0 0 20px 0",
      }}>
        Here's your recap. Screenshot this and share it with your team,
        or save it for yourself.
      </p>

      {/* Card wrapper with decorative shape frame */}
      <div style={{
        position: "relative",
        padding: "0",
        marginBottom: 24,
      }}>
        <ShapeFrame />

        <article style={{
          position: "relative", zIndex: 1,
          background: T.color.bgCard,
          border: `1px solid ${T.color.border}`,
          borderRadius: 16,
          padding: "28px 24px",
          boxShadow: `0 4px 24px ${T.color.shadow}, 0 1px 3px ${T.color.shadowMed}`,
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(10px)",
          transition: `all 0.6s ${T.ease.smooth}`,
        }}>
          <div style={{
            fontFamily: T.font.body, fontSize: 12, fontWeight: 500,
            letterSpacing: "0.08em", textTransform: "uppercase",
            color: T.color.copper, marginBottom: 8,
          }}>
            Your first build
          </div>
          <h3 style={{
            fontFamily: T.font.display, fontSize: "clamp(26px,5vw,32px)",
            fontWeight: 400, fontStyle: "italic", lineHeight: 1.2,
            margin: "0 0 8px 0", color: T.color.text,
          }}>
            {template?.name || "Your Claude prompt"}
          </h3>
          {template?.oneLiner && (
            <p style={{
              fontSize: 15, color: T.color.textMuted, lineHeight: 1.55,
              margin: "0 0 22px 0",
            }}>
              {template.oneLiner}
            </p>
          )}

          {/* What you built */}
          <RecapSection label="What you built">
            <div style={{
              fontFamily: "'Courier New', Courier, monospace",
              fontSize: 13, lineHeight: 1.65, color: T.color.text,
              whiteSpace: "pre-wrap", wordBreak: "break-word",
              background: T.color.bgSubtle,
              border: `1px solid ${T.color.border}`,
              borderRadius: 8,
              padding: "10px 12px",
            }}>
              {promptExcerpt || "(your prompt)"}
            </div>
          </RecapSection>

          {/* Claude skills unlocked */}
          {features.length > 0 && (
            <RecapSection label="Claude skills unlocked">
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {features.map((id) => (
                  <span key={id} style={{
                    display: "inline-block",
                    padding: "4px 10px",
                    background: T.color.sageSoft,
                    border: `1px solid ${T.color.sageBorder}`,
                    borderRadius: 20,
                    fontSize: 12, fontWeight: 500,
                    color: T.color.sage,
                    fontFamily: T.font.body, letterSpacing: "0.02em",
                  }}>
                    {FEATURE_DISPLAY[id] || id}
                  </span>
                ))}
              </div>
            </RecapSection>
          )}

          {/* Time spent */}
          {minutesSpent !== null && (
            <RecapSection label="Time spent">
              <div style={{
                fontSize: 15, color: T.color.text,
                fontFamily: T.font.body,
              }}>
                {minutesSpent} {minutesSpent === 1 ? "minute" : "minutes"}
              </div>
            </RecapSection>
          )}

          {/* Foxfire mark */}
          <div style={{
            marginTop: 22,
            paddingTop: 14,
            borderTop: `1px solid ${T.color.border}`,
            display: "flex", alignItems: "center", justifyContent: "space-between",
            gap: 12,
          }}>
            <span style={{
              fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase",
              color: T.color.textLight, fontFamily: T.font.body,
            }}>
              Built with Foxfire
            </span>
            <OrganicShape shapeIndex={4} size={10} color={T.color.copper} />
          </div>
        </article>
      </div>

      {/* Action buttons */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
        <button
          onClick={() => { /* hint only — user screenshots manually */ }}
          style={{
            padding: "11px 22px",
            background: "transparent",
            color: T.color.textMuted,
            border: `1px solid ${T.color.border}`,
            borderRadius: 10,
            fontFamily: T.font.body, fontSize: 14, fontWeight: 500,
            cursor: "pointer",
            letterSpacing: "0.01em",
          }}
        >
          Screenshot this
        </button>
        <ContinueButton onClick={onNext} label="Continue to finish" />
      </div>
    </div>
  );
}

/* ── Compact section block inside the recap card ────────────────── */
function RecapSection({ label, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{
        fontSize: 11, fontWeight: 500,
        letterSpacing: "0.08em", textTransform: "uppercase",
        color: T.color.sage, marginBottom: 6,
      }}>
        {label}
      </div>
      {children}
    </div>
  );
}

/* ── Decorative shape frame around the recap card ───────────────── */
function ShapeFrame() {
  // Positioned absolutely around (and slightly behind) the card.
  // Each shape has its own gentle spin + float timing so the
  // group feels alive without pulling focus from the text.
  const positions = [
    { shape: sectionShapes[0], top: -14, left: -10,  size: 22, color: T.color.copper,        spin: 18, delay: 0,   float: 4.5 },
    { shape: sectionShapes[1], top: -18, right: 8,   size: 18, color: T.color.sage,          spin: 14, delay: 1.3, float: 5.2 },
    { shape: sectionShapes[2], bottom: -12, left: 18, size: 20, color: T.color.copper,       spin: 16, delay: 0.7, float: 4.9 },
    { shape: sectionShapes[3], bottom: -14, right: -8, size: 24, color: T.color.sage,        spin: 20, delay: 2.1, float: 5.5 },
    { shape: sectionShapes[4], top: "42%", right: -14, size: 14, color: T.color.copper,      spin: 12, delay: 1.7, float: 6.0 },
  ];

  return (
    <div style={{
      position: "absolute", inset: -8,
      pointerEvents: "none",
    }}>
      {positions.map((p, i) => (
        <div key={i} style={{
          position: "absolute",
          top: p.top, bottom: p.bottom, left: p.left, right: p.right,
          animation: `snakeWave ${p.float}s ease-in-out ${p.delay}s infinite`,
        }}>
          <div style={{
            animation: `gentleSpin ${p.spin}s linear ${p.delay}s infinite`,
            lineHeight: 0,
          }}>
            <OrganicShape shapeIndex={p.shape} size={p.size} color={p.color} />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Helpers ────────────────────────────────────────────────────── */
function computeMinutesSpent(startedAt) {
  if (!startedAt || typeof startedAt !== "number") return null;
  const ms = Date.now() - startedAt;
  if (ms < 0) return null;
  const mins = Math.max(1, Math.round(ms / 60000));
  return mins;
}

/** Take the first N non-empty lines of the assembled prompt. */
function excerptPrompt(prompt, lineCount = 3) {
  if (!prompt || typeof prompt !== "string") return "";
  const lines = prompt.split("\n").map((l) => l.trim()).filter(Boolean);
  const slice = lines.slice(0, lineCount);
  const excerpt = slice.join("\n");
  return lines.length > lineCount ? `${excerpt}\n…` : excerpt;
}

/* ━━━ Step 4: Finale ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function FinaleStep({ BackButton, onStartOver }) {
  return (
    <div style={{ padding: "32px 0", textAlign: "center" }}>
      {BackButton}
      <SectionCelebration heroShapeIndex={4} variant="finale" />
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
