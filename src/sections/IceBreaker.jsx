import { useState, useCallback } from "react";
import T from "../tokens.js";
import PageTransition from "../components/PageTransition.jsx";
import SectionLabel from "../components/SectionLabel.jsx";
import PromptCard from "../components/PromptCard.jsx";
import SafetyInterstitial from "../components/SafetyInterstitial.jsx";
import ContinueButton from "../components/ContinueButton.jsx";
import BackButton from "../components/BackButton.jsx";

/* ━━━ Exercise Screen ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   A single exercise: headline, explanation, prompt card.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
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

/* ━━━ Section Anchor ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   The closing beat of Section 2.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
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

/* ━━━ Exercise definitions ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function getExercises(answers) {
  const exercises = [];

  // Exercise 1: Band name generator (silly, instant win)
  exercises.push({
    id: "band_names",
    title: "Let's start with something ridiculous.",
    description: "Copy this prompt into Claude in your other tab. Watch what happens.",
    context: "Paste this into Claude:",
    prompt: `Write a Python script that generates 5 random band names by combining a random adjective with a random animal and a random occupation. Make them funny. Then run the script.`,
    hint: "If Claude asks whether to run it, say yes. That's the whole point.",
  });

  // Exercise 2: Magic 8-Ball
  exercises.push({
    id: "magic_8ball",
    title: "Now something a little more interactive.",
    description: "This one takes a question and gives you a dramatic answer. Same thing: copy it into Claude.",
    context: "Paste this into Claude:",
    prompt: `Build a Magic 8-Ball in Python. It should ask me for a yes-or-no question, pause dramatically for 2 seconds (print "The spirits are consulting..." during the wait), then give me a random mystical answer. Make the answers funnier than the standard ones. Run it when you're done.`,
    hint: "Try asking it a few questions. Notice how Claude can run interactive programs, not just write them.",
  });

  // Exercise 3: Bridge to their project
  const projectType = answers.fork === "work" ? "work" : "personal";
  const projectIdea = answers.project_idea || "";

  if (projectIdea.trim()) {
    exercises.push({
      id: "project_bridge",
      title: "One more. This one's yours.",
      description: "We took what you told us about your project and turned it into a warm-up. This is a preview of what we'll build for real in the next section.",
      context: "Paste this into Claude:",
      prompt: projectType === "work"
        ? `I'm going to build a tool related to this: "${projectIdea.trim()}"\n\nBut first, as a warm-up: write a short Python script that asks me 3 quick questions about how I currently handle this task, then prints a funny but genuinely useful "efficiency score" with specific suggestions. Run it.`
        : `I'm interested in: "${projectIdea.trim()}"\n\nAs a warm-up: write a short Python script that asks me 3 fun questions about this interest, then generates a personalized and slightly ridiculous "expertise title" for me (like "Senior Vice President of Sourdough Strategy"). Run it.`,
      hint: "This is the same loop you'll use for the real build: describe what you want, let Claude write it, run it, see what happens.",
    });
  } else {
    exercises.push({
      id: "project_bridge",
      title: "One more. A little more useful this time.",
      description: "This one actually does something practical. Same drill: copy, paste, run.",
      context: "Paste this into Claude:",
      prompt: `Write a Python script that asks me what I'm working on today, then generates a prioritized to-do list with time estimates and one motivational (but not cheesy) quote. Run it.`,
      hint: "Notice the pattern: you described what you wanted in plain language, and Claude built it. That's the whole game.",
    });
  }

  return exercises;
}

/* ━━━ Step sequence ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Interleaves exercises with safety interstitials:
   exercise_0 → safety_0 → exercise_1 → safety_1 → exercise_2 → anchor
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function buildStepSequence(exercises) {
  const steps = [];

  steps.push({ type: "exercise", index: 0 });
  steps.push({ type: "safety", index: 0 });
  steps.push({ type: "exercise", index: 1 });
  steps.push({ type: "safety", index: 1 });

  if (exercises.length > 2) {
    steps.push({ type: "exercise", index: 2 });
  }

  steps.push({ type: "anchor" });

  return steps;
}

/* ━━━ IceBreaker Section ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export default function IceBreaker({ answers, onComplete, onBack }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const exercises = getExercises(answers);
  const stepSequence = buildStepSequence(exercises);
  const currentStep = stepSequence[stepIndex];

  const advance = useCallback(() => {
    setDirection(1);
    setStepIndex((i) => i + 1);
  }, []);

  const goBack = useCallback(() => {
    if (stepIndex <= 0) {
      onBack?.();
      return;
    }
    setDirection(-1);
    setStepIndex((i) => i - 1);
  }, [stepIndex, onBack]);

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
      if (currentStep.index === 0) {
        return (
          <div>
            <BackButton onClick={goBack} />
            <SafetyInterstitial
              title="Where did that just go?"
              onContinue={advance}
            >
              <p style={{ margin: "0 0 12px 0" }}>
                Everything you just typed went to a server. Claude processed it, ran your code,
                and sent the results back. That's how all AI tools work: your input leaves your computer.
              </p>
              <p style={{ margin: "0 0 12px 0" }}>
                With Claude Pro, your conversations aren't used for training by default. But that's
                not true for every tool or every plan. The settings matter, and they're worth checking.
              </p>
              <p style={{ margin: 0 }}>
                Take 30 seconds: in Claude, go to <strong>Settings → Privacy</strong> and look at what's
                turned on. If you're using a different tool, look for similar settings. They all have them.
                They're all in different places.
              </p>
            </SafetyInterstitial>
          </div>
        );
      }

      if (currentStep.index === 1) {
        return (
          <div>
            <BackButton onClick={goBack} />
            <SafetyInterstitial
              title="Read before you run."
              onContinue={advance}
            >
              <p style={{ margin: "0 0 12px 0" }}>
                That code Claude wrote? It worked great. But as you build more complex things,
                you'll want a habit: read through what it wrote before you run it.
              </p>
              <p style={{ margin: "0 0 12px 0" }}>
                Not because AI is malicious. Because running anything you haven't looked at is how
                surprises happen. A script that deletes files, sends data somewhere unexpected, or
                just does something you didn't ask for. It's rare, but "rare" and "never" aren't the same word.
              </p>
              <p style={{ margin: 0 }}>
                The habit is simple: <strong>scan the code, understand the gist, then run it.</strong> You
                don't need to understand every line. You need to understand what it's doing and whether
                that matches what you asked for.
              </p>
            </SafetyInterstitial>
          </div>
        );
      }
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
