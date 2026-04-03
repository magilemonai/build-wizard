import { useState, useCallback } from "react";
import T from "../tokens.js";
import PageTransition from "../components/PageTransition.jsx";
import SectionLabel from "../components/SectionLabel.jsx";
import PromptCard from "../components/PromptCard.jsx";
import SafetyInterstitial from "../components/SafetyInterstitial.jsx";
import ContinueButton from "../components/ContinueButton.jsx";
import BackButton from "../components/BackButton.jsx";

/* ━━━ Exercise Screen ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function ExerciseScreen({ exercise, onConfirm, showLabel }) {
  return (
    <div>
      {showLabel && <SectionLabel>Section 2 · Ice Breaker</SectionLabel>}
      <h2 style={{
        fontFamily: T.font.display, fontSize: "clamp(24px,5vw,30px)",
        fontWeight: 400, lineHeight: 1.3, margin: "0 0 8px 0",
        color: T.color.text,
      }}>
        {exercise.title}
      </h2>
      <p style={{
        fontSize: 15, color: T.color.textMuted,
        margin: "0 0 4px 0", lineHeight: 1.65,
      }}>
        {exercise.description}
      </p>
      <PromptCard
        prompt={exercise.prompt}
        context={exercise.context}
        onConfirm={onConfirm}
      />
      {exercise.hint && (
        <p style={{
          fontSize: 13, color: T.color.textLight,
          marginTop: 12, lineHeight: 1.6,
        }}>
          {exercise.hint}
        </p>
      )}
    </div>
  );
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
        You just wrote code.
      </h2>
      <p style={{
        fontSize: 16, color: T.color.textMuted,
        lineHeight: 1.7, maxWidth: 420, margin: "0 auto 8px",
      }}>
        It was easy. Hold onto that feeling.
        Now let's build something that matters.
      </p>
      <p style={{
        fontSize: 13, color: T.color.textLight,
        lineHeight: 1.6, maxWidth: 400, margin: "0 auto",
      }}>
        Good stopping point, by the way. You ran code, and you've got the two
        most important safety habits down. Come back when you're ready, or
        keep going now.
      </p>
      <ContinueButton onClick={onContinue} label="Keep building" />
    </div>
  );
}

/* ━━━ Exercise definitions ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Exercises adapt based on experience level:
   - Newcomers get simpler, sillier prompts (no "run" assumption)
   - Experienced users get more direct, project-focused prompts
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function getExercises(answers) {
  const exercises = [];
  const experience = answers.experience || "tried";
  const isNovice = experience === "never" || experience === "tried";

  // Exercise 1: Silly warm-up
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
      prompt: `Write a Python script that generates 5 random band names by combining a random adjective with a random animal and a random occupation. Make them funny. Then run it.`,
      hint: "If Claude asks to run the code, say yes.",
    });
  }

  // Exercise 2: Slightly more structured
  if (isNovice) {
    exercises.push({
      id: "magic_8ball",
      title: "Now something a little more interactive.",
      description: "This time you'll give Claude more specific instructions. Same thing: copy and paste.",
      context: "Paste this into Claude:",
      prompt: `I want you to be a Magic 8-Ball. I'll ask you a yes-or-no question, and you respond in character: first say "The spirits are consulting..." then give me a mystical, funny answer. Make the answers more creative than the standard Magic 8-Ball responses.\n\nMy first question: Will I finish everything on my to-do list today?`,
      hint: "Try asking it a few more questions. Notice how it stays in character across the conversation.",
    });
  } else {
    exercises.push({
      id: "magic_8ball",
      title: "Now something interactive.",
      description: "A bit more structured this time. Copy it in.",
      context: "Paste this into Claude:",
      prompt: `Build a Magic 8-Ball in Python. It should ask me for a yes-or-no question, pause dramatically for 2 seconds (print "The spirits are consulting..." during the wait), then give a random mystical answer. Make the answers funnier than the standard ones. Run it.`,
      hint: "Try asking it a few questions. Notice how Claude handles interactive programs.",
    });
  }

  // Exercise 3: Bridge to their project (lighter, less complex)
  const projectIdea = answers.project_idea || "";

  if (projectIdea.trim()) {
    exercises.push({
      id: "project_bridge",
      title: "One more. This one's about you.",
      description: "We turned your project idea into a quick warm-up.",
      context: "Paste this into Claude:",
      prompt: `I'm interested in building something related to: "${projectIdea.trim()}"\n\nGive me a fun, personalized "readiness score" for this project. Ask me 3 quick questions first, then rate me on a scale of 1-10 with a funny title for my score level.`,
      hint: "Same pattern every time: tell Claude what you want, see what comes back, adjust from there.",
    });
  } else {
    exercises.push({
      id: "project_bridge",
      title: "One more. A little more useful this time.",
      description: "This one does something you might actually use again.",
      context: "Paste this into Claude:",
      prompt: `Ask me what I'm working on today, then give me a prioritized to-do list with rough time estimates and one genuinely good (not cheesy) piece of advice for the day.`,
      hint: "Notice the pattern: you described what you wanted in plain language, and Claude built it. That's the whole game.",
    });
  }

  return exercises;
}

/* ━━━ Step sequence ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   exercise_0 → exercise_1 → safety → exercise_2 → anchor

   Safety lessons grouped after the second exercise so the first
   two exercises flow uninterrupted. Users build momentum before
   we pause for reflection.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function buildStepSequence(exercises) {
  const steps = [];

  steps.push({ type: "exercise", index: 0 });
  steps.push({ type: "exercise", index: 1 });
  steps.push({ type: "safety" });

  if (exercises.length > 2) {
    steps.push({ type: "exercise", index: 2 });
  }

  steps.push({ type: "anchor" });

  return steps;
}

/* ━━━ IceBreaker Section ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export default function IceBreaker({ answers, onComplete, onBack, onProgress }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const exercises = getExercises(answers);
  const stepSequence = buildStepSequence(exercises);
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

    if (currentStep.type === "exercise") {
      return (
        <div>
          {stepIndex > 0 && <BackButton onClick={goBack} />}
          <ExerciseScreen
            exercise={exercises[currentStep.index]}
            onConfirm={advance}
            showLabel={stepIndex === 0}
          />
        </div>
      );
    }

    if (currentStep.type === "safety") {
      return (
        <div>
          <BackButton onClick={goBack} />
          <SafetyInterstitial
            title="Two things to know before we keep going."
            onContinue={advance}
          >
            <p style={{ margin: "0 0 16px 0" }}>
              <strong style={{ color: T.color.text }}>Your input leaves your computer.</strong>{" "}
              Everything you've typed went to a server. Claude processed it and sent results back.
              That's how all AI tools work. Check your privacy settings in Claude under{" "}
              <strong>Settings → Privacy</strong> to see what's shared.
            </p>
            <p style={{ margin: 0 }}>
              <strong style={{ color: T.color.text }}>Read before you run.</strong>{" "}
              When Claude writes code, scan it before executing. You don't need to understand
              every line. You need to know what it's doing and whether that matches what you asked for.
              "Rare" and "never" aren't the same word.
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
