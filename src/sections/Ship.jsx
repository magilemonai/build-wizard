import { useState, useEffect, useRef } from "react";
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
        fontFamily: T.font.display, fontSize: "clamp(26px,5vw,34px)",
        fontWeight: 400, lineHeight: 1.3, margin: "0 0 10px 0",
        color: T.color.text,
      }}>
        Let's walk through what you built.
      </h2>
      <p style={{
        fontSize: 16, color: T.color.textMuted,
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
        fontSize: 14, color: T.color.textMuted,
        marginTop: 14, lineHeight: 1.6,
        fontStyle: "italic",
      }}>
        This review habit takes 30 seconds and catches the things you'd miss. Every time. Not paranoia. Just practice.
      </p>
    </div>
  );
}

/* ━━━ Save & Share Step ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function SaveShareStep({ answers, onContinue, BackButton }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), 100); }, []);

  return (
    <div style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(12px)",
      transition: `all 0.5s ${T.ease.smooth}`,
    }}>
      {BackButton}
      <h2 style={{
        fontFamily: T.font.display, fontSize: "clamp(26px,5vw,34px)",
        fontWeight: 400, lineHeight: 1.3, margin: "0 0 10px 0",
        color: T.color.text,
      }}>
        Save your work. Share it if you want.
      </h2>
      <p style={{
        fontSize: 16, color: T.color.textMuted,
        margin: "0 0 24px 0", lineHeight: 1.65,
      }}>
        Conversations can expire or get lost. Before you close that tab, take
        a moment to save what you built somewhere durable.
      </p>

      <div style={{
        background: T.color.bgCard,
        border: `1.5px solid ${T.color.border}`,
        borderRadius: 14,
        padding: "20px 24px",
        marginBottom: 16,
      }}>
        <div style={{ fontSize: 15, fontWeight: 500, color: T.color.text, marginBottom: 12 }}>
          How to save your project
        </div>
        {[
          "In your Claude conversation, find the artifact or response with your best output",
          "Click the copy icon on that response, or use the \"Publish\" option on any artifact to get a shareable link",
          "Save the link or paste the content into a doc you'll find again",
        ].map((step, i) => (
          <div key={i} style={{
            display: "flex", gap: 10, padding: "6px 0",
            fontSize: 14, color: T.color.textMuted, lineHeight: 1.55,
          }}>
            <span style={{ color: T.color.copper, fontWeight: 500, flexShrink: 0 }}>{i + 1}.</span>
            {step}
          </div>
        ))}
      </div>

      <div style={{
        background: T.color.copperSoft,
        border: `1px solid rgba(191,123,94,0.15)`,
        borderRadius: 12,
        padding: "16px 20px",
        marginBottom: 24,
      }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: T.color.copper, marginBottom: 6 }}>
          Want to share what you built?
        </div>
        <p style={{ fontSize: 14, color: T.color.textMuted, lineHeight: 1.6, margin: 0 }}>
          If Claude created an artifact, click the copy icon on it, then select
          "Publish" from the dropdown. That gives you a public URL you can send
          to anyone. You built something worth showing off.
        </p>
      </div>

      <ContinueButton onClick={onContinue} label="Continue to reflection" />
    </div>
  );
}

/* ━━━ Reflection Screen ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function ReflectionScreen({ answers, onContinue, BackButton }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), 100); }, []);

  const level = answers.experience || "tried";
  const isWork = answers.fork === "work";

  const skills = [
    "Prompted with context and iterated on the result",
    "Requested structured output (tables, checklists, templates)",
    "Taught Claude about your specific situation",
    "Used system prompts to set persistent context",
    "Applied the draft-critique-revise workflow",
    "Reviewed AI output before using it",
  ];

  return (
    <div style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(12px)",
      transition: `all 0.5s ${T.ease.smooth}`,
    }}>
      {BackButton}
      <h2 style={{
        fontFamily: T.font.display, fontSize: "clamp(26px,5vw,34px)",
        fontWeight: 400, fontStyle: "italic", lineHeight: 1.3,
        color: T.color.text, margin: "0 0 16px 0",
      }}>
        Look at what you just did.
      </h2>
      <p style={{
        fontSize: 16, color: T.color.textMuted,
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
        {skills.map((skill, i) => (
          <div key={skill} style={{
            display: "flex", alignItems: "flex-start", gap: 10,
            padding: "8px 0",
            borderBottom: i < skills.length - 1 ? `1px solid ${T.color.border}` : "none",
          }}>
            <span style={{
              color: T.color.sage, fontSize: 14, lineHeight: "22px", flexShrink: 0,
            }}>✓</span>
            <span style={{ fontSize: 14, color: T.color.text, lineHeight: 1.55 }}>
              {skill}
            </span>
          </div>
        ))}
      </div>

      <p style={{ fontSize: 16, color: T.color.textMuted, lineHeight: 1.65, margin: 0 }}>
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

  if (isComfortable) {
    nextSteps.push({
      title: "Explore agents, APIs, and MCP",
      body: "You've used Claude in conversation. The next level: agents that take actions autonomously, APIs that integrate Claude into your own tools, and MCP (Model Context Protocol) that connects Claude to your data sources. Search for 'Claude API quickstart' or 'MCP servers' to get started.",
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
        fontFamily: T.font.display, fontSize: "clamp(26px,5vw,34px)",
        fontWeight: 400, fontStyle: "italic", lineHeight: 1.3,
        color: T.color.text, margin: "0 0 8px 0",
      }}>
        Where to go from here.
      </h2>
      <p style={{
        fontSize: 16, color: T.color.textMuted,
        margin: "0 0 24px 0", lineHeight: 1.65,
      }}>
        You don't need a roadmap. You have the loop: try, evaluate, refine, expand.
        But here are a few specific things worth doing next.
      </p>

      {nextSteps.map((step) => (
        <div key={step.title} style={{
          background: T.color.bgCard,
          border: `1.5px solid ${T.color.border}`,
          borderRadius: 12,
          padding: "18px 20px",
          marginBottom: 12,
        }}>
          <div style={{ fontSize: 15, fontWeight: 500, color: T.color.text, marginBottom: 4, fontFamily: T.font.body }}>
            {step.title}
          </div>
          <div style={{ fontSize: 14, color: T.color.textMuted, lineHeight: 1.6 }}>
            {step.body}
          </div>
        </div>
      ))}

      {/* ── Visual climax ── */}
      <FinaleScreen />
    </div>
  );
}

/* ━━━ Finale: scroll-triggered shapes + closing ━━━━━━━━━━━━━━━━ */
function FinaleScreen() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} style={{
      textAlign: "center", marginTop: 48, paddingTop: 36,
      borderTop: `1px solid ${T.color.border}`,
    }}>
      {/* The big finale: scatter + bounce + float */}
      <div style={{ position: "relative", height: 100, marginBottom: 24 }}>
        {/* Scatter particles */}
        {visible && [
          { x: -130, y: -50, rot: -55, idx: 0, size: 12, color: T.color.copper },
          { x: 110, y: -60, rot: 40, idx: 1, size: 10, color: T.color.sage },
          { x: -70, y: -75, rot: -20, idx: 4, size: 8, color: `${T.color.copper}88` },
          { x: 140, y: -35, rot: 60, idx: 2, size: 11, color: T.color.sage },
          { x: -150, y: -25, rot: -70, idx: 3, size: 12, color: `${T.color.sage}88` },
          { x: 60, y: -80, rot: 15, idx: 0, size: 7, color: T.color.copper },
          { x: -40, y: -70, rot: -35, idx: 4, size: 9, color: `${T.color.sage}66` },
          { x: 120, y: -50, rot: 50, idx: 1, size: 8, color: `${T.color.copper}66` },
          { x: -100, y: -60, rot: -45, idx: 2, size: 6, color: T.color.copper },
          { x: 30, y: -72, rot: 8, idx: 3, size: 7, color: T.color.sage },
          { x: -20, y: -82, rot: -10, idx: 0, size: 5, color: `${T.color.copper}55` },
          { x: 90, y: -68, rot: 35, idx: 4, size: 6, color: `${T.color.sage}55` },
        ].map((p, i) => (
          <div key={`s-${i}`} style={{
            position: "absolute", left: "50%", top: "65%",
            "--scatter-to": `translate(${p.x}px, ${p.y}px)`,
            "--scatter-rot": `${p.rot}deg`,
            animation: `celebrateScatter 1s ${T.ease.smooth} ${i * 0.03}s both`,
          }}>
            <OrganicShape shapeIndex={p.idx} size={p.size} color={p.color} />
          </div>
        ))}
        {/* Main shapes: bounce in and float */}
        <div style={{
          position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)",
          display: "flex", gap: 16, alignItems: "flex-end",
        }}>
          {sectionShapes.map((shapeIdx, i) => (
            <div key={shapeIdx} style={{
              opacity: visible ? 1 : 0,
              animation: visible
                ? `celebrateBounce 0.8s ${T.ease.spring} ${0.3 + i * 0.1}s both, celebrateFloat 3s ease-in-out ${1.5 + i * 0.25}s infinite`
                : "none",
            }}>
              <OrganicShape
                shapeIndex={shapeIdx}
                size={i === 2 ? 36 : i === 4 ? 32 : 26}
                color={i % 2 === 0 ? T.color.copper : T.color.sage}
              />
            </div>
          ))}
        </div>
      </div>
      <h2 style={{
        fontFamily: T.font.display, fontSize: 30,
        fontWeight: 400, fontStyle: "italic", lineHeight: 1.3,
        color: T.color.text, margin: "0 0 12px 0",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
        transition: `all 0.6s ${T.ease.smooth} 0.7s`,
      }}>
        You built something real.
      </h2>
      <p style={{
        fontSize: 16, color: T.color.textMuted,
        lineHeight: 1.65, maxWidth: 400, margin: "0 auto 32px",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(12px)",
        transition: `all 0.5s ${T.ease.smooth} 0.9s`,
      }}>
        That was the whole promise. Everything from here is refinement and ambition.
      </p>

      <div style={{
        opacity: visible ? 1 : 0,
        transition: `opacity 0.5s ${T.ease.smooth} 1.1s`,
      }}>
        <a
          href="https://claude.ai"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "14px 32px",
            background: T.color.copper,
            color: "#fff",
            border: "none", borderRadius: 10, fontFamily: T.font.body,
            fontSize: 16, fontWeight: 500, textDecoration: "none",
            letterSpacing: "0.01em",
          }}
        >
          Open Claude →
        </a>

        <div style={{
          marginTop: 32, display: "flex", justifyContent: "center",
          gap: 24, fontSize: 14, fontFamily: T.font.body,
        }}>
          <button
            onClick={() => { if (window.__restart) window.__restart(); }}
            style={{
              background: "none", border: "none", cursor: "pointer",
              color: T.color.textLight, fontFamily: T.font.body, fontSize: 14,
              textDecoration: "underline", textUnderlineOffset: 3,
            }}
          >
            Start over
          </button>
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: "Build Something Real with AI", url: window.location.href });
              } else {
                navigator.clipboard?.writeText(window.location.href);
              }
            }}
            style={{
              background: "none", border: "none", cursor: "pointer",
              color: T.color.textLight, fontFamily: T.font.body, fontSize: 14,
              textDecoration: "underline", textUnderlineOffset: 3,
            }}
          >
            Share with a friend
          </button>
        </div>
      </div>
    </div>
  );
}

/* ━━━ Step sequence ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function buildStepSequence() {
  return [
    { type: "review" },
    { type: "safety" },
    { type: "saveshare" },
    { type: "reflection" },
    { type: "nextsteps" },
  ];
}

/* ━━━ Ship Section ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export default function Ship({ answers, onBack, onProgress }) {
  const steps = buildStepSequence();

  return (
    <SectionShell
      steps={steps}
      onBack={onBack}
      onProgress={onProgress}
      renderStep={({ step, advance, BackButton }) => {
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

        if (step.type === "saveshare") {
          return <SaveShareStep answers={answers} onContinue={advance} BackButton={BackButton} />;
        }

        if (step.type === "reflection") {
          return <ReflectionScreen answers={answers} onContinue={advance} BackButton={BackButton} />;
        }

        if (step.type === "nextsteps") {
          return <NextStepsScreen answers={answers} BackButton={BackButton} />;
        }

        return null;
      }}
    />
  );
}
