import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import T from "./tokens.js";
import GrainOverlay from "./components/GrainOverlay.jsx";
import PageTransition from "./components/PageTransition.jsx";
import BackButton from "./components/BackButton.jsx";
import SectionLabel from "./components/SectionLabel.jsx";
import JourneyProgress from "./components/JourneyProgress.jsx";
import InterviewQuestion from "./components/InterviewQuestion.jsx";
import PathCard from "./components/PathCard.jsx";
import SetupPrompt from "./components/SetupPrompt.jsx";
import WelcomeScreen from "./sections/WelcomeScreen.jsx";
import ThresholdInterstitial from "./sections/ThresholdInterstitial.jsx";
import getInterviewSteps from "./data/interviewSteps.js";
import { derivePathCard } from "./data/projectTemplates.js";
import IceBreaker from "./sections/IceBreaker.jsx";
import Foundation from "./sections/Foundation.jsx";
import PowerUp from "./sections/PowerUp.jsx";
import Ship from "./sections/Ship.jsx";
import { SCREENS } from "./screens.js";

/* ━━━ Section transition config ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const SECTION_TRANSITIONS = {
  [SCREENS.ICEBREAKER]:  { headline: "Time to get your hands dirty.", subtext: "A few quick exercises. Copy, paste, see what happens." },
  [SCREENS.FOUNDATION]:  { headline: "Now let's build your project.", subtext: "Three skills, one real thing at the end." },
  [SCREENS.POWERUP]:     { headline: "Time to level up.", subtext: "System prompts, workflows, and what's possible beyond conversation." },
  [SCREENS.SHIP]:        { headline: "Let's finish this.", subtext: "Review, reflect, and set up what comes next." },
};

const SECTIONS_WITH_PROGRESS = [SCREENS.INTERVIEW, SCREENS.ICEBREAKER, SCREENS.FOUNDATION, SCREENS.POWERUP, SCREENS.SHIP];

const SECTION_TITLES = {
  [SCREENS.WELCOME]: "Build Something Real with AI",
  [SCREENS.TRANSITION]: "Build Something Real with AI",
  [SCREENS.INTERVIEW]: "Interview — Build Wizard",
  [SCREENS.PATHCARD]: "Your Plan — Build Wizard",
  [SCREENS.ICEBREAKER]: "Ice Breaker — Build Wizard",
  [SCREENS.FOUNDATION]: "Foundation — Build Wizard",
  [SCREENS.POWERUP]: "Power Up — Build Wizard",
  [SCREENS.SHIP]: "Ship — Build Wizard",
};

/* ━━━ Main App ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/* ━━━ Persistence helpers ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const STORAGE_KEY = "build-wizard-state";

function loadSavedState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch { return null; }
}

function saveState(state) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
}

function clearSavedState() {
  try { localStorage.removeItem(STORAGE_KEY); } catch {}
}

const defaultProgress = { [SCREENS.ICEBREAKER]: 0, [SCREENS.FOUNDATION]: 0, [SCREENS.POWERUP]: 0, [SCREENS.SHIP]: 0 };
const defaultSteps = { [SCREENS.ICEBREAKER]: 0, [SCREENS.FOUNDATION]: 0, [SCREENS.POWERUP]: 0, [SCREENS.SHIP]: 0 };

export default function App() {
  const saved = useRef(loadSavedState());
  const [screen, setScreen] = useState(() => saved.current?.screen || SCREENS.WELCOME);
  const [stepIndex, setStepIndex] = useState(() => saved.current?.stepIndex || 0);
  const [answers, setAnswers] = useState(() => saved.current?.answers || {});
  const [currentValue, setCurrentValue] = useState(null);
  const [direction, setDirection] = useState(1);
  const [staggerReady, setStaggerReady] = useState(true);
  const [showFirstLabel, setShowFirstLabel] = useState(() => !saved.current);
  const [sectionProgress, setSectionProgress] = useState(() => saved.current?.sectionProgress || { ...defaultProgress });
  const [sectionSteps, setSectionSteps] = useState(() => saved.current?.sectionSteps || { ...defaultSteps });
  const visited = useRef(new Set(saved.current?.visited || []));

  // Scroll to top and update page title on screen changes
  useEffect(() => {
    window.scrollTo(0, 0);
    const baseScreen = screen.replace(/-transition$/, "");
    document.title = SECTION_TITLES[baseScreen] || SECTION_TITLES[screen] || "Build Wizard";
  }, [screen]);

  // Persist state to localStorage on meaningful changes
  useEffect(() => {
    if (screen === SCREENS.WELCOME) return; // Don't save initial state
    saveState({
      screen, stepIndex, answers, sectionProgress, sectionSteps,
      visited: [...visited.current],
    });
  }, [screen, stepIndex, answers, sectionProgress, sectionSteps]);

  // Restart: reset all state to initial values and clear saved progress
  const restart = useCallback(() => {
    clearSavedState();
    setScreen(SCREENS.WELCOME);
    setStepIndex(0);
    setAnswers({});
    setCurrentValue(null);
    setDirection(1);
    setStaggerReady(true);
    setShowFirstLabel(true);
    setSectionProgress({ ...defaultProgress });
    setSectionSteps({ ...defaultSteps });
    visited.current.clear();
  }, []);

  const steps = useMemo(
    () => getInterviewSteps(answers),
    [answers]
  );
  const currentStep = steps[stepIndex] || null;
  const totalSteps = steps.length;

  useEffect(() => {
    if (stepIndex > 0) setShowFirstLabel(false);
  }, [stepIndex]);

  const navigateForward = useCallback(() => {
    if (!currentStep) return;
    const updated = { ...answers, [currentStep.id]: currentValue };
    setAnswers(updated);
    setCurrentValue(null);
    setStaggerReady(false);
    setDirection(1);
    if (currentStep.id === "setup") {
      setScreen(SCREENS.PATHCARD);
    } else {
      setStepIndex((i) => i + 1);
    }
  }, [currentStep, currentValue, answers]);

  const navigateBack = useCallback(() => {
    if (stepIndex <= 0) return;
    setCurrentValue(null);
    setStaggerReady(false);
    setDirection(-1);
    setStepIndex((i) => i - 1);
  }, [stepIndex]);

  const handleTransitionEntered = useCallback(() => {
    setStaggerReady(true);
  }, []);

  useEffect(() => {
    if (currentStep && answers[currentStep.id] !== undefined && currentValue === null) {
      setCurrentValue(answers[currentStep.id]);
    }
  }, [stepIndex, currentStep, answers]);

  // Generic section navigation: skip transition on re-entry
  const goToSection = useCallback((section) => {
    if (visited.current.has(section)) {
      setScreen(section);
    } else {
      setScreen(`${section}-transition`);
    }
  }, []);

  // Stable progress updaters (one per section, memoized)
  const progressUpdaters = useMemo(() => ({
    [SCREENS.ICEBREAKER]: (value) => setSectionProgress((prev) => ({ ...prev, [SCREENS.ICEBREAKER]: value })),
    [SCREENS.FOUNDATION]: (value) => setSectionProgress((prev) => ({ ...prev, [SCREENS.FOUNDATION]: value })),
    [SCREENS.POWERUP]: (value) => setSectionProgress((prev) => ({ ...prev, [SCREENS.POWERUP]: value })),
    [SCREENS.SHIP]: (value) => setSectionProgress((prev) => ({ ...prev, [SCREENS.SHIP]: value })),
  }), []);

  // Stable step index updaters (persist section position for back nav)
  const stepUpdaters = useMemo(() => ({
    [SCREENS.ICEBREAKER]: (value) => setSectionSteps((prev) => ({ ...prev, [SCREENS.ICEBREAKER]: value })),
    [SCREENS.FOUNDATION]: (value) => setSectionSteps((prev) => ({ ...prev, [SCREENS.FOUNDATION]: value })),
    [SCREENS.POWERUP]: (value) => setSectionSteps((prev) => ({ ...prev, [SCREENS.POWERUP]: value })),
    [SCREENS.SHIP]: (value) => setSectionSteps((prev) => ({ ...prev, [SCREENS.SHIP]: value })),
  }), []);

  // Determine if current screen is a section transition
  const transitionMatch = screen.match(/^(.+)-transition$/);
  const transitionSection = transitionMatch?.[1];
  const transitionConfig = transitionSection && SECTION_TRANSITIONS[transitionSection];

  // Expose restart for testing (console: __restart())
  useEffect(() => {
    window.__restart = restart;
    const handleKey = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === "R") {
        e.preventDefault();
        restart();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => {
      delete window.__restart;
      window.removeEventListener("keydown", handleKey);
    };
  }, [restart]);

  // ── Welcome ──
  if (screen === SCREENS.WELCOME) {
    return (
      <>
        <GrainOverlay />
        <WelcomeScreen onBegin={() => setScreen(SCREENS.TRANSITION)} />
      </>
    );
  }

  // ── Welcome → Interview transition ──
  if (screen === SCREENS.TRANSITION) {
    return (
      <>
        <GrainOverlay />
        <ThresholdInterstitial onComplete={() => setScreen(SCREENS.INTERVIEW)} />
      </>
    );
  }

  // ── Section transitions (icebreaker, foundation, powerup, ship) ──
  if (transitionConfig) {
    return (
      <>
        <GrainOverlay />
        <ThresholdInterstitial
          headline={transitionConfig.headline}
          subtext={transitionConfig.subtext}
          onComplete={() => {
            visited.current.add(transitionSection);
            setScreen(transitionSection);
          }}
        />
      </>
    );
  }

  // ── Active sections ──
  const showProgress = SECTIONS_WITH_PROGRESS.includes(screen);
  const progressValue = screen === SCREENS.INTERVIEW
    ? stepIndex / totalSteps
    : sectionProgress[screen] || 0;

  return (
    <>
      <GrainOverlay />
      <div style={{
        minHeight: "100vh", background: T.color.bg,
        fontFamily: T.font.body, color: T.color.text,
        overflowX: "hidden", position: "relative", zIndex: 1,
      }}>
        {showProgress && (
          <JourneyProgress currentSection={screen} questionProgress={progressValue} />
        )}

        <div style={{
          maxWidth: 740, margin: "0 auto", padding: "0 24px",
          paddingTop: showProgress ? 88 : 48, paddingBottom: 80,
        }}>
          {screen === SCREENS.INTERVIEW && currentStep && (
            <PageTransition transitionKey={stepIndex} type="page"
              direction={direction} onEntered={handleTransitionEntered}>
              <div>
                {stepIndex > 0 && <BackButton onClick={navigateBack} />}

                {showFirstLabel && stepIndex === 0 && (
                  <SectionLabel>Section 1 · The Interview</SectionLabel>
                )}

                <InterviewQuestion
                  key={stepIndex}
                  question={currentStep.question}
                  subtext={currentStep.subtext}
                  type={currentStep.type}
                  options={currentStep.options}
                  value={currentValue}
                  onChange={setCurrentValue}
                  onContinue={navigateForward}
                  placeholder={currentStep.placeholder}
                  staggerReady={staggerReady}
                  notice={
                    currentStep.id === "fork" && currentValue === "work"
                      ? {
                          title: "While we're at it",
                          body: "Some workplaces have policies about which AI tools you can use and what data you can share with them. If you're not sure whether yours does, that's worth a quick check with your manager or IT team before you start building with real work data. We'll cover safe data handling in the build sections.",
                        }
                      : null
                  }
                />
              </div>
            </PageTransition>
          )}

          {screen === SCREENS.PATHCARD && (
            <PageTransition transitionKey={SCREENS.PATHCARD} type="rise" onEntered={() => {}}>
              <div>
                <SectionLabel>Your Plan</SectionLabel>
                <h2 style={{
                  fontFamily: T.font.display, fontSize: "clamp(24px,5vw,30px)",
                  fontWeight: 400, margin: "0 0 24px 0", fontStyle: "italic",
                }}>
                  Here's what we're building.
                </h2>
                <SetupPrompt status={answers.setup} />
                <PathCard data={derivePathCard(answers)} onContinue={() => goToSection(SCREENS.ICEBREAKER)} />
                {answers.setup !== "ready" && (
                  <p style={{
                    marginTop: 24, fontSize: 14, color: T.color.textLight,
                    lineHeight: 1.6, textAlign: "center",
                  }}>
                    On Claude's free plan, you have a daily message limit. If you run out mid-session,
                    you can come back tomorrow and pick up where you left off.
                  </p>
                )}
                <p style={{
                  marginTop: answers.setup !== "ready" ? 12 : 36, fontSize: 15, color: T.color.textMuted,
                  lineHeight: 1.65, textAlign: "center",
                }}>
                  You've got a project brief and a clear first step.<br />
                  Let's turn it into something real.
                </p>
              </div>
            </PageTransition>
          )}

          {screen === SCREENS.ICEBREAKER && (
            <IceBreaker
              answers={answers}
              onComplete={() => goToSection(SCREENS.FOUNDATION)}
              onBack={() => setScreen(SCREENS.PATHCARD)}
              onProgress={progressUpdaters[SCREENS.ICEBREAKER]}
              initialStep={sectionSteps[SCREENS.ICEBREAKER]}
              onStepChange={stepUpdaters[SCREENS.ICEBREAKER]}
            />
          )}

          {screen === SCREENS.FOUNDATION && (
            <Foundation
              answers={answers}
              onComplete={() => goToSection(SCREENS.POWERUP)}
              onBack={() => setScreen(SCREENS.ICEBREAKER)}
              onProgress={progressUpdaters[SCREENS.FOUNDATION]}
              initialStep={sectionSteps[SCREENS.FOUNDATION]}
              onStepChange={stepUpdaters[SCREENS.FOUNDATION]}
            />
          )}

          {screen === SCREENS.POWERUP && (
            <PowerUp
              answers={answers}
              onComplete={() => goToSection(SCREENS.SHIP)}
              onBack={() => setScreen(SCREENS.FOUNDATION)}
              onProgress={progressUpdaters[SCREENS.POWERUP]}
              initialStep={sectionSteps[SCREENS.POWERUP]}
              onStepChange={stepUpdaters[SCREENS.POWERUP]}
            />
          )}

          {screen === SCREENS.SHIP && (
            <Ship
              answers={answers}
              onBack={() => setScreen(SCREENS.POWERUP)}
              onProgress={progressUpdaters[SCREENS.SHIP]}
              initialStep={sectionSteps[SCREENS.SHIP]}
              onStepChange={stepUpdaters[SCREENS.SHIP]}
            />
          )}
        </div>
      </div>
    </>
  );
}
