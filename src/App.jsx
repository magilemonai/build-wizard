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

/* ━━━ Main App ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export default function App() {
  // welcome | transition | interview | pathcard | icebreaker-transition | icebreaker
  const [screen, setScreen] = useState("welcome");
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [currentValue, setCurrentValue] = useState(null);
  const [direction, setDirection] = useState(1);
  const [staggerReady, setStaggerReady] = useState(true);
  const [showFirstLabel, setShowFirstLabel] = useState(true);
  const [icebreakerProgress, setIcebreakerProgress] = useState(0);
  // Track whether user has visited icebreaker before (skip transition on re-entry)
  const hasVisitedIcebreaker = useRef(false);

  // Scroll to top on screen changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [screen]);

  const steps = useMemo(
    () => getInterviewSteps(answers),
    [answers.fork, answers.experience]
  );
  const currentStep = steps[stepIndex] || null;
  const totalSteps = steps.length;

  // Hide section label after first question
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

  // Preload the previous answer when going back
  useEffect(() => {
    if (currentStep && answers[currentStep.id] !== undefined && currentValue === null) {
      setCurrentValue(answers[currentStep.id]);
    }
  }, [stepIndex, currentStep]);

  const goToIcebreaker = useCallback(() => {
    if (hasVisitedIcebreaker.current) {
      setScreen("icebreaker");
    } else {
      setScreen("icebreaker-transition");
    }
  }, []);

  // ── Welcome ──
  if (screen === "welcome") {
    return (
      <>
        <GrainOverlay />
        <WelcomeScreen onBegin={() => setScreen("transition")} />
      </>
    );
  }

  // ── Threshold transition (welcome → interview) ──
  if (screen === "transition") {
    return (
      <>
        <GrainOverlay />
        <ThresholdInterstitial onComplete={() => setScreen("interview")} />
      </>
    );
  }

  // ── Threshold transition (pathcard → icebreaker) ──
  if (screen === "icebreaker-transition") {
    return (
      <>
        <GrainOverlay />
        <ThresholdInterstitial
          headline="Time to get your hands dirty."
          subtext="A few quick exercises. Copy, paste, see what happens."
          onComplete={() => {
            hasVisitedIcebreaker.current = true;
            setScreen("icebreaker");
          }}
        />
      </>
    );
  }

  // ── Interview + Path Card + Ice Breaker ──
  return (
    <>
      <GrainOverlay />
      <div style={{
        minHeight: "100vh", background: T.color.bg,
        fontFamily: T.font.body, color: T.color.text,
        overflowX: "hidden", position: "relative", zIndex: 1,
      }}>
        {screen === "interview" && (
          <JourneyProgress currentSection="interview" questionProgress={stepIndex / totalSteps} />
        )}
        {screen === "icebreaker" && (
          <JourneyProgress currentSection="icebreaker" questionProgress={icebreakerProgress} />
        )}

        <div style={{
          maxWidth: 600, margin: "0 auto", padding: "0 20px",
          paddingTop: (screen === "interview" || screen === "icebreaker") ? 72 : 48,
          paddingBottom: 80,
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
            <PageTransition transitionKey="pathcard" type="rise"
              onEntered={() => {}}>
              <div>
                <SectionLabel>Your Plan</SectionLabel>
                <h2 style={{
                  fontFamily: T.font.display, fontSize: "clamp(24px,5vw,30px)",
                  fontWeight: 400, margin: "0 0 24px 0", fontStyle: "italic",
                }}>
                  Here's what we're building.
                </h2>
                <SetupPrompt status={answers.setup} />
                <PathCard data={derivePathCard(answers)} onContinue={goToIcebreaker} />
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
              onComplete={() => {/* Section 3 not yet built */}}
              onBack={() => setScreen("pathcard")}
              onProgress={setIcebreakerProgress}
            />
          )}
        </div>
      </div>
    </>
  );
}
