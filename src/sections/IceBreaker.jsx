import T from "../tokens.js";
import SectionShell from "../components/SectionShell.jsx";
import SectionLabel from "../components/SectionLabel.jsx";
import PromptCard from "../components/PromptCard.jsx";
import SafetyInterstitial from "../components/SafetyInterstitial.jsx";
import ContinueButton from "../components/ContinueButton.jsx";
import OrganicShape from "../components/OrganicShape.jsx";

/* ━━━ Exercise Screen ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function ExerciseScreen({ exercise, onConfirm, showLabel }) {
  return (
    <div>
      {showLabel && <SectionLabel>Section 2 · Ice Breaker</SectionLabel>}
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
      <PromptCard
        key={exercise.id}
        prompt={exercise.prompt}
        context={exercise.context}
        onConfirm={onConfirm}
      />
      {exercise.hint && (
        <p style={{
          fontSize: 15, color: T.color.textMuted,
          marginTop: 14, lineHeight: 1.6,
          fontStyle: "italic",
        }}>
          {exercise.hint}
        </p>
      )}
      <div style={{
        marginTop: 14, padding: "10px 14px",
        background: T.color.bgSubtle,
        border: `1px solid ${T.color.border}`,
        borderRadius: 8,
        display: "flex", alignItems: "center", gap: 8,
        fontSize: 14, color: T.color.textMuted, lineHeight: 1.5,
      }}>
        <span style={{ fontSize: 16 }}>⏳</span>
        Claude may take a moment, especially if it's building an artifact. That's normal.
      </div>
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
      prompt: `Generate 5 random band names by combining a random adjective, a random animal, and a random occupation. Make them funny. Then generate 5 more that are even weirder.`,
      hint: "That's it. You just told an AI what to do and it did it. Everything from here is variations on that.",
    });
  } else {
    exercises.push({
      id: "band_names",
      title: "Quick warm-up. Something ridiculous.",
      description: "You know the drill. Copy this into Claude.",
      context: "Paste this into Claude:",
      prompt: `Write a Python script that generates 5 random band names by combining a random adjective with a random animal and a random occupation. Make them funny. Present the code and the output as an artifact I can see.`,
      hint: "If Claude asks to run the code, say yes.",
    });
  }

  if (isNovice) {
    exercises.push({
      id: "magic_8ball",
      title: "Now something a little more interactive.",
      description: "This time you'll give Claude more specific instructions. Same thing: copy and paste.",
      context: "Paste this into Claude:",
      prompt: `I want you to be a Magic 8-Ball. I'll ask you a yes-or-no question, and you respond in character: first say "The spirits are consulting..." then give me a mystical, funny answer. Make the answers more creative than the standard Magic -Ball responses.\n\nMy first question: Will I finish everything on my to-do list today?`,
      hint: "Try asking it a few more questions. Notice how it stays in character across the conversation.",
    });
  } else {
    exercises.push({
      id: "magic_8ball",
      title: "Now something interactive.",
      description: "A bit more structured this time. Copy it in.",
      context: "Paste this into Claude:",
      prompt: `Build a Magic 8-Ball as an interactive artifact. It should have a text input for my question, a dramatic pause animation, then reveal a funny mystical answer. Make the answers more creative than the standard ones. Present it as something I can actually use.`,
      hint: "Try asking it a few questions. Notice how Claude can build interactive tools, not just write text.",
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
        hint: "You just got Claude to build you a working tool. That's what we'll do for real in the next section, but more tailored to what you actually need.",
      });
    } else {
      exercises.push({
        id: "project_bridge",
        title: "One more. This one's yours.",
        description: "Let's turn your project idea into something tangible.",
        context: "Paste this into Claude:",
        prompt: `Build me a quick prototype related to: "${projectIdea.trim()}"\n\nMake it a working interactive artifact: something I can use, not just read. Keep it scrappy but functional. This is a warm-up, not the final version.`,
        hint: "Same pattern: describe what you want, Claude builds it, you refine from there. The next section does this for real.",
      });
    }
  } else {
    exercises.push({
      id: "project_bridge",
      title: "One more. This one actually builds something.",
      description: "Time to see Claude create a real tool you can use.",
      context: "Paste this into Claude:",
      prompt: `Build me a simple daily planner as an interactive artifact. It should let me type in tasks, set rough time estimates, and organize them into a prioritized schedule. Keep it clean and usable.`,
      hint: "You just got Claude to build you a working tool. That's the pattern for everything from here.",
    });
  }

  return exercises;
}

/* ━━━ Step sequence ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function buildStepSequence(exercises, isWork) {
  const steps = [];
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
export default function IceBreaker({ answers, onComplete, onBack, onProgress }) {
  const experience = answers.experience || "tried";
  const isNovice = experience === "never" || experience === "tried";
  const isWork = answers.fork === "work";
  const exercises = getExercises(answers);
  const steps = buildStepSequence(exercises, isWork);

  return (
    <SectionShell
      steps={steps}
      onBack={onBack}
      onProgress={onProgress}
      renderStep={({ step, stepIndex, advance, BackButton }) => {
        if (!step) return null;

        if (step.type === "exercise") {
          return (
            <div>
              {BackButton}
              <ExerciseScreen
                exercise={exercises[step.index]}
                onConfirm={advance}
                showLabel={stepIndex === 0}
              />
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
                  points={[
                    { title: "Your input leaves your computer.", body: "Everything you've typed went to a server. Claude processed it and sent results back. Check your privacy settings under Settings → Privacy." },
                    { title: "Think before you paste work data.", body: "Does your company have an AI policy? What plan are you on? If you don't know, ask your IT team or manager before sharing real work content." },
                    { title: "Models matter.", body: "Claude has different models (Haiku, Sonnet, Opus) ranging from fast and light to deep and capable. You can also enable \"extended thinking\" for complex tasks. You don't need to change anything now, but the dial exists." },
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
                points={[
                  { title: "Your input leaves your computer.", body: "Everything you've typed went to a server. Claude processed it and sent results back. Check your privacy settings in Claude under Settings → Privacy to see what's shared." },
                  { title: "Models matter.", body: "Claude has different models (Haiku, Sonnet, Opus) ranging from fast and light to deep and capable. You can also enable \"extended thinking\" for complex tasks. You don't need to change anything now, but the dial exists." },
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
                <div style={{ position: "relative", height: 80, marginBottom: 16 }}>
                  {[
                    { x: -90, y: -40, rot: -45, idx: 0, size: 10, color: T.color.copper },
                    { x: 70, y: -50, rot: 30, idx: 1, size: 8, color: T.color.sage },
                    { x: -50, y: -60, rot: -20, idx: 4, size: 6, color: `${T.color.copper}88` },
                    { x: 100, y: -30, rot: 50, idx: 2, size: 7, color: T.color.sage },
                    { x: -110, y: -20, rot: -60, idx: 3, size: 9, color: `${T.color.sage}88` },
                    { x: 40, y: -65, rot: 15, idx: 0, size: 5, color: T.color.copper },
                  ].map((p, i) => (
                    <div key={`scatter-${i}`} style={{
                      position: "absolute", left: "50%", top: "60%",
                      "--scatter-to": `translate(${p.x}px, ${p.y}px)`,
                      "--scatter-rot": `${p.rot}deg`,
                      animation: `celebrateScatter 0.8s ${T.ease.smooth} ${i * 0.04}s both`,
                    }}>
                      <OrganicShape shapeIndex={p.idx} size={p.size} color={p.color} />
                    </div>
                  ))}
                  <div style={{
                    position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)",
                    display: "flex", gap: 14, alignItems: "flex-end",
                  }}>
                    {[0, 1, 4, 2, 3].map((idx, i) => (
                      <div key={idx} style={{
                        animation: `celebrateBounce 0.7s ${T.ease.spring} ${0.3 + i * 0.08}s both, celebrateFloat 4s ease-in-out ${1.2 + i * 0.3}s infinite`,
                      }}>
                        <OrganicShape shapeIndex={idx} size={idx === 4 ? 26 : 20} color={i % 2 === 0 ? T.color.copper : T.color.sage} />
                      </div>
                    ))}
                  </div>
                </div>
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
                <p style={{
                  fontSize: 15, color: T.color.textMuted,
                  lineHeight: 1.6, maxWidth: 440, margin: "0 auto",
                }}>
                  Good stopping point, by the way. You've got the key safety habits down.
                  Come back when you're ready, or keep going now.
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
