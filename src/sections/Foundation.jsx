import { useState, useCallback } from "react";
import T from "../tokens.js";
import PageTransition from "../components/PageTransition.jsx";
import SectionLabel from "../components/SectionLabel.jsx";
import GuidedStep from "../components/GuidedStep.jsx";
import SafetyInterstitial from "../components/SafetyInterstitial.jsx";
import ContinueButton from "../components/ContinueButton.jsx";
import BackButton from "../components/BackButton.jsx";

/* ━━━ Build steps: tailored prompts per project type ━━━━━━━━━━━━
   Each step teaches one skill through the user's actual project.
   Prompts adapt based on fork (work/personal) and project_idea.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function getBuildSteps(answers) {
  const idea = answers.project_idea || "my project";
  const isWork = answers.fork === "work";

  return [
    // ── Step 1: Prompting well ──
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
    },
    // ── Step 2: Structured output ──
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
        : `Take what you just built for "${idea}" and give me:\n\n1. A quick-reference card I could print or save (the essentials in a glanceable format)\n2. A week-by-week plan as a simple table\n3. Three "if you only do one thing" recommendations, ranked\n\nSame content, more useful shape.`,
      hint: "Compare this output to the first one. Same information, but now it's structured in a way you can actually use. That's the difference a good prompt makes.",
    },
    // ── Step 3: Working with your data ──
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
    },
  ];
}

/* ━━━ Section Anchor ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function SectionAnchor({ onContinue }) {
  return (
    <div style={{ textAlign: "center", padding: "40px 0" }}>
      <h2 style={{
        fontFamily: T.font.display, fontSize: "clamp(24px,5vw,30px)",
        fontWeight: 400, fontStyle: "italic", lineHeight: 1.3,
        color: T.color.text, margin: "0 0 12px 0",
      }}>
        You've got a working first draft.
      </h2>
      <p style={{
        fontSize: 16, color: T.color.textMuted,
        lineHeight: 1.7, maxWidth: 420, margin: "0 auto 8px",
      }}>
        Prompted with context, shaped the output, and made it yours.
        Those three moves work for any project in any AI tool.
      </p>
      <p style={{
        fontSize: 13, color: T.color.textLight,
        lineHeight: 1.6, maxWidth: 400, margin: "0 auto",
      }}>
        Another good stopping point. You've got a real project draft and the
        core prompting skills to keep improving it. The next section levels it
        up with system prompts and multi-step workflows.
      </p>
      <ContinueButton onClick={onContinue} label="Level up" />
    </div>
  );
}

/* ━━━ Step sequence ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   build_0 (prompting) → build_1 (structured) → safety → build_2 (context) → anchor
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function buildStepSequence(answers) {
  const steps = [];
  steps.push({ type: "build", index: 0 });
  steps.push({ type: "build", index: 1 });
  steps.push({ type: "safety", variant: answers.fork === "work" ? "work" : "personal" });
  steps.push({ type: "build", index: 2 });
  steps.push({ type: "anchor" });
  return steps;
}

/* ━━━ Foundation Section ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export default function Foundation({ answers, onComplete, onBack, onProgress }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const buildSteps = getBuildSteps(answers);
  const stepSequence = buildStepSequence(answers);
  const currentStep = stepSequence[stepIndex];

  const advance = useCallback(() => {
    setDirection(1);
    setStepIndex((i) => {
      const next = i + 1;
      onProgress?.(next / stepSequence.length);
      return next;
    });
  }, [stepSequence.length, onProgress]);

  const goBack = useCallback(() => {
    if (stepIndex <= 0) {
      onBack?.();
      return;
    }
    setDirection(-1);
    setStepIndex((i) => {
      const next = i - 1;
      onProgress?.(next / stepSequence.length);
      return next;
    });
  }, [stepIndex, onBack, stepSequence.length, onProgress]);

  const renderStep = () => {
    if (!currentStep) return null;

    if (currentStep.type === "build") {
      const step = buildSteps[currentStep.index];
      return (
        <div>
          {stepIndex > 0 && <BackButton onClick={goBack} />}
          {stepIndex === 0 && <SectionLabel>Section 3 · Foundation</SectionLabel>}
          <GuidedStep
            skillLabel={step.skillLabel}
            title={step.title}
            explanation={step.explanation}
            tip={step.tip}
            prompt={step.prompt}
            hint={step.hint}
            onConfirm={advance}
          />
        </div>
      );
    }

    if (currentStep.type === "safety") {
      if (currentStep.variant === "work") {
        // Work users get both: hallucination awareness + data handling
        return (
          <div>
            <BackButton onClick={goBack} />
            <SafetyInterstitial
              title="Two things about trust and data."
              onContinue={advance}
            >
              <p style={{ margin: "0 0 16px 0" }}>
                <strong style={{ color: T.color.text }}>AI gets things wrong confidently.</strong>{" "}
                If something in your output looked right but felt off, that's called a hallucination.
                These models fill gaps with plausible fiction and never flag it.
                Your job: <strong>verify anything that matters.</strong> That's not a limitation of the tool.
                That's the skill of using it well.
              </p>
              <p style={{ margin: 0 }}>
                <strong style={{ color: T.color.text }}>Think before you paste work data.</strong>{" "}
                Before sharing real work data with Claude, check: does your company have an AI policy?
                What plan are you on? Is your data covered by any agreements?
                If you don't know, that's fine. Ask your IT team or manager. Better to ask than to assume.
              </p>
            </SafetyInterstitial>
          </div>
        );
      }

      // Personal users: just hallucination awareness
      return (
        <div>
          <BackButton onClick={goBack} />
          <SafetyInterstitial
            title="AI gets things wrong confidently."
            onContinue={advance}
          >
            <p style={{ margin: "0 0 12px 0" }}>
              If something in your output looked right but felt off, pay attention to that instinct.
              These models fill gaps with plausible fiction and never flag it. A recipe with a made-up
              cooking technique. A book recommendation that doesn't exist. A workout that sounds good
              but wouldn't actually work.
            </p>
            <p style={{ margin: 0 }}>
              This is called a hallucination. Your job: <strong>verify anything that matters.</strong>{" "}
              That's not a limitation of the tool. That's the skill of using it well.
            </p>
          </SafetyInterstitial>
        </div>
      );
    }

    if (currentStep.type === "anchor") {
      return (
        <div>
          <BackButton onClick={goBack} />
          <SectionAnchor onContinue={onComplete} />
        </div>
      );
    }

    return null;
  };

  return (
    <PageTransition
      transitionKey={stepIndex}
      type="page"
      direction={direction}
    >
      {renderStep()}
    </PageTransition>
  );
}
