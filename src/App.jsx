import { useState, useEffect, useCallback, useRef } from "react";
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
import WelcomeBack from "./sections/WelcomeBack.jsx";
import ThresholdInterstitial from "./sections/ThresholdInterstitial.jsx";
import { derivePathCard } from "./data/projectTemplates.js";
import IceBreaker from "./sections/IceBreaker.jsx";
import Foundation from "./sections/Foundation.jsx";
import PowerUp from "./sections/PowerUp.jsx";
import Ship from "./sections/Ship.jsx";
import { SCREENS } from "./screens.js";

import useInterview from "./hooks/useInterview.js";
import useProgress from "./hooks/useProgress.js";
import useAnalytics from "./hooks/useAnalytics.js";
import { useSavedState, saveState, clearSavedState } from "./hooks/usePersistence.js";

/* ━━━ Config ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
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

/* Quick Path: skip IceBreaker for 30-minute users who have experience */
function shouldUseQuickPath(answers) {
  return answers.time === "30min" && (answers.experience === "occasional" || answers.experience === "regular");
}

/* ━━━ Main App ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export default function App() {
  const savedRef = useSavedState();
  const saved = savedRef.current;
  const hasSaved = !!saved && saved.screen !== SCREENS.WELCOME;

  // Show welcome-back screen if returning user
  const [showResumeScreen, setShowResumeScreen] = useState(hasSaved);
  const [screen, setScreen] = useState(() => saved?.screen || SCREENS.WELCOME);

  const interview = useInterview(saved, setScreen);
  const progress = useProgress(saved, setScreen);
  const analytics = useAnalytics();

  // Quick path flag
  const isQuickPath = shouldUseQuickPath(interview.answers);

  // Scroll to top and update page title
  useEffect(() => {
    window.scrollTo(0, 0);
    const baseScreen = screen.replace(/-transition$/, "");
    document.title = SECTION_TITLES[baseScreen] || SECTION_TITLES[screen] || "Build Wizard";
  }, [screen]);

  // Persist state on meaningful changes
  useEffect(() => {
    if (screen === SCREENS.WELCOME) return;
    saveState({
      screen,
      stepIndex: interview.stepIndex,
      answers: interview.answers,
      sectionProgress: progress.sectionProgress,
      sectionSteps: progress.sectionSteps,
      visited: [...progress.visited.current],
    });
  }, [screen, interview.stepIndex, interview.answers, progress.sectionProgress, progress.sectionSteps]);

  // Restart: clear everything
  const restart = useCallback(() => {
    clearSavedState();
    setScreen(SCREENS.WELCOME);
    setShowResumeScreen(false);
    interview.resetInterview();
    progress.resetProgress();
  }, [interview, progress]);

  // Section navigation helpers
  const navigateToSection = useCallback((section) => {
    analytics.trackSectionStart(section);
    progress.goToSection(section);
  }, [analytics, progress]);

  // Clickable progress bar: jump to a completed or current section
  const handleProgressClick = useCallback((sectionKey) => {
    const sectionOrder = [SCREENS.INTERVIEW, SCREENS.ICEBREAKER, SCREENS.FOUNDATION, SCREENS.POWERUP, SCREENS.SHIP];
    const currentIdx = sectionOrder.indexOf(screen);
    const targetIdx = sectionOrder.indexOf(sectionKey);
    // Can only click current or past sections
    if (targetIdx <= currentIdx && targetIdx >= 0) {
      setScreen(sectionKey);
    }
  }, [screen]);

  // Expose restart for testing
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

  // Determine if current screen is a section transition
  const transitionMatch = screen.match(/^(.+)-transition$/);
  const transitionSection = transitionMatch?.[1];
  const transitionConfig = transitionSection && SECTION_TRANSITIONS[transitionSection];

  // ── Welcome Back (returning user) ──
  if (showResumeScreen) {
    return (
      <>
        <GrainOverlay />
        <WelcomeBack
          savedScreen={saved?.screen}
          projectIdea={saved?.answers?.project_idea}
          onResume={() => {
            setShowResumeScreen(false);
            analytics.trackResume(saved?.screen);
          }}
          onStartOver={() => {
            restart();
          }}
        />
      </>
    );
  }

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

  // ── Section transitions ──
  if (transitionConfig) {
    return (
      <>
        <GrainOverlay />
        <ThresholdInterstitial
          headline={transitionConfig.headline}
          subtext={transitionConfig.subtext}
          onComplete={() => {
            progress.markVisited(transitionSection);
            setScreen(transitionSection);
          }}
        />
      </>
    );
  }

  // ── Active sections ──
  const showProgress = SECTIONS_WITH_PROGRESS.includes(screen);
  const progressValue = screen === SCREENS.INTERVIEW
    ? interview.stepIndex / interview.totalSteps
    : progress.sectionProgress[screen] || 0;

  // Quick path: IceBreaker → Foundation (skip exercises)
  const iceOnComplete = isQuickPath
    ? () => { analytics.trackQuickPath(); navigateToSection(SCREENS.FOUNDATION); }
    : () => navigateToSection(SCREENS.FOUNDATION);

  return (
    <>
      <GrainOverlay />
      <div style={{
        minHeight: "100vh", background: T.color.bg,
        fontFamily: T.font.body, color: T.color.text,
        overflowX: "hidden", position: "relative", zIndex: 1,
      }}>
        {showProgress && (
          <JourneyProgress
            currentSection={screen}
            questionProgress={progressValue}
            onSectionClick={handleProgressClick}
          />
        )}

        <div style={{
          maxWidth: 740, margin: "0 auto", padding: "0 24px",
          paddingTop: showProgress ? 88 : 48, paddingBottom: 80,
        }}>
          {screen === SCREENS.INTERVIEW && interview.currentStep && (
            <PageTransition transitionKey={interview.stepIndex} type="page"
              direction={interview.direction} onEntered={interview.handleTransitionEntered}>
              <div>
                {interview.stepIndex > 0 && <BackButton onClick={interview.navigateBack} />}

                {interview.showFirstLabel && interview.stepIndex === 0 && (
                  <SectionLabel>Section 1 · The Interview</SectionLabel>
                )}

                <InterviewQuestion
                  key={interview.stepIndex}
                  question={interview.currentStep.question}
                  subtext={interview.currentStep.subtext}
                  type={interview.currentStep.type}
                  options={interview.currentStep.options}
                  value={interview.currentValue}
                  onChange={interview.setCurrentValue}
                  onContinue={interview.navigateForward}
                  placeholder={interview.currentStep.placeholder}
                  staggerReady={interview.staggerReady}
                  notice={
                    interview.currentStep.id === "fork" && interview.currentValue === "work"
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
            <PageTransition transitionKey={SCREENS.PATHCARD} type="rise" onEntered={() => {
              analytics.trackInterviewComplete(interview.answers);
            }}>
              <div>
                <SectionLabel>Your Plan</SectionLabel>
                <h2 style={{
                  fontFamily: T.font.display, fontSize: "clamp(24px,5vw,30px)",
                  fontWeight: 400, margin: "0 0 24px 0", fontStyle: "italic",
                }}>
                  Here's what we're building.
                </h2>
                <SetupPrompt status={interview.answers.setup} />
                <PathCard
                  data={derivePathCard(interview.answers)}
                  onContinue={() => {
                    if (isQuickPath) {
                      analytics.trackQuickPath();
                      navigateToSection(SCREENS.FOUNDATION);
                    } else {
                      navigateToSection(SCREENS.ICEBREAKER);
                    }
                  }}
                  quickPath={isQuickPath}
                />
                {interview.answers.setup !== "ready" && (
                  <p style={{
                    marginTop: 24, fontSize: 14, color: T.color.textLight,
                    lineHeight: 1.6, textAlign: "center",
                  }}>
                    On Claude's free plan, you have a daily message limit. If you run out mid-session,
                    you can come back tomorrow and pick up where you left off.
                  </p>
                )}
                <p style={{
                  marginTop: interview.answers.setup !== "ready" ? 12 : 36,
                  fontSize: 15, color: T.color.textMuted,
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
              answers={interview.answers}
              onComplete={iceOnComplete}
              onBack={() => setScreen(SCREENS.PATHCARD)}
              onProgress={progress.progressUpdaters[SCREENS.ICEBREAKER]}
              initialStep={progress.sectionSteps[SCREENS.ICEBREAKER]}
              onStepChange={progress.stepUpdaters[SCREENS.ICEBREAKER]}
            />
          )}

          {screen === SCREENS.FOUNDATION && (
            <Foundation
              answers={interview.answers}
              onComplete={() => navigateToSection(SCREENS.POWERUP)}
              onBack={() => setScreen(isQuickPath ? SCREENS.PATHCARD : SCREENS.ICEBREAKER)}
              onProgress={progress.progressUpdaters[SCREENS.FOUNDATION]}
              initialStep={progress.sectionSteps[SCREENS.FOUNDATION]}
              onStepChange={progress.stepUpdaters[SCREENS.FOUNDATION]}
            />
          )}

          {screen === SCREENS.POWERUP && (
            <PowerUp
              answers={interview.answers}
              onComplete={() => navigateToSection(SCREENS.SHIP)}
              onBack={() => setScreen(SCREENS.FOUNDATION)}
              onProgress={progress.progressUpdaters[SCREENS.POWERUP]}
              initialStep={progress.sectionSteps[SCREENS.POWERUP]}
              onStepChange={progress.stepUpdaters[SCREENS.POWERUP]}
            />
          )}

          {screen === SCREENS.SHIP && (
            <Ship
              answers={interview.answers}
              onBack={() => setScreen(SCREENS.POWERUP)}
              onProgress={progress.progressUpdaters[SCREENS.SHIP]}
              initialStep={progress.sectionSteps[SCREENS.SHIP]}
              onStepChange={progress.stepUpdaters[SCREENS.SHIP]}
            />
          )}
        </div>
      </div>
    </>
  );
}
