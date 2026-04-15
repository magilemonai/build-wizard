import T from "../tokens.js";
import SectionShell from "../components/SectionShell.jsx";
import GuidedStep from "../components/GuidedStep.jsx";
import SafetyInterstitial from "../components/SafetyInterstitial.jsx";
import ContinueButton from "../components/ContinueButton.jsx";
import SectionCelebration from "../components/SectionCelebration.jsx";

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
        "Write it once, and every response gets better without you repeating yourself.\n\n" +
        "To set one: open a Project in Claude (or start a new conversation), " +
        "and add your system prompt in the project instructions. " +
        "Everything Claude does in that project will follow your instructions.",
      prompt: isWork
        ? `I want you to act as my assistant for: ${idea}\n\nHere's your role:\n- You understand my workflow and the tools I use\n- You write in a professional but not stiff tone\n- You always structure output so I can copy it directly into my work\n- When you're uncertain, say so instead of guessing\n\nNow let's test it. Take what we've built for ${idea} and produce a ready-to-share version I could send to a colleague this week. Format it so they'd understand the value without needing context from our conversation.`
        : `I want you to act as my personal guide for: ${idea}\n\nHere's your role:\n- You know my experience level and preferences (from what I've told you)\n- You're encouraging but honest when something won't work\n- You give specific, actionable advice, not vague suggestions\n- You use a warm, conversational tone\n\nNow let's test it. I have 30 free minutes right now and want to make progress on ${idea}. What should I do with that time? Be specific to what we've built so far, not generic advice.`,
      hint: "In a Project, you can save these instructions so every new conversation starts with them.",
      coachingNote: "How does this response compare to your earlier ones? What changed about Claude's approach, not just its words?",
    },
    {
      id: "workflows",
      skillLabel: "Skill: Multi-step workflows",
      title: "Make Claude critique its own work.",
      explanation:
        "One great prompt is good. A chain of prompts is better: " +
        "draft, then critique, then revise. " +
        "You can tell Claude to write something, then immediately ask it to find the weaknesses, " +
        "then have it fix them. Each step builds on the last. " +
        "The result is dramatically better than a single pass.",
      prompt: isWork
        ? `Let's improve what we built for "${idea}" using a multi-step workflow.\n\nStep 1: Look at the output you've created so far and identify the 3 biggest weaknesses. Be honest and specific.\n\nStep 2: For each weakness, explain what a better version would look like.\n\nStep 3: Now rewrite the whole thing, incorporating all three improvements.\n\nGo through all three steps now.`
        : `Let's level up what we built for "${idea}".\n\nStep 1: Critique your own work. What are the 3 biggest gaps or things that feel generic?\n\nStep 2: For each gap, explain what would make it genuinely useful versus just okay.\n\nStep 3: Rewrite the whole thing with those improvements. Make it something I'd actually come back to.\n\nDo all three steps now.`,
      hint: "The draft-critique-revise loop produces dramatically better results than a single pass.",
      showThinkingNote: true,
      coachingNote: "Did Claude's critique catch anything you missed? What surprised you about the revised version?",
    },
    // Tone control exercise before the tools step
    {
      id: "roast",
      skillLabel: "Skill: Tone and creative control",
      title: "Get honest feedback on your idea.",
      explanation:
        "A quick detour. This one sharpens your project by attacking it. " +
        "You've been giving Claude serious, structured instructions, and it's been agreeable. " +
        "Now ask it to push back. A good roast will sharpen your thinking: " +
        "it surfaces weak spots, challenges assumptions, and gives you the kind of " +
        "honest feedback that makes the next version better.",
      prompt: `Give me a brutally honest but funny roast of this project idea: "${idea}"\n\nBe specific about what's ambitious, what's naive, and what's secretly genius. End with one genuine piece of advice I didn't ask for. Skip the generic advice. Be specific about what's weak and what's strong.`,
      hint: "Same tool, different mode. The ability to shift Claude's voice on purpose is itself a skill.",
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
          "Knowing what's possible changes what you reach for next.",
      prompt: isComfortable
        ? `Here's an idea to try with Claude Code (in your terminal):\n\nI've been building "${idea}" in our conversation. Now I want to turn it into something that lives on my computer.\n\nCan you help me think about what this would look like as a simple file or script I could save and reuse? What would the structure be? Don't build it yet, just sketch the plan.`
        : `I've been building "${idea}" with you. I'm curious about what else is possible.\n\nTell me:\n1. What tools and capabilities do you have access to right now in this conversation?\n2. If I wanted to take what we've built and make it more permanent or powerful, what would my options be?\n3. What's one thing most people don't realize Claude can do?\n\nKeep it practical. I want to know what I could actually use, not a feature list.`,
      hint: isComfortable
        ? "Claude Code is available at claude.ai/code or as a CLI. The prompting skills you've built transfer directly."
        : "Now you know the spectrum: conversation to code to agents. The prompting skills you've built work at every level.",
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
export default function PowerUp({ answers, onComplete, onBack, onProgress, initialStep, onStepChange, getSessionId }) {
  const buildSteps = getBuildSteps(answers);
  const steps = buildStepSequence();

  return (
    <SectionShell
      sectionKey="powerup"
      steps={steps}
      onBack={onBack}
      onProgress={onProgress}
      sectionShapeIndex={3}
      initialStep={initialStep}
      onStepChange={onStepChange}
      renderStep={({ step, stepIndex, advance, goBack, BackButton }) => {
        if (!step) return null;

        if (step.type === "build") {
          const s = buildSteps[step.index];
          return (
            <div>
              {BackButton}
              {stepIndex === 0 && (
                <details style={{ marginBottom: 12, fontSize: 14, color: T.color.textMuted }}>
                  <summary style={{ cursor: "pointer", color: T.color.textLight, fontSize: 13 }}>Lost your Claude conversation?</summary>
                  <div style={{ marginTop: 8, padding: "10px 14px", background: T.color.bgSubtle, borderRadius: 12, fontFamily: "'Courier New', Courier, monospace", fontSize: 13, lineHeight: 1.6, color: T.color.text }}>
                    I'm building a project about {answers.project_idea || "my project"}. We've already gone through exercises, prompting, structured output, and adding personal context. Here's the best version of what I've built so far: [paste your latest output]
                  </div>
                </details>
              )}
              <GuidedStep
                skillLabel={s.skillLabel}
                title={s.title}
                explanation={s.explanation}
                tip={s.tip}
                prompt={s.prompt}
                hint={s.hint}
                onConfirm={advance}
                sectionShapeIndex={3}
                coachingNote={s.coachingNote}
                getSessionId={getSessionId}
                analyticsContext={{ section: "powerup", stepIndex }}
              />
            </div>
          );
        }

        if (step.type === "safety") {
          return (
            <div>
              {BackButton}
              <SafetyInterstitial
                section="powerup"
                title="More tools, more to watch for."
                onContinue={advance}
                sectionShapeIndex={3}
                points={[
                  { title: "Be careful what you give AI access to.", body: "When you give AI access to files, tools, or services, think of it like handing keys to a valet: competent, but you wouldn't leave your wallet on the seat. What to do: give access only to what the task needs. Review what it's about to do before it does it. If a tool asks for broad permissions, ask yourself: does this task actually require all of that?" },
                  { title: "Hidden instructions are real.", body: "When AI processes external content (a web page, a document, an email), that content can contain hidden instructions that change what the AI does. This is called prompt injection. Nothing we're doing in this wizard exposes you to it. You're typing prompts directly into Claude, not connecting it to outside content or building agents. But as your usage grows and you start giving AI access to documents, web pages, or tools, this is the thing to watch for. What to do: when that day comes, never give AI tools blanket permission to act on external content without reviewing the result first." },
                ]}
              />
            </div>
          );
        }

        if (step.type === "anchor") {
          return (
            <div style={{ padding: "40px 0" }}>
              {BackButton}
              <div style={{ textAlign: "center" }}>
              <SectionCelebration heroShapeIndex={3} intensity={3} />
              <h2 style={{
                fontFamily: T.font.display, fontSize: "clamp(26px,5vw,34px)",
                fontWeight: 400, fontStyle: "italic", lineHeight: 1.3,
                color: T.color.text, margin: "0 0 12px 0",
              }}>
                Your project just got serious.
              </h2>
              <p style={{ fontSize: 16, color: T.color.textMuted, lineHeight: 1.7, maxWidth: 520, margin: "0 auto 8px" }}>
                System prompts, multi-step workflows, and a sense of what's possible
                beyond conversation. Those are the skills that make AI genuinely useful
                day to day.
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
                  ["System prompt", "Persistent context that shapes every AI response"],
                  ["Workflow", "A chain of steps: draft, critique, revise"],
                  ["Prompt injection", "Hidden instructions in external content"],
                ].map(([term, def]) => (
                  <div key={term} style={{ fontSize: 14, lineHeight: 1.5, color: T.color.textMuted, padding: "3px 0" }}>
                    <strong style={{ color: T.color.text }}>{term}</strong> — {def}
                  </div>
                ))}
              </div>
              <p style={{ fontSize: 15, color: T.color.textMuted, lineHeight: 1.6, maxWidth: 520, margin: "16px auto 0" }}>
                One section left. We'll finish the project, reflect on what you
                learned, and set you up for what comes next.
                Take a break here if you need one. Your progress is saved.
              </p>
              <ContinueButton onClick={onComplete} label="One more section" />
              </div>
            </div>
          );
        }

        return null;
      }}
    />
  );
}
