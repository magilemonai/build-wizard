import T from "../tokens.js";
import SectionShell from "../components/SectionShell.jsx";
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
        "Write it once, and every response gets better without you repeating yourself.\n\n" +
        "To set one: open a Project in Claude (or start a new conversation), " +
        "and add your system prompt in the project instructions. " +
        "Everything Claude does in that project will follow your instructions.",
      prompt: isWork
        ? `I want you to act as my assistant for: ${idea}\n\nHere's your role:\n- You understand my workflow and the tools I use\n- You write in a professional but not stiff tone\n- You always structure output so I can copy it directly into my work\n- When you're uncertain, say so instead of guessing\n\nNow let's test it. Take what we've built for ${idea} and produce a ready-to-share version I could send to a colleague this week. Format it so they'd understand the value without needing context from our conversation.`
        : `I want you to act as my personal guide for: ${idea}\n\nHere's your role:\n- You know my experience level and preferences (from what I've told you)\n- You're encouraging but honest when something won't work\n- You give specific, actionable advice, not vague suggestions\n- You use a warm, conversational tone\n\nNow let's test it. I have 30 free minutes right now and want to make progress on ${idea}. What should I do with that time? Be specific to what we've built so far, not generic advice.`,
      hint: "Notice how the system prompt changed Claude's tone and approach. That context carries forward. In a Project, you'd save this as permanent instructions so every new conversation starts with it.",
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
      prompt: isWork
        ? `Let's improve what we built for "${idea}" using a multi-step workflow.\n\nStep 1: Look at the output you've created so far and identify the 3 biggest weaknesses. Be honest and specific.\n\nStep 2: For each weakness, explain what a better version would look like.\n\nStep 3: Now rewrite the whole thing, incorporating all three improvements.\n\nGo through all three steps now.`
        : `Let's level up what we built for "${idea}".\n\nStep 1: Critique your own work. What are the 3 biggest gaps or things that feel generic?\n\nStep 2: For each gap, explain what would make it genuinely useful versus just okay.\n\nStep 3: Rewrite the whole thing with those improvements. Make it something I'd actually come back to.\n\nDo all three steps now.`,
      hint: "Notice the quality jump between the single-pass version and the one that went through draft-critique-revise. That's the workflow pattern.",
      showThinkingNote: true,
    },
    // Tone control exercise before the tools step
    {
      id: "roast",
      skillLabel: "Skill: Tone and creative control",
      title: "Same tool, completely different voice.",
      explanation:
        "You've been giving Claude serious, structured instructions. " +
        "But the same prompting skills work for any tone: playful, blunt, casual, formal. " +
        "Shifting Claude's voice on purpose (not by accident) is a real skill. " +
        "Let's prove it by asking for something deliberately ridiculous.",
      prompt: `Give me a brutally honest but funny roast of this project idea: "${idea}"\n\nBe specific about what's ambitious, what's naive, and what's secretly genius. End with one genuine piece of advice I didn't ask for. Don't tell me to stop building and just use it. I know. Give me something more specific.`,
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
      sectionShapeIndex={3}
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
                  <div style={{ marginTop: 8, padding: "10px 14px", background: "rgba(44,41,37,0.05)", borderRadius: 12, fontFamily: "'Courier New', Courier, monospace", fontSize: 13, lineHeight: 1.6, color: T.color.text }}>
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
              />
            </div>
          );
        }

        if (step.type === "safety") {
          return (
            <div>
              {BackButton}
              <SafetyInterstitial
                title="More power, more surface area."
                onContinue={advance}
                sectionShapeIndex={3}
                points={[
                  { title: "Permission scoping.", body: "When you give AI access to files, tools, or services, think of it like handing keys to a valet: competent, sure, but you wouldn't leave your wallet on the seat. Give access to what the task needs. Nothing more. Review what it's about to do before it does it." },
                  { title: "Hidden instructions are real.", body: "When AI agents process external content (a web page, a document, an email), that content can contain hidden instructions that hijack what the AI does next. This is called prompt injection. It's why blanket permissions and unreviewed actions are off the table." },
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
              {/* Celebration: bigger burst for Section 4 */}
              <div style={{ position: "relative", height: 80, marginBottom: 16 }}>
                {[
                  { x: -100, y: -45, rot: -50, idx: 0, size: 10, color: T.color.copper },
                  { x: 85, y: -55, rot: 35, idx: 1, size: 9, color: T.color.sage },
                  { x: -60, y: -65, rot: -25, idx: 4, size: 7, color: `${T.color.copper}88` },
                  { x: 110, y: -30, rot: 55, idx: 2, size: 8, color: T.color.sage },
                  { x: -120, y: -20, rot: -65, idx: 3, size: 10, color: `${T.color.sage}88` },
                  { x: 50, y: -70, rot: 20, idx: 0, size: 6, color: T.color.copper },
                  { x: -35, y: -60, rot: -30, idx: 4, size: 7, color: `${T.color.sage}66` },
                  { x: 95, y: -40, rot: 45, idx: 1, size: 8, color: `${T.color.copper}66` },
                  { x: -75, y: -50, rot: -40, idx: 2, size: 5, color: T.color.copper },
                  { x: 25, y: -62, rot: 12, idx: 3, size: 6, color: T.color.sage },
                  { x: -40, y: -72, rot: -18, idx: 1, size: 7, color: `${T.color.copper}77` },
                  { x: 115, y: -52, rot: 42, idx: 4, size: 6, color: `${T.color.sage}77` },
                ].map((p, i) => (
                  <div key={i} style={{
                    position: "absolute", left: "50%", top: "60%",
                    "--scatter-to": `translate(${p.x}px, ${p.y}px)`,
                    "--scatter-rot": `${p.rot}deg`,
                    animation: `celebrateScatter 0.9s ${T.ease.smooth} ${i * 0.03}s both`,
                  }}>
                    <OrganicShape shapeIndex={p.idx} size={p.size} color={p.color} />
                  </div>
                ))}
                <div style={{
                  position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)",
                  display: "flex", gap: 14, alignItems: "flex-end",
                }}>
                  {[0, 1, 2, 3, 4].map((idx, i) => (
                    <div key={idx} style={{
                      animation: `celebrateBounce 0.7s ${T.ease.spring} ${0.3 + i * 0.07}s both, celebrateFloat 3s ease-in-out ${1.2 + i * 0.25}s infinite`,
                    }}>
                      <OrganicShape shapeIndex={idx} size={idx === 4 ? 28 : 22} color={i % 2 === 0 ? T.color.copper : T.color.sage} />
                    </div>
                  ))}
                </div>
              </div>
              <h2 style={{
                fontFamily: T.font.display, fontSize: "clamp(26px,5vw,34px)",
                fontWeight: 400, fontStyle: "italic", lineHeight: 1.3,
                color: T.color.text, margin: "0 0 12px 0",
              }}>
                Your project just leveled up.
              </h2>
              <p style={{ fontSize: 16, color: T.color.textMuted, lineHeight: 1.7, maxWidth: 520, margin: "0 auto 8px" }}>
                System prompts, multi-step workflows, and a sense of what's possible
                beyond conversation. Those are the tools that separate casual use from
                real capability.
              </p>
              <p style={{ fontSize: 15, color: T.color.textMuted, lineHeight: 1.6, maxWidth: 520, margin: "0 auto" }}>
                One section left. We'll finish the project, reflect on what you
                learned, and set you up for what comes next.
              </p>
              <ContinueButton onClick={onComplete} label="Finish strong" />
              </div>
            </div>
          );
        }

        return null;
      }}
    />
  );
}
