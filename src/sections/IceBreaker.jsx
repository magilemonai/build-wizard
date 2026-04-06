import T from "../tokens.js";
import SectionShell from "../components/SectionShell.jsx";
import PromptCard from "../components/PromptCard.jsx";
import OrganicShape from "../components/OrganicShape.jsx";
import SafetyInterstitial from "../components/SafetyInterstitial.jsx";
import ContinueButton from "../components/ContinueButton.jsx";
import SectionCelebration from "../components/SectionCelebration.jsx";

/* ━━━ Exercise Screen ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function ExerciseScreen({ exercise, onConfirm }) {
  return (
    <div>
      <h2 style={{
        fontFamily: T.font.display, fontSize: "clamp(26px,5vw,34px)",
        fontWeight: 400, lineHeight: 1.3, margin: "0 0 10px 0",
        color: T.color.text,
      }}>
        {exercise.title}
      </h2>
      <p style={{
        fontSize: 16, color: T.color.textMuted,
        margin: "0 0 4px 0", lineHeight: 1.65,
      }}>
        {exercise.description}
      </p>
      {exercise.hint && (
        <p style={{
          fontSize: 15, color: T.color.textMuted,
          margin: "10px 0 6px", lineHeight: 1.6,
          fontStyle: "italic",
        }}>
          {exercise.hint}
        </p>
      )}
      {exercise.coaching && (
        <div style={{
          display: "flex", gap: 16, alignItems: "flex-start",
          padding: "16px 18px",
          background: T.color.bgSubtle,
          border: `1px solid ${T.color.border}`,
          borderRadius: 14,
          marginBottom: 8,
        }}>
          <div style={{ flexShrink: 0, position: "relative", width: 36, height: 36 }}>
            <div style={{ animation: "gentleSpin 12s linear infinite", lineHeight: 0 }}>
              <OrganicShape shapeIndex={1} size={32} color={T.color.copper} />
            </div>
            {[
              { top: -4, right: -2, delay: 0 },
              { bottom: -2, left: 2, delay: 0.6 },
            ].map((pos, i) => (
              <div key={i} style={{
                position: "absolute", ...pos, width: 5, height: 5,
                borderRadius: "50%", background: T.color.copper,
                animation: `sparkle 2s ease-in-out ${pos.delay}s infinite`,
              }} />
            ))}
          </div>
          <div style={{ fontSize: 15, color: T.color.textMuted, lineHeight: 1.6, paddingTop: 4 }}>
            {exercise.coaching}
          </div>
        </div>
      )}
      <div style={{
        marginBottom: 6, padding: "10px 14px",
        background: T.color.bgSubtle,
        border: `1px solid ${T.color.border}`,
        borderRadius: 12,
        display: "flex", alignItems: "center", gap: 8,
        fontSize: 15, color: T.color.textMuted, lineHeight: 1.5,
      }}>
        <span style={{ fontSize: 16 }}>⏳</span>
        Claude may take a moment, especially if it's building an artifact. That's normal.
      </div>
      <PromptCard
        key={exercise.id}
        prompt={exercise.prompt}
        context={exercise.context}
        onConfirm={onConfirm}
      />
    </div>
  );
}

/* ━━━ Exercise definitions ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function getExercises(answers) {
  const exercises = [];
  const experience = answers.experience || "tried";
  const isNovice = experience === "never" || experience === "tried";

  if (isNovice) {
    exercises.push({
      id: "band_names",
      title: "Let's start with something ridiculous.",
      description: "Copy this prompt into Claude in your other tab. Just paste it in and hit enter.",
      context: "Paste this into Claude:",
      prompt: `Generate 10 random band names by combining a random adjective, a random animal, and a random occupation. Make them funny.`,
      coaching: "This is just to see the loop in action: you give an instruction, Claude responds. Simple as that.",
    });
  } else {
    exercises.push({
      id: "band_names",
      title: "Quick warm-up. Something ridiculous.",
      description: "Copy this prompt into Claude in your other tab. Paste it in and hit enter.",
      context: "Paste this into Claude:",
      prompt: `Write a Python script that generates 5 random band names by combining a random adjective with a random animal and a random occupation. Make them funny. Present the code and the output as an artifact I can see.`,
      hint: "If Claude asks to run the code, say yes.",
      coaching: "You're asking Claude to write and run code. Same loop: instruction in, result out.",
    });
  }

  if (isNovice) {
    exercises.push({
      id: "magic_8ball",
      title: "Now something a little more interactive.",
      description: "This time you'll give Claude more specific instructions. It only answers yes-or-no questions, so keep them simple. Copy and paste:",
      coaching: "You're giving Claude a role to play. See how it stays in character? That's the foundation for system prompts later.",
      context: "Paste this into Claude:",
      prompt: `I want you to be a Magic 8-Ball. I'll ask you a yes-or-no question, and you respond in character: first say "The spirits are consulting..." then give me a mystical, funny answer. Make the answers more creative than the standard Magic -Ball responses.\n\nMy first question: Will I finish everything on my to-do list today?`,
      hint: "After you get the first answer, try asking a few more questions. See how Claude stays in character across the conversation.",
    });
  } else {
    exercises.push({
      id: "magic_8ball",
      title: "Now something interactive.",
      description: "A bit more structured this time. Copy it in.",
      context: "Paste this into Claude:",
      prompt: `Build a Magic 8-Ball as an interactive artifact. It should have a text input for my question, a dramatic pause animation, then reveal a funny mystical answer. Make the answers more creative than the standard ones. Present it as something I can actually use.`,
      hint: "Once it's built, try using it. Claude can build interactive tools, not just write text.",
      coaching: "This is Claude building an interactive app from a description. You'll do this for your own project next.",
    });
  }

  const projectIdea = answers.project_idea || "";

  if (projectIdea.trim()) {
    if (isNovice) {
      exercises.push({
        id: "project_bridge",
        title: "One more. This one actually builds something.",
        description: "Time to see Claude create a real tool. This is a preview of what we'll build for real in the next section.",
        context: "Paste this into Claude:",
        prompt: `Build me a simple interactive tool related to: "${projectIdea.trim()}"\n\nMake it something I can actually click around and use, not just text. Keep it fun and simple. Present it as an artifact.`,
        hint: "This is a preview. The next section does this for real, tailored to what you actually need.",
        coaching: "You just went from an idea to a working tool. That's the whole pattern we'll use from here.",
      });
    } else {
      exercises.push({
        id: "project_bridge",
        title: "One more. This one's yours.",
        description: "Let's turn your project idea into something tangible.",
        context: "Paste this into Claude:",
        prompt: `Build me a quick prototype related to: "${projectIdea.trim()}"\n\nMake it a working interactive artifact: something I can use, not just read. Keep it scrappy but functional. This is a warm-up, not the final version.`,
        hint: "The pattern: describe what you want, Claude builds it, you refine. The next section does this for real.",
        coaching: "You just went from a description to a working prototype. That's the loop we'll refine in the next section.",
      });
    }
  } else {
    exercises.push({
      id: "project_bridge",
      title: "One more. This one actually builds something.",
      description: "Time to see Claude create a real tool you can use.",
      context: "Paste this into Claude:",
      prompt: `Build me a simple daily planner as an interactive artifact. It should let me type in tasks, set rough time estimates, and organize them into a prioritized schedule. Keep it clean and usable.`,
      hint: "The pattern: describe what you want, Claude builds it, you refine from there.",
      coaching: "Idea to working tool. That's the whole loop.",
    });
  }

  return exercises;
}

/* ━━━ Step sequence ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function buildStepSequence(exercises, isWork) {
  const steps = [];
  steps.push({ type: "onboarding" });
  steps.push({ type: "exercise", index: 0 });
  steps.push({ type: "exercise", index: 1 });
  steps.push({ type: "safety", variant: isWork ? "work" : "personal" });
  if (exercises.length > 2) {
    steps.push({ type: "exercise", index: 2 });
  }
  steps.push({ type: "anchor" });
  return steps;
}

/* ━━━ IceBreaker Section ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export default function IceBreaker({ answers, onComplete, onBack, onProgress, initialStep, onStepChange }) {
  const experience = answers.experience || "tried";
  const isNovice = experience === "never" || experience === "tried";
  const isWork = answers.fork === "work";
  const exercises = getExercises(answers);
  const steps = buildStepSequence(exercises, isWork);
  const canSkipToFoundation = answers.experience === "regular" && answers.code_feeling === "comfortable";

  return (
    <SectionShell
      steps={steps}
      onBack={onBack}
      onProgress={onProgress}
      sectionShapeIndex={1}
      initialStep={initialStep}
      onStepChange={onStepChange}
      renderStep={({ step, stepIndex, advance, BackButton }) => {
        if (!step) return null;

        if (step.type === "onboarding") {
          return (
            <div style={{
              maxWidth: 520, margin: "0 auto", padding: "40px 0",
            }}>
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
                background: T.color.bgSubtle,
                border: `1px solid ${T.color.border}`,
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

        if (step.type === "exercise") {
          return (
            <div>
              {BackButton}
              <ExerciseScreen
                exercise={exercises[step.index]}
                onConfirm={advance}
              />
              {stepIndex === 0 && canSkipToFoundation && (
                <button
                  onClick={() => { onComplete(); }}
                  style={{
                    display: "block",
                    marginTop: 16,
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: 15,
                    color: T.color.textLight,
                    textDecoration: "underline",
                    textUnderlineOffset: 3,
                    fontFamily: T.font.body,
                    padding: 0,
                  }}
                >
                  Already comfortable with AI? Skip to Foundation &rarr;
                </button>
              )}
            </div>
          );
        }

        if (step.type === "safety") {
          if (step.variant === "work") {
            return (
              <div>
                {BackButton}
                <SafetyInterstitial
                  title="Three things before we go further."
                  onContinue={advance}
                  sectionShapeIndex={1}
                  points={[
                    { title: "Your input leaves your computer.", body: "Everything you type goes to a server for processing. That's how all AI tools work. What to do: open Claude's Settings → Privacy right now and review what's shared. You control whether your conversations are used for training." },
                    { title: "Think before you paste work data.", body: "Does your company have an AI policy? If you don't know, find out before sharing real work content. What to do: ask your manager or IT team. Many companies have specific tools or plans approved for work use." },
                    { title: "You can choose your model.", body: "Claude has different models (Haiku, Sonnet, Opus) from fast and light to deep and capable. You can also enable extended thinking for complex tasks. You don't need to change anything now, but knowing the dial exists means you're never stuck with one setting." },
                  ]}
                />
              </div>
            );
          }
          // Personal path: data privacy + models
          return (
            <div>
              {BackButton}
              <SafetyInterstitial
                title="Two things to know before we keep going."
                onContinue={advance}
                sectionShapeIndex={1}
                points={[
                  { title: "Your input leaves your computer.", body: "Everything you type goes to a server for processing. That's how all AI tools work. What to do: open Claude's Settings → Privacy right now and review what's shared. You control whether your conversations are used for training." },
                  { title: "You can choose your model.", body: "Claude has different models (Haiku, Sonnet, Opus) from fast and light to deep and capable. You can also enable extended thinking for complex tasks. You don't need to change anything now, but knowing the dial exists means you're never stuck with one setting." },
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
                <SectionCelebration heroShapeIndex={1} intensity={1} />
                <h2 style={{
                  fontFamily: T.font.display, fontSize: "clamp(26px,5vw,34px)",
                  fontWeight: 400, fontStyle: "italic", lineHeight: 1.3,
                  color: T.color.text, margin: "0 0 12px 0",
                }}>
                  {isNovice ? "You just built something with AI." : "You just wrote code."}
                </h2>
                <p style={{
                  fontSize: 16, color: T.color.textMuted,
                  lineHeight: 1.7, maxWidth: 460, margin: "0 auto 8px",
                }}>
                  {isNovice
                    ? "You gave instructions, got results, and shaped the output. That's the whole loop. Now let's use it for something that matters to you."
                    : "It was easy. Hold onto that feeling. Now let's build something that matters."}
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
                    ["Prompt", "The instruction you give AI"],
                    ["Artifact", "An interactive output Claude builds for you"],
                    ["Iterate", "Refine the result by giving feedback"],
                  ].map(([term, def]) => (
                    <div key={term} style={{ fontSize: 14, lineHeight: 1.5, color: T.color.textMuted, padding: "3px 0" }}>
                      <strong style={{ color: T.color.text }}>{term}</strong> — {def}
                    </div>
                  ))}
                </div>
                <p style={{
                  fontSize: 15, color: T.color.textMuted,
                  lineHeight: 1.6, maxWidth: 440, margin: "16px auto 0",
                }}>
                  You've got the key safety habits down and momentum on your side.
                  This is a good place to take a break if you need one. Your progress is saved.
                  When you're ready, we'll build your actual project.
                </p>
                <ContinueButton onClick={onComplete} label="Keep building" />
              </div>
            </div>
          );
        }

        return null;
      }}
    />
  );
}
