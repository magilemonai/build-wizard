import T from "../tokens.js";
import { useState, useCallback } from "react";
import SectionShell from "../components/SectionShell.jsx";
import SectionLabel from "../components/SectionLabel.jsx";
import GuidedStep from "../components/GuidedStep.jsx";
import SafetyInterstitial from "../components/SafetyInterstitial.jsx";
import ContinueButton from "../components/ContinueButton.jsx";
import OrganicShape from "../components/OrganicShape.jsx";

/* ━━━ Build steps: tailored prompts per project type ━━━━━━━━━━━━ */
function getBuildSteps(answers) {
  const idea = answers.project_idea || "my project";
  const isWork = answers.fork === "work";

  return [
    {
      id: "prompting",
      skillLabel: "Skill: Prompting well",
      title: "Your first prompt is a rough draft.",
      explanation:
        "Most people type one sentence and judge the result. " +
        "The skill is treating that first attempt as a starting point. " +
        "Give context, be specific about what you want, and then iterate. " +
        "Try it, read the output, refine, try again. That loop is the whole game.",
      tip: "Tell Claude who it's helping, what you need, and what good output looks like. The more specific you are, the less you'll need to fix.",
      prompt: isWork
        ? `I need help with: ${idea}\n\nHere's the context:\n- This is for my work\n- I do this task regularly\n- A good result would save me real time\n\nGive me a first draft of a tool or template for this. Then I'll tell you what to change.`
        : `I want to build something around: ${idea}\n\nHere's what I care about:\n- This is a personal interest\n- I want something I'd actually use, not a generic result\n- Surprise me with how specific you can get\n\nGive me a first draft. Then I'll tell you what to change.`,
      hint: "Read what Claude gives you. What's close? What's off? Tell it. That back-and-forth is the actual skill you're building.",
      showThinkingNote: true,
    },
    {
      id: "structured",
      skillLabel: "Skill: Structured output",
      title: "Tell it what shape you want the answer in.",
      explanation:
        "You've been prompting in paragraphs. But Claude can give you tables, templates, " +
        "checklists, step-by-step plans, even formatted data you can paste into a spreadsheet. " +
        "You're just telling it what container to put the answer in. " +
        "Same skill as prompting. It just looks a little more like code.",
      tip: "Ask for a specific format: a table, a numbered list, a template with blanks to fill in. Claude will match whatever structure you describe.",
      prompt: isWork
        ? `Take what you just created for "${idea}" and restructure it as:\n\n1. A one-paragraph summary at the top\n2. A table with columns for each key element\n3. A checklist of action items I can copy into my task manager\n\nKeep the same content, just organize it so I can actually use it at work.`
        : `Take the project you just built for me (about "${idea}") and repackage that exact output into three formats. Don't add new advice or content. Just restructure what you already gave me:\n\n1. A quick-reference card (the essentials from your output in a glanceable format)\n2. The key steps from your output as a simple table with columns\n3. Your top three recommendations from the output, ranked\n\nSame information you already wrote, just in more useful shapes.`,
      hint: "Compare this output to the first one. Same information, but now it's structured in a way you can actually use. That's the difference a good prompt makes.",
    },
    {
      id: "context",
      skillLabel: "Skill: Adding your context",
      title: "Teach Claude about your specific situation.",
      explanation:
        "Claude knows a lot about the world in general. " +
        "It knows nothing about your specific world: your preferences, your constraints, " +
        "your past experience, what worked and what didn't. " +
        "The more of that you share, the more useful the output gets. " +
        "This is where generic advice becomes personal advice.",
      tip: "Share real details: what you've tried before, what didn't work, constraints that matter. The model can't guess what you don't tell it.",
      prompt: isWork
        ? `Let me give you more context about "${idea}":\n\n- Here's how I currently handle this: [describe your current process briefly]\n- The part that takes the most time is: [the bottleneck]\n- I've tried improving it by: [what you've tried]\n- The constraints I'm working with are: [time, tools, team size, etc.]\n\nNow revise what you built to fit my actual situation. Be specific to what I just told you.`
        : `Let me give you more context about "${idea}":\n\n- My experience level with this is: [beginner/intermediate/etc.]\n- What I've already tried: [anything relevant]\n- What I'm specifically trying to achieve: [your goal]\n- Constraints that matter: [time, budget, space, equipment, etc.]\n\nNow revise what you built with all of this in mind. Make it genuinely mine, not generic.`,
      hint: "Notice how the output changed when you added real context. That's the difference between a template and a tool built for you.",
      showThinkingNote: true,
    },
  ];
}

function buildStepSequence(answers) {
  return [
    { type: "continuity" },
    { type: "build", index: 0 },
    { type: "build", index: 1 },
    { type: "safety", variant: answers.fork === "work" ? "work" : "personal" },
    { type: "build", index: 2 },
    { type: "anchor" },
  ];
}

/* ━━━ Catch-up prompt with copy button ━━━━━━━━━━━━━━━━━━━━━━━━━ */
function CatchUpPrompt({ idea }) {
  const [copied, setCopied] = useState(false);
  const text = `I'm building a project about ${idea}. We've been working on it together. Here's the best version so far: [paste your latest output]`;

  const handleCopy = useCallback(async () => {
    try { await navigator.clipboard.writeText(text); } catch {}
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [text]);

  return (
    <div style={{
      padding: "12px 14px",
      background: "rgba(44,41,37,0.05)",
      borderRadius: 8,
      position: "relative",
    }}>
      <div style={{
        fontFamily: "'Courier New', Courier, monospace",
        fontSize: 13, lineHeight: 1.6, color: T.color.text,
        paddingRight: 70,
      }}>
        {text}
      </div>
      <button
        onClick={handleCopy}
        style={{
          position: "absolute", top: 10, right: 10,
          padding: "5px 12px",
          background: copied ? T.color.sageSoft : T.color.bgCard,
          border: `1px solid ${copied ? T.color.sageBorder : T.color.border}`,
          borderRadius: 6,
          fontFamily: T.font.body, fontSize: 12,
          color: copied ? T.color.sage : T.color.textMuted,
          cursor: "pointer",
          transition: `all 0.2s ${T.ease.smooth}`,
        }}
      >
        {copied ? "✓ Copied" : "Copy"}
      </button>
    </div>
  );
}

/* ━━━ Foundation Section ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export default function Foundation({ answers, onComplete, onBack, onProgress }) {
  const buildSteps = getBuildSteps(answers);
  const steps = buildStepSequence(answers);
  const idea = answers.project_idea || "my project";

  return (
    <SectionShell
      steps={steps}
      onBack={onBack}
      onProgress={onProgress}
      renderStep={({ step, stepIndex, advance, goBack, BackButton }) => {
        if (!step) return null;

        if (step.type === "continuity") {
          return (
            <div>
              {BackButton}
              <SectionLabel>Section 3 · Foundation</SectionLabel>
              <h2 style={{
                fontFamily: T.font.display, fontSize: "clamp(26px,5vw,34px)",
                fontWeight: 400, lineHeight: 1.3, margin: "0 0 10px 0",
                color: T.color.text,
              }}>
                One important thing before we start.
              </h2>
              <p style={{
                fontSize: 16, color: T.color.textMuted,
                margin: "0 0 20px 0", lineHeight: 1.65,
              }}>
                From here on, each step builds on the last. Keep the same Claude
                conversation open in your other tab throughout this section. Each
                prompt refers to what you built in the previous step.
              </p>
              <div style={{
                padding: "16px 20px",
                background: T.color.bgCard,
                border: `2px solid ${T.color.copper}`,
                borderRadius: 12,
                marginBottom: 16,
              }}>
                <div style={{ fontSize: 14, fontWeight: 500, color: T.color.copper, marginBottom: 6 }}>
                  Lost your conversation?
                </div>
                <p style={{ fontSize: 14, color: T.color.textMuted, lineHeight: 1.6, margin: "0 0 10px 0" }}>
                  Start a new one and paste something like this to catch Claude up:
                </p>
                <CatchUpPrompt idea={idea} />
              </div>
              <ContinueButton onClick={advance} label="Got it, let's build" />
            </div>
          );
        }

        if (step.type === "build") {
          const s = buildSteps[step.index];
          return (
            <div>
              {BackButton}
              <GuidedStep
                skillLabel={s.skillLabel}
                title={s.title}
                explanation={s.explanation}
                tip={s.tip}
                prompt={s.prompt}
                hint={s.hint}
                showThinkingNote={s.showThinkingNote}
                onConfirm={advance}
              />
            </div>
          );
        }

        if (step.type === "safety") {
          // Both paths get hallucination awareness here (data handling moved to S2 for work)
          return (
            <div>
              {BackButton}
              <SafetyInterstitial title="AI gets things wrong confidently." onContinue={advance}>
                <p style={{ margin: "0 0 12px 0" }}>
                  If something in your output looked right but felt off, pay attention to that instinct.
                  These models fill gaps with plausible fiction and never flag it. They'll cite sources
                  that don't exist, give advice that sounds authoritative but is wrong, and present
                  guesses as facts.
                </p>
                <p style={{ margin: 0 }}>
                  This is called a hallucination. Your job: <strong>verify anything that matters.</strong>{" "}
                  That's not a limitation of the tool. That's the skill of using it well.
                </p>
              </SafetyInterstitial>
            </div>
          );
        }

        if (step.type === "anchor") {
          return (
            <div style={{ padding: "40px 0" }}>
              {BackButton}
              {/* Celebration */}
              <div style={{ position: "relative", height: 70, marginBottom: 16 }}>
                {[
                  { x: -80, y: -35, rot: -40, idx: 2, size: 8, color: T.color.copper },
                  { x: 65, y: -50, rot: 25, idx: 0, size: 7, color: T.color.sage },
                  { x: -45, y: -55, rot: -15, idx: 4, size: 6, color: `${T.color.copper}77` },
                  { x: 90, y: -25, rot: 45, idx: 3, size: 8, color: `${T.color.sage}77` },
                  { x: -100, y: -15, rot: -55, idx: 1, size: 6, color: T.color.copper },
                  { x: 35, y: -60, rot: 10, idx: 4, size: 5, color: T.color.sage },
                ].map((p, i) => (
                  <div key={i} style={{
                    position: "absolute", left: "50%", top: "60%",
                    "--scatter-to": `translate(${p.x}px, ${p.y}px)`,
                    "--scatter-rot": `${p.rot}deg`,
                    animation: `celebrateScatter 0.8s ${T.ease.smooth} ${i * 0.04}s both`,
                  }}>
                    <OrganicShape shapeIndex={p.idx} size={p.size} color={p.color} />
                  </div>
                ))}
                <div style={{
                  position: "absolute", bottom: 0, left: 0,
                  display: "flex", gap: 12, alignItems: "flex-end",
                }}>
                  {[
                    { idx: 2, size: 22, color: T.color.copper },
                    { idx: 4, size: 18, color: T.color.sage },
                    { idx: 0, size: 20, color: T.color.copper },
                    { idx: 3, size: 16, color: T.color.sage },
                  ].map((s, i) => (
                    <div key={i} style={{
                      animation: `celebrateBounce 0.7s ${T.ease.spring} ${0.25 + i * 0.08}s both, celebrateFloat 3s ease-in-out ${1.0 + i * 0.3}s infinite`,
                    }}>
                      <OrganicShape shapeIndex={s.idx} size={s.size} color={s.color} />
                    </div>
                  ))}
                </div>
              </div>
              <h2 style={{
                fontFamily: T.font.display, fontSize: "clamp(26px,5vw,34px)",
                fontWeight: 400, fontStyle: "italic", lineHeight: 1.3,
                color: T.color.text, margin: "0 0 12px 0",
              }}>
                You've got a working first draft.
              </h2>
              <p style={{ fontSize: 16, color: T.color.textMuted, lineHeight: 1.7, maxWidth: 480, margin: "0 0 8px" }}>
                Prompted with context, shaped the output, and made it yours.
                Those three moves work for any project in any AI tool.
              </p>
              <p style={{ fontSize: 15, color: T.color.textMuted, lineHeight: 1.6, maxWidth: 480 }}>
                Another good stopping point. You've got a real project draft and the
                core prompting skills to keep improving it. The next section levels it
                up with system prompts and multi-step workflows.
              </p>
              <ContinueButton onClick={onComplete} label="Level up" />
            </div>
          );
        }

        return null;
      }}
    />
  );
}
