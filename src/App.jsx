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

/* ━━━ Section transition config ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const SECTION_TRANSITIONS = {
  icebreaker:  { headline: "Time to get your hands dirty.", subtext: "A few quick exercises. Copy, paste, see what happens." },
  foundation:  { headline: "Now let's build your project.", subtext: "Three skills, one real thing at the end." },
  powerup:     { headline: "Time to level up.", subtext: "System prompts, workflows, and what's possible beyond conversation." },
  ship:        { headline: "Let's finish this.", subtext: "Review, reflect, and set up what comes next." },
};

const SECTIONS_WITH_PROGRESS = ["interview", "icebreaker", "foundation", "powerup", "ship"];

const SECTION_TITLES = {
  welcome: "Build Something Real with AI",
  transition: "Build Something Real with AI",
  interview: "Interview — Build Wizard",
  pathcard: "Your Plan — Build Wizard",
  icebreaker: "Ice Breaker — Build Wizard",
  foundation: "Foundation — Build Wizard",
  powerup: "Power Up — Build Wizard",
  ship: "Ship — Build Wizard",
};

/* ━━━ Main App ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export default function App() {
  const [screen, setScreen] = useState("welcome");
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [currentValue, setCurrentValue] = useState(null);
  const [direction, setDirection] = useState(1);
  const [staggerReady, setStaggerReady] = useState(true);
  const [showFirstLabel, setShowFirstLabel] = useState(true);
  const [sectionProgress, setSectionProgress] = useState({
    icebreaker: 0, foundation: 0, powerup: 0, ship: 0,
  });
  const visited = useRef(new Set());

  // Scroll to top and update page title on screen changes
  useEffect(() => {
    window.scrollTo(0, 0);
    const baseScreen = screen.replace(/-transition$/, "");
    document.title = SECTION_TITLES[baseScreen] || SECTION_TITLES[screen] || "Build Wizard";
  }, [screen]);

  // Restart: reset all state to initial values
  const restart = useCallback(() => {
    setScreen("welcome");
    setStepIndex(0);
    setAnswers({});
    setCurrentValue(null);
    setDirection(1);
    setStaggerReady(true);
    setShowFirstLabel(true);
    setSectionProgress({ icebreaker: 0, foundation: 0, powerup: 0, ship: 0 });
    visited.current.clear();
  }, []);

  const steps = useMemo(
    () => getInterviewSteps(answers),
    [answers.fork, answers.experience]
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
      setScreen("pathcard");
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
  }, [stepIndex, currentStep]);

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
    icebreaker: (value) => setSectionProgress((prev) => ({ ...prev, icebreaker: value })),
    foundation: (value) => setSectionProgress((prev) => ({ ...prev, foundation: value })),
    powerup: (value) => setSectionProgress((prev) => ({ ...prev, powerup: value })),
    ship: (value) => setSectionProgress((prev) => ({ ...prev, ship: value })),
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
  if (screen === "welcome") {
    return (
      <>
        <GrainOverlay />
        <WelcomeScreen onBegin={() => setScreen("transition")} />
      </>
    );
  }

  // ── Welcome → Interview transition ──
  if (screen === "transition") {
    return (
      <>
        <GrainOverlay />
        <ThresholdInterstitial onComplete={() => setScreen("interview")} />
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
  const progressValue = screen === "interview"
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
          maxWidth: 680, margin: "0 auto", padding: "0 20px",
          paddingTop: showProgress ? 72 : 48, paddingBottom: 80,
        }}>
          {screen === "interview" && currentStep && (
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

          {screen === "pathcard" && (
            <PageTransition transitionKey="pathcard" type="rise" onEntered={() => {}}>
              <div>
                <SectionLabel>Your Plan</SectionLabel>
                <h2 style={{
                  fontFamily: T.font.display, fontSize: "clamp(24px,5vw,30px)",
                  fontWeight: 400, margin: "0 0 24px 0", fontStyle: "italic",
                }}>
                  Here's what we're building.
                </h2>
                <SetupPrompt status={answers.setup} />
                <PathCard data={derivePathCard(answers)} onContinue={() => goToSection("icebreaker")} />
                <p style={{
                  marginTop: 36, fontSize: 13, color: T.color.textLight,
                  lineHeight: 1.65, textAlign: "center",
                }}>
                  Even if you stop here, you've got a project brief and a clear first step.<br />
                  That's already more than most people start with.
                </p>
              </div>
            </PageTransition>
          )}

          {screen === "icebreaker" && (
            <IceBreaker
              answers={answers}
              onComplete={() => goToSection("foundation")}
              onBack={() => setScreen("pathcard")}
              onProgress={progressUpdaters.icebreaker}
            />
          )}

          {screen === "foundation" && (
            <Foundation
              answers={answers}
              onComplete={() => goToSection("powerup")}
              onBack={() => setScreen("icebreaker")}
              onProgress={progressUpdaters.foundation}
            />
          )}

          {screen === "powerup" && (
            <PowerUp
              answers={answers}
              onComplete={() => goToSection("ship")}
              onBack={() => setScreen("foundation")}
              onProgress={progressUpdaters.powerup}
            />
          )}

          {screen === "ship" && (
            <Ship
              answers={answers}
              onBack={() => setScreen("powerup")}
              onProgress={progressUpdaters.ship}
            />
          )}
        </div>
      </div>
    </>
  );
}
