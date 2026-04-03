import { useState, useEffect } from "react";
import T from "../tokens.js";
import SectionShell from "../components/SectionShell.jsx";
import SectionLabel from "../components/SectionLabel.jsx";
import SafetyInterstitial from "../components/SafetyInterstitial.jsx";
import ContinueButton from "../components/ContinueButton.jsx";
import PromptCard from "../components/PromptCard.jsx";
import OrganicShape, { sectionShapes } from "../components/OrganicShape.jsx";

/* ━━━ Review Step ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function ReviewStep({ answers, onConfirm, BackButton }) {
  const idea = answers.project_idea || "my project";
  return (
    <div>
      {BackButton}
      <SectionLabel>Section 5 · Ship</SectionLabel>
      <h2 style={{
        fontFamily: T.font.display, fontSize: "clamp(24px,5vw,30px)",
        fontWeight: 400, lineHeight: 1.3, margin: "0 0 8px 0",
        color: T.color.text,
      }}>
        Let's walk through what you built.
      </h2>
      <p style={{
        fontSize: 15, color: T.color.textMuted,
        margin: "0 0 4px 0", lineHeight: 1.65,
      }}>
        Before you take this with you, one more habit to build: reviewing your work.
        You don't need to understand every line. You need to understand what it does,
        what it has access to, and what could go wrong.
      </p>
      <PromptCard
        prompt={`Let's review what we've built for "${idea}".\n\nGive me a plain-language walkthrough:\n1. What does this project actually do, in one paragraph?\n2. What information did I share with you to build it?\n3. If I wanted to share this with someone else, what should I double-check first?\n4. What's the one thing most likely to need updating over time?`}
        context="One last prompt in Claude:"
        outcomeLabels={{ worked: "Review done", snag: "Hit a snag", skip: "Skip review" }}
        onConfirm={onConfirm}
      />
      <p style={{
        fontSize: 13, color: T.color.textLight,
        marginTop: 12, lineHeight: 1.6,
      }}>
        This review habit takes 30 seconds and catches the things you'd miss. Every time. Not paranoia. Just practice.
      </p>
    </div>
  );
}

/* ━━━ Reflection Screen ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function ReflectionScreen({ answers, outcomes, onContinue, BackButton }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), 100); }, []);

  const level = answers.experience || "tried";
  const isWork = answers.fork === "work";

  // Dynamic checklist: all skills are listed but marked as done/skipped
  const allSkills = [
    { text: "Prompted with context and iterated on the result", section: "foundation" },
    { text: "Requested structured output (tables, checklists, templates)", section: "foundation" },
    { text: "Taught Claude about your specific situation", section: "foundation" },
    { text: "Used system prompts to set persistent context", section: "powerup" },
    { text: "Applied the draft-critique-revise workflow", section: "powerup" },
    { text: "Reviewed AI output before using it", section: "ship" },
  ];

  return (
    <div style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(12px)",
      transition: `all 0.5s ${T.ease.smooth}`,
    }}>
      {BackButton}
      <h2 style={{
        fontFamily: T.font.display, fontSize: "clamp(26px,5vw,32px)",
        fontWeight: 400, fontStyle: "italic", lineHeight: 1.3,
        color: T.color.text, margin: "0 0 16px 0",
      }}>
        Look at what you just did.
      </h2>
      <p style={{
        fontSize: 15, color: T.color.textMuted,
        margin: "0 0 24px 0", lineHeight: 1.65,
      }}>
        This wasn't just a Claude tutorial. Every skill you practiced works in any AI tool.
        If you switch to GPT, Gemini, or whatever comes next, everything here still applies.
      </p>

      <div style={{
        background: T.color.bgCard,
        border: `1.5px solid ${T.color.border}`,
        borderRadius: 14,
        padding: "20px 24px",
        marginBottom: 24,
      }}>
        {allSkills.map((skill, i) => {
          const skipped = outcomes?.[skill.section] === "skip";
          return (
            <div key={i} style={{
              display: "flex", alignItems: "flex-start", gap: 10,
              padding: "8px 0",
              borderBottom: i < allSkills.length - 1 ? `1px solid ${T.color.border}` : "none",
              opacity: skipped ? 0.5 : 1,
            }}>
              <span style={{
                color: skipped ? T.color.textLight : T.color.sage,
                fontSize: 14, lineHeight: "22px", flexShrink: 0,
              }}>{skipped ? "–" : "✓"}</span>
              <span style={{
                fontSize: 14,
                color: skipped ? T.color.textLight : T.color.text,
                lineHeight: 1.55,
                textDecoration: skipped ? "line-through" : "none",
              }}>{skill.text}</span>
            </div>
          );
        })}
      </div>

      <p style={{ fontSize: 15, color: T.color.textMuted, lineHeight: 1.65, margin: 0 }}>
        {level === "never" || level === "tried"
          ? "A few hours ago, you hadn't really used AI. Now you have a project, a process, and the safety habits to do this responsibly. That's a big shift."
          : isWork
          ? "You turned a vague sense of 'I should use AI more' into a real tool for real work. The gap between knowing about AI and using it well just closed."
          : "You went from occasional use to a structured approach with real techniques. The difference between poking at AI and using it well is exactly what you just practiced."
        }
      </p>

      <ContinueButton onClick={onContinue} label="What's next" />
    </div>
  );
}

/* ━━━ Next Steps + Closing Screen ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function NextStepsScreen({ answers, BackButton }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), 100); }, []);

  const isWork = answers.fork === "work";
  const isComfortable = answers.code_feeling === "comfortable" || answers.code_feeling === "indifferent";

  const nextSteps = [
    {
      title: "Keep iterating on your project",
      body: "What you built today is a first version. Open Claude tomorrow and push it further. Add edge cases, refine the output, make it handle your real-world messiness.",
    },
  ];

  if (isComfortable) {
    nextSteps.push({
      title: "Try Claude Code",
      body: "You're comfortable with code. Claude Code lets you work directly in your terminal: edit files, run commands, build full projects. It's the same prompting, just with more leverage.",
    });
  } else {
    nextSteps.push({
      title: "Try the same task in a different tool",
      body: "Run your best prompt through GPT or Gemini. Compare the results. Notice where each model is stronger. This builds your judgment about which tool to reach for.",
    });
  }

  if (isWork) {
    nextSteps.push({
      title: "Share what you learned with your team",
      body: "You now know more about practical AI use than most of your colleagues. The safety habits especially. Consider sharing the review-before-run and data handling practices with your team.",
    });
  } else {
    nextSteps.push({
      title: "Build something for someone else",
      body: "The best way to deepen a skill is to teach it. Take what you learned and help a friend build their first AI project. You'll be surprised how much you retained.",
    });
  }

  nextSteps.push({
    title: "Monthly check-in",
    body: "Your AI usage will grow. Your data footprint grows with it. Once a month, take five minutes: review what tools have access to what, check your privacy settings, make sure your practices still match your current needs.",
  });

  return (
    <div style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(12px)",
      transition: `all 0.5s ${T.ease.smooth}`,
    }}>
      {BackButton}
      <h2 style={{
        fontFamily: T.font.display, fontSize: "clamp(24px,5vw,30px)",
        fontWeight: 400, fontStyle: "italic", lineHeight: 1.3,
        color: T.color.text, margin: "0 0 8px 0",
      }}>
        Where to go from here.
      </h2>
      <p style={{
        fontSize: 15, color: T.color.textMuted,
        margin: "0 0 24px 0", lineHeight: 1.65,
      }}>
        You don't need a roadmap. You have the loop: try, evaluate, refine, expand.
        But here are a few specific things worth doing next.
      </p>

      {nextSteps.map((step, i) => (
        <div key={step.title} style={{
          background: T.color.bgCard,
          border: `1.5px solid ${T.color.border}`,
          borderRadius: 12,
          padding: "18px 20px",
          marginBottom: 12,
        }}>
          <div style={{ fontSize: 14, fontWeight: 500, color: T.color.text, marginBottom: 4, fontFamily: T.font.body }}>
            {step.title}
          </div>
          <div style={{ fontSize: 13, color: T.color.textMuted, lineHeight: 1.6 }}>
            {step.body}
          </div>
        </div>
      ))}

      {/* ── Visual climax: shapes return ── */}
      <div style={{
        textAlign: "center", marginTop: 48, paddingTop: 36,
        borderTop: `1px solid ${T.color.border}`,
      }}>
        <div style={{
          display: "flex", justifyContent: "center", gap: 12,
          marginBottom: 20,
        }}>
          {sectionShapes.map((shapeIdx, i) => (
            <div key={i} style={{
              opacity: 0,
              animation: `softFadeUp 0.4s ${T.ease.smooth} ${0.2 + i * 0.12}s both`,
            }}>
              <OrganicShape
                shapeIndex={shapeIdx}
                size={i === 4 ? 22 : 18}
                color={T.color.sage}
              />
            </div>
          ))}
        </div>
        <h2 style={{
          fontFamily: T.font.display, fontSize: 26,
          fontWeight: 400, fontStyle: "italic", lineHeight: 1.3,
          color: T.color.text, margin: "0 0 10px 0",
        }}>
          You built something real.
        </h2>
        <p style={{
          fontSize: 14, color: T.color.textMuted,
          lineHeight: 1.65, maxWidth: 380, margin: "0 auto 28px",
        }}>
          That was the whole promise. Everything from here is refinement and ambition.
        </p>

        {/* Closing action */}
        <a
          href="https://claude.ai"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "13px 28px",
            background: T.color.copper,
            color: "#fff",
            border: "none", borderRadius: 10, fontFamily: T.font.body,
            fontSize: 15, fontWeight: 500, textDecoration: "none",
            letterSpacing: "0.01em",
          }}
        >
          Open Claude →
        </a>
      </div>
    </div>
  );
}

/* ━━━ Step sequence ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function buildStepSequence() {
  return [
    { type: "review" },
    { type: "safety" },
    { type: "reflection" },
    { type: "nextsteps" },
  ];
}

/* ━━━ Ship Section ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export default function Ship({ answers, onBack, onProgress }) {
  const steps = buildStepSequence();
  // Track exercise outcomes for dynamic checklist
  const [outcomes] = useState({});

  return (
    <SectionShell
      steps={steps}
      onBack={onBack}
      onProgress={onProgress}
      renderStep={({ step, stepIndex, advance, goBack, BackButton }) => {
        if (!step) return null;

        if (step.type === "review") {
          return <ReviewStep answers={answers} onConfirm={advance} BackButton={BackButton} />;
        }

        if (step.type === "safety") {
          return (
            <div>
              {BackButton}
              <SafetyInterstitial title="The long game." onContinue={advance}>
                <p style={{ margin: "0 0 12px 0" }}>
                  Your AI usage will grow from here. Your data footprint grows with it.
                  The habits you built today (reviewing output, checking permissions, verifying
                  facts) aren't just for beginners. They're the ongoing practice of using these
                  tools well.
                </p>
                <p style={{ margin: 0 }}>
                  <strong style={{ color: T.color.text }}>Monthly audit:</strong>{" "}
                  Check what tools have access to what. Review your privacy settings.
                  Make sure your practices match your current risk level, not the one from
                  six months ago. Five minutes, once a month. That's the habit that scales.
                </p>
              </SafetyInterstitial>
            </div>
          );
        }

        if (step.type === "reflection") {
          return <ReflectionScreen answers={answers} outcomes={outcomes} onContinue={advance} BackButton={BackButton} />;
        }

        if (step.type === "nextsteps") {
          return <NextStepsScreen answers={answers} BackButton={BackButton} />;
        }

        return null;
      }}
    />
  );
}
