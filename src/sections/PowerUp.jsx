import T from "../tokens.js";
import SectionShell from "../components/SectionShell.jsx";
import SectionLabel from "../components/SectionLabel.jsx";
import GuidedStep from "../components/GuidedStep.jsx";
import SafetyInterstitial from "../components/SafetyInterstitial.jsx";
import ContinueButton from "../components/ContinueButton.jsx";
import OrganicShape from "../components/OrganicShape.jsx";

/* ━━━ Build steps: system prompts, workflows, tools, agents ━━━━ */
function getBuildSteps(answers) {
  const idea = answers.project_idea || "my project";
  const isWork = answers.fork === "work";
  const isComfortable = answers.code_feeling === "comfortable" || answers.code_feeling === "indifferent";

  return [
    {
      id: "system_prompts",
      skillLabel: "Skill: System prompts",
      title: "Give Claude a job description.",
      explanation:
        "Up to now, you've been explaining what you want each time. " +
        "A system prompt is the context Claude starts every conversation with. " +
        "Think of it as a job description: who Claude is, what it knows, how it should behave. " +
        "Write it once, and every response gets better without you repeating yourself.",
      tip: "Describe Claude's role, what it knows about your project, and any rules it should follow. Be specific about tone and format preferences.",
      prompt: isWork
        ? `I want you to act as my assistant for: ${idea}\n\nHere's your role:\n- You understand my workflow and the tools I use\n- You write in a professional but not stiff tone\n- You always structure output so I can copy it directly into my work\n- When you're uncertain, say so instead of guessing\n\nFrom now on, respond as this assistant. Let's start: give me a quick summary of how you'd approach this role.`
        : `I want you to act as my personal guide for: ${idea}\n\nHere's your role:\n- You know my experience level and preferences (from what I've told you)\n- You're encouraging but honest when something won't work\n- You give specific, actionable advice, not vague suggestions\n- You use a warm, conversational tone\n\nFrom now on, respond as this guide. Start by telling me the one thing I should focus on this week.`,
      hint: "This is the foundation for everything else. A good system prompt means less correcting and more building.",
    },
    {
      id: "workflows",
      skillLabel: "Skill: Multi-step workflows",
      title: "Make Claude critique its own work.",
      explanation:
        "The most powerful pattern in AI isn't one great prompt. " +
        "It's a chain: draft, then critique, then revise. " +
        "You can tell Claude to write something, then immediately ask it to find the weaknesses, " +
        "then have it fix them. Each step builds on the last. " +
        "The result is dramatically better than a single pass.",
      tip: "After Claude gives you something, ask it: \"What's wrong with this? What did you miss? Now fix those things.\" Three steps beats one every time.",
      prompt: isWork
        ? `Let's improve what we built for "${idea}" using a multi-step workflow.\n\nStep 1: Look at the output you've created so far and identify the 3 biggest weaknesses. Be honest and specific.\n\nStep 2: For each weakness, explain what a better version would look like.\n\nStep 3: Now rewrite the whole thing, incorporating all three improvements.\n\nGo through all three steps now.`
        : `Let's level up what we built for "${idea}".\n\nStep 1: Critique your own work. What are the 3 biggest gaps or things that feel generic?\n\nStep 2: For each gap, explain what would make it genuinely useful versus just okay.\n\nStep 3: Rewrite the whole thing with those improvements. Make it something I'd actually come back to.\n\nDo all three steps now.`,
      hint: "Notice the quality jump between the single-pass version and the one that went through draft-critique-revise. That's the workflow pattern.",
      showThinkingNote: true,
    },
    // Playful interlude before the tools step
    {
      id: "roast",
      skillLabel: "Bonus round",
      title: "Let's have some fun before the last one.",
      explanation:
        "You've been serious for a while. Before we cover tools and capabilities, " +
        "let's use the skills you've built for something ridiculous. " +
        "You know how to set context, iterate, and critique. Time to aim those skills at yourself.",
      tip: "This is secretly useful. Getting Claude to critique your project idea stress-tests the draft-critique-revise pattern you just learned.",
      prompt: `Give me a brutally honest but funny roast of this project idea: "${idea}"\n\nBe specific about what's ambitious, what's naive, and what's secretly genius. End with one genuine piece of advice I didn't ask for.`,
      hint: "Notice how Claude's tone changed because you asked for something different. Same tool, different mode. That flexibility is the point.",
    },
    {
      id: "tools",
      skillLabel: isComfortable ? "Skill: Claude Code" : "Skill: Tools and capabilities",
      title: isComfortable
        ? "Same thing you've been doing, but on your computer."
        : "Claude can do more than write text.",
      explanation: isComfortable
        ? "That roast probably surfaced some real weaknesses. Now imagine a tool that could act on them: " +
          "edit files, run commands, build things directly on your machine. " +
          "Claude Code is Claude in your terminal. Same prompting you've been practicing, more leverage. " +
          "Think of it as going from giving instructions on paper to having someone at the keyboard."
        : "That roast probably surfaced some real weaknesses. Here's the good news: AI tools can do more " +
          "than point them out. They can read files, search the web, run code, and connect to other services. " +
          "When AI can take actions, not just produce text, that's the jump from assistant to agent. " +
          "You don't need to use all of this today. But knowing it exists changes what you think is possible.",
      tip: isComfortable
        ? "Try giving Claude Code a small, well-scoped task first. It works best when you describe what you want, not how to do it."
        : "Start by asking Claude what tools and capabilities it has available right now. You might be surprised.",
      prompt: isComfortable
        ? `Here's an idea to try with Claude Code (in your terminal):\n\nI've been building "${idea}" in our conversation. Now I want to turn it into something that lives on my computer.\n\nCan you help me think about what this would look like as a simple file or script I could save and reuse? What would the structure be? Don't build it yet, just sketch the plan.`
        : `I've been building "${idea}" with you. I'm curious about what else is possible.\n\nTell me:\n1. What tools and capabilities do you have access to right now in this conversation?\n2. If I wanted to take what we've built and make it more permanent or powerful, what would my options be?\n3. What's one thing most people don't realize Claude can do?\n\nKeep it practical. I want to know what I could actually use, not a feature list.`,
      hint: isComfortable
        ? "Claude Code is available at claude.ai/code or as a CLI. The prompting skills you've built transfer directly."
        : "You don't need to use any of these today. The point is knowing the spectrum: from conversation to code to agents. You'll find the right level for your needs.",
    },
  ];
}

function buildStepSequence() {
  return [
    { type: "build", index: 0 },
    { type: "build", index: 1 },
    { type: "safety" },
    { type: "build", index: 2 }, // roast (playful)
    { type: "build", index: 3 }, // tools
    { type: "anchor" },
  ];
}

/* ━━━ PowerUp Section ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export default function PowerUp({ answers, onComplete, onBack, onProgress }) {
  const buildSteps = getBuildSteps(answers);
  const steps = buildStepSequence();

  return (
    <SectionShell
      steps={steps}
      onBack={onBack}
      onProgress={onProgress}
      renderStep={({ step, stepIndex, advance, goBack, BackButton }) => {
        if (!step) return null;

        if (step.type === "build") {
          const s = buildSteps[step.index];
          return (
            <div>
              {BackButton}
              {stepIndex === 0 && <SectionLabel>Section 4 · Power Up</SectionLabel>}
              <GuidedStep
                skillLabel={s.skillLabel}
                title={s.title}
                explanation={s.explanation}
                tip={s.tip}
                prompt={s.prompt}
                hint={s.hint}
                onConfirm={advance}
              />
            </div>
          );
        }

        if (step.type === "safety") {
          return (
            <div>
              {BackButton}
              <SafetyInterstitial title="More power, more surface area." onContinue={advance}>
                <p style={{ margin: "0 0 16px 0" }}>
                  <strong style={{ color: T.color.text }}>Permission scoping.</strong>{" "}
                  When you give AI access to files, tools, or services, think of it like handing keys to a
                  valet: competent, sure, but you wouldn't leave your wallet on the seat. Give access to
                  what the task needs. Nothing more. Review what it's about to do before it does it.
                </p>
                <p style={{ margin: 0 }}>
                  <strong style={{ color: T.color.text }}>Hidden instructions are real.</strong>{" "}
                  When AI agents process external content (a web page, a document, an email), that content
                  can contain hidden instructions that hijack what the AI does next. This is called prompt
                  injection. It's why blanket permissions and unreviewed actions are off the table.
                </p>
              </SafetyInterstitial>
            </div>
          );
        }

        if (step.type === "anchor") {
          return (
            <div style={{ padding: "40px 0" }}>
              {BackButton}
              {/* Celebration shapes */}
              <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
                {[0, 1, 3, 4].map((idx, i) => (
                  <div key={idx} style={{ animation: `celebratePop 0.5s ${T.ease.spring} ${i * 0.1}s both` }}>
                    <OrganicShape shapeIndex={idx} size={idx === 4 ? 14 : 12} color={i % 2 === 0 ? T.color.copper : T.color.sage} />
                  </div>
                ))}
              </div>
              <h2 style={{
                fontFamily: T.font.display, fontSize: "clamp(26px,5vw,34px)",
                fontWeight: 400, fontStyle: "italic", lineHeight: 1.3,
                color: T.color.text, margin: "0 0 12px 0",
              }}>
                Your project just leveled up.
              </h2>
              <p style={{ fontSize: 16, color: T.color.textMuted, lineHeight: 1.7, maxWidth: 480, margin: "0 0 8px" }}>
                System prompts, multi-step workflows, and a sense of what's possible
                beyond conversation. Those are the tools that separate casual use from
                real capability.
              </p>
              <p style={{ fontSize: 14, color: T.color.textLight, lineHeight: 1.6, maxWidth: 460 }}>
                One section left. We'll finish the project, reflect on what you
                learned, and set you up for what comes next.
              </p>
              <ContinueButton onClick={onComplete} label="Finish strong" />
            </div>
          );
        }

        return null;
      }}
    />
  );
}
