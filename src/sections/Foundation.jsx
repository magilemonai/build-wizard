import T from "../tokens.js";
import { useState, useCallback, useRef, useEffect } from "react";
import SectionShell from "../components/SectionShell.jsx";
import GuidedStep from "../components/GuidedStep.jsx";
import SafetyInterstitial from "../components/SafetyInterstitial.jsx";
import ContinueButton from "../components/ContinueButton.jsx";
import SectionCelebration from "../components/SectionCelebration.jsx";

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
      prompt: isWork
        ? `I need help with: ${idea}\n\nHere's the context:\n- This is for my work\n- I do this task regularly\n- A good result would save me real time\n\nGive me a first draft of a tool or template for this. Then I'll tell you what to change.`
        : `I want to build something around: ${idea}\n\nHere's what I care about:\n- This is a personal interest\n- I want something I'd actually use, not a generic result\n- Surprise me with how specific you can get\n\nGive me a first draft. Then I'll tell you what to change.`,
      hint: "Read what Claude gives you. What's close? What's off? Tell it. That back-and-forth is the actual skill you're building.",
      showThinkingNote: true,
      coachingNote: "Before you click anything: what's useful in the output? What feels generic? That judgment is the skill you're building.",
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
      prompt: isWork
        ? `Take what you just created for "${idea}" and restructure it as:\n\n1. A one-paragraph summary at the top\n2. A table with columns for each key element\n3. A checklist of action items I can copy into my task manager\n\nKeep the same content, just organize it so I can actually use it at work.`
        : `Take the project you just built for me (about "${idea}") and repackage that exact output into three formats. Don't add new advice or content. Just restructure what you already gave me:\n\n1. A quick-reference card (the essentials from your output in a glanceable format)\n2. The key steps from your output as a simple table with columns\n3. Your top three recommendations from the output, ranked\n\nSame information you already wrote, just in more useful shapes.`,
      hint: "You're telling AI not just what to say, but how to present it. That's the skill.",
      coachingNote: "Compare this to the original. Same information, different shape. Which version would you actually use?",
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
      prompt: isWork
        ? `Let me give you more context about "${idea}":\n\n- Here's how I currently handle this: [describe your current process briefly]\n- The part that takes the most time is: [the bottleneck]\n- I've tried improving it by: [what you've tried]\n- The constraints I'm working with are: [time, tools, team size, etc.]\n\nNow revise what you built to fit my actual situation. Be specific to what I just told you.`
        : `Let me give you more context about "${idea}":\n\n- My experience level with this is: [beginner/intermediate/etc.]\n- What I've already tried: [anything relevant]\n- What I'm specifically trying to achieve: [your goal]\n- Constraints that matter: [time, budget, space, equipment, etc.]\n\nNow revise what you built with all of this in mind. Make it genuinely mine, not generic.`,
      hint: "The more specific you are, the less generic the result. That's the difference between a template and a tool.",
      showThinkingNote: true,
      coachingNote: "How different does the output look now that Claude knows your specifics? What would you add next?",
    },
  ];
}

function buildStepSequence(answers, quickPath) {
  const steps = [];
  // Quick Path users skipped IceBreaker safety — insert condensed version
  if (quickPath) {
    steps.push({ type: "onboarding" });
    steps.push({ type: "quicksafety", variant: answers.fork === "work" ? "work" : "personal" });
  }
  steps.push({ type: "continuity" });
  steps.push({ type: "build", index: 0 });
  steps.push({ type: "build", index: 1 });
  steps.push({ type: "safety", variant: answers.fork === "work" ? "work" : "personal" });
  steps.push({ type: "build", index: 2 });
  steps.push({ type: "anchor" });
  return steps;
}

/* ━━━ Catch-up prompt with copy button ━━━━━━━━━━━━━━━━━━━━━━━━━ */
function CatchUpPrompt({ idea }) {
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef(null);
  useEffect(() => () => clearTimeout(copyTimer.current), []);
  const text = `I'm building a project about ${idea}. We've been working on it together. Here's the best version so far: [paste your latest output]`;

  const handleCopy = useCallback(async () => {
    try { await navigator.clipboard.writeText(text); } catch {}
    setCopied(true);
    clearTimeout(copyTimer.current);
    copyTimer.current = setTimeout(() => setCopied(false), 2000);
  }, [text]);

  return (
    <div style={{
      padding: "12px 14px",
      background: T.color.bgSubtle,
      borderRadius: 12,
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
export default function Foundation({ answers, onComplete, onBack, onProgress, initialStep, onStepChange, quickPath }) {
  const buildSteps = getBuildSteps(answers);
  const steps = buildStepSequence(answers, quickPath);
  const idea = answers.project_idea || "my project";

  return (
    <SectionShell
      steps={steps}
      onBack={onBack}
      onProgress={onProgress}
      sectionShapeIndex={2}
      initialStep={initialStep}
      onStepChange={onStepChange}
      renderStep={({ step, stepIndex, advance, goBack, BackButton }) => {
        if (!step) return null;

        // Quick Path: onboarding (who's in charge + split screen)
        if (step.type === "onboarding") {
          return (
            <div style={{ maxWidth: 520, margin: "0 auto", padding: "40px 0" }}>
              {BackButton}
              <h2 style={{
                fontFamily: T.font.display, fontSize: "clamp(26px,5vw,34px)",
                fontWeight: 400, fontStyle: "italic", lineHeight: 1.3,
                color: T.color.text, margin: "0 0 20px 0", textAlign: "center",
              }}>
                Before your first prompt.
              </h2>
              <div style={{
                padding: "20px 24px", marginBottom: 16,
                background: T.color.copperSoft,
                border: `1px solid ${T.color.copperGlow}`,
                borderRadius: 14,
              }}>
                <div style={{ fontSize: 16, fontWeight: 500, color: T.color.copper, marginBottom: 6 }}>
                  This wizard is your guide. Claude is your tool.
                </div>
                <p style={{ fontSize: 15, color: T.color.textMuted, lineHeight: 1.65, margin: 0 }}>
                  Each step here gives you a prompt to paste into Claude.
                  If Claude suggests its own next steps, ignore those and come back here.
                  We're building skills in a specific order.
                </p>
              </div>
              <div style={{
                padding: "20px 24px",
                background: T.color.bgSubtle, border: `1px solid ${T.color.border}`,
                borderRadius: 14,
                display: "flex", alignItems: "flex-start", gap: 14,
                fontSize: 15, color: T.color.textMuted, lineHeight: 1.65,
              }}>
                <span style={{ fontSize: 20, flexShrink: 0 }}>💡</span>
                <span>
                  <strong style={{ color: T.color.text }}>Split your screen</strong> so the wizard
                  is on one side and Claude on the other. Much easier than switching tabs.
                </span>
              </div>
              <ContinueButton onClick={advance} label="Got it" />
            </div>
          );
        }

        // Quick Path: condensed safety from IceBreaker (data privacy + models)
        if (step.type === "quicksafety") {
          const isWork = step.variant === "work";
          return (
            <div>
              {BackButton}
              <SafetyInterstitial
                title={isWork ? "Three things before we build." : "Two things before we build."}
                onContinue={advance}
                sectionShapeIndex={2}
                points={isWork ? [
                  { title: "Your input leaves your computer.", body: "Everything you type goes to a server for processing. What to do: open Claude's Settings → Privacy and review what's shared. You control whether your conversations are used for training." },
                  { title: "Think before you paste work data.", body: "Does your company have an AI policy? If you don't know, find out before sharing real work content. What to do: ask your manager or IT team." },
                  { title: "You can choose your model.", body: "Claude has different models (Haiku, Sonnet, Opus) from fast and light to deep and capable. You can also enable extended thinking. You don't need to change anything now, but the dial exists." },
                ] : [
                  { title: "Your input leaves your computer.", body: "Everything you type goes to a server for processing. What to do: open Claude's Settings → Privacy and review what's shared. You control whether your conversations are used for training." },
                  { title: "You can choose your model.", body: "Claude has different models (Haiku, Sonnet, Opus) from fast and light to deep and capable. You can also enable extended thinking. You don't need to change anything now, but the dial exists." },
                ]}
              />
            </div>
          );
        }

        if (step.type === "continuity") {
          return (
            <div>
              {BackButton}
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
                <div style={{ fontSize: 15, fontWeight: 500, color: T.color.copper, marginBottom: 6 }}>
                  Lost your conversation?
                </div>
                <p style={{ fontSize: 15, color: T.color.textMuted, lineHeight: 1.6, margin: "0 0 10px 0" }}>
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
                sectionShapeIndex={2}
                coachingNote={s.coachingNote}
              />
            </div>
          );
        }

        if (step.type === "safety") {
          // Both paths get hallucination awareness here (data handling moved to S2 for work)
          return (
            <div>
              {BackButton}
              <SafetyInterstitial title="AI gets things wrong confidently." onContinue={advance} sectionShapeIndex={2}>
                <p style={{ margin: "0 0 12px 0" }}>
                  If something in your output looked right but felt off, pay attention to that instinct.
                  These models fill gaps with plausible fiction and never flag it. They'll cite sources
                  that don't exist, give advice that sounds authoritative but is wrong, and present
                  guesses as facts. This is called a <strong>hallucination.</strong>
                </p>
                <p style={{ margin: "0 0 12px 0" }}>
                  <strong>What to do about it:</strong> Verify anything that matters before you use it.
                  If Claude gives you a statistic, check it. If it cites a source, look it up.
                  If it gives you a plan, ask yourself: "Does this make sense based on what I already know?"
                </p>
                <p style={{ margin: 0 }}>
                  This isn't a flaw to fear. It's the core skill of using AI well: trust the draft, verify the facts.
                </p>
              </SafetyInterstitial>
            </div>
          );
        }

        if (step.type === "anchor") {
          return (
            <div style={{ padding: "40px 0" }}>
              {BackButton}
              <div style={{ textAlign: "center" }}>
              <SectionCelebration heroShapeIndex={2} intensity={2} />
              <h2 style={{
                fontFamily: T.font.display, fontSize: "clamp(26px,5vw,34px)",
                fontWeight: 400, fontStyle: "italic", lineHeight: 1.3,
                color: T.color.text, margin: "0 0 12px 0",
              }}>
                You've got a working first draft.
              </h2>
              <p style={{ fontSize: 16, color: T.color.textMuted, lineHeight: 1.7, maxWidth: 520, margin: "0 auto 8px" }}>
                Prompted with context, shaped the output, and made it yours.
                Those three moves work for any project in any AI tool.
              </p>
              <div style={{
                background: T.color.bgCard, border: `1px solid ${T.color.border}`,
                borderRadius: 12, padding: "14px 18px", margin: "20px auto 0",
                maxWidth: 360, textAlign: "left",
              }}>
                <div style={{ fontSize: 12, fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", color: T.color.textLight, marginBottom: 8 }}>
                  Terms from this section
                </div>
                {[
                  ["Structured output", "Telling AI what format to use (table, checklist, etc.)"],
                  ["Context", "Your specific details that make output personal"],
                  ["Hallucination", "When AI presents fiction as fact"],
                ].map(([term, def]) => (
                  <div key={term} style={{ fontSize: 14, lineHeight: 1.5, color: T.color.textMuted, padding: "3px 0" }}>
                    <strong style={{ color: T.color.text }}>{term}</strong> — {def}
                  </div>
                ))}
              </div>
              <p style={{ fontSize: 15, color: T.color.textMuted, lineHeight: 1.6, maxWidth: 520, margin: "16px auto 0" }}>
                You've got a real project draft and the core skills to keep improving it.
                Good place to take a break if you need one. Your progress is saved.
                Next up: system prompts and multi-step workflows that take this further.
              </p>
              <ContinueButton onClick={onComplete} label="Level up" />
              </div>
            </div>
          );
        }

        return null;
      }}
    />
  );
}
