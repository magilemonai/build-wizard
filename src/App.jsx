import { useState, useEffect, useCallback, useRef } from "react";
import T from "./tokens.js";
import GrainOverlay from "./components/GrainOverlay.jsx";
import PageTransition from "./components/PageTransition.jsx";
import BackButton from "./components/BackButton.jsx";
import SectionLabel from "./components/SectionLabel.jsx";
import JourneyProgress from "./components/JourneyProgress.jsx";
import InterviewQuestion from "./components/InterviewQuestion.jsx";
import PathCard from "./components/PathCard.jsx";
import ProjectCoachCard from "./components/ProjectCoachCard.jsx";
import SetupPrompt from "./components/SetupPrompt.jsx";
import WelcomeScreen from "./sections/WelcomeScreen.jsx";
import WelcomeBack from "./sections/WelcomeBack.jsx";
import ThresholdInterstitial from "./sections/ThresholdInterstitial.jsx";
import IceBreaker from "./sections/IceBreaker.jsx";
import Foundation from "./sections/Foundation.jsx";
import PowerUp from "./sections/PowerUp.jsx";
import Ship from "./sections/Ship.jsx";
import { SCREENS } from "./screens.js";

import useInterview from "./hooks/useInterview.js";
import useProgress from "./hooks/useProgress.js";
import useAnalytics from "./hooks/useAnalytics.js";
import { useSavedState, saveState, clearSavedState } from "./hooks/usePersistence.js";
import { track } from "./services/analytics.js";

/* ━━━ Config ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const SECTION_TRANSITIONS = {
  [SCREENS.ICEBREAKER]:  { headline: "Let's try a few things.", subtext: "Quick exercises. Copy, paste, see what Claude does." },
  [SCREENS.FOUNDATION]:  { headline: "Now let's build your project.", subtext: "Three skills, one finished project." },
  [SCREENS.POWERUP]:     { headline: "Time to go further.", subtext: "System prompts, workflows, and what's possible beyond conversation." },
  [SCREENS.SHIP]:        { headline: "Almost done.", subtext: "Review, reflect, and plan what's next." },
};

const SECTIONS_WITH_PROGRESS = [SCREENS.INTERVIEW, SCREENS.ICEBREAKER, SCREENS.FOUNDATION, SCREENS.POWERUP, SCREENS.SHIP];

// Step counts per section (must match buildStepSequence in each section file)
// Base step counts per section (Quick Path adds 1 to Foundation for safety)
const BASE_STEP_COUNTS = {
  [SCREENS.ICEBREAKER]: 6,   // onboarding + 3 exercises + safety + anchor
  [SCREENS.FOUNDATION]: 6,   // continuity + 3 builds + safety + anchor
  [SCREENS.POWERUP]: 6,      // 2 builds + safety + roast + tools + anchor
  [SCREENS.SHIP]: 5,         // review + safety + save + reflection + nextsteps
};

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

  // Quick path flag (derived by the interview hook from answers.time)
  const isQuickPath = interview.isQuickPath;

  // One-time session_start event on mount.
  useEffect(() => {
    track("session_start", {
      referrer: document.referrer || null,
      viewport_width: window.innerWidth,
      is_mobile: window.innerWidth < 480,
      is_returning_user: hasSaved,
    });
    // Mount-only: ignore exhaustive-deps for `hasSaved` (stable after init).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Scroll to top, update title, manage focus, and track screen_view on every change.
  const prevScreenRef = useRef(null);
  useEffect(() => {
    window.scrollTo(0, 0);
    const baseScreen = screen.replace(/-transition$/, "");
    document.title = SECTION_TITLES[baseScreen] || SECTION_TITLES[screen] || "Build Wizard";
    // Move focus to main content for keyboard/screen-reader users
    const main = document.querySelector("[data-main-content]");
    if (main) main.focus({ preventScroll: true });

    track("screen_view", { screen, previous_screen: prevScreenRef.current });
    prevScreenRef.current = screen;

    // GoatCounter SPA pageview. count.js is loaded async, so if it's not ready
    // yet (possible for the very first screen) poll briefly, then give up.
    const path = `/${screen}`;
    if (window.goatcounter?.count) {
      window.goatcounter.count({ path });
    } else {
      let attempts = 0;
      const timer = setInterval(() => {
        if (window.goatcounter?.count) {
          window.goatcounter.count({ path });
          clearInterval(timer);
        } else if (++attempts >= 50) {
          clearInterval(timer);
        }
      }, 100);
      return () => clearInterval(timer);
    }
  }, [screen]);

  // Persist state on meaningful changes
  useEffect(() => {
    if (screen === SCREENS.WELCOME) return;
    saveState({
      screen,
      stepIndex: interview.stepIndex,
      answers: interview.answers,
      sessionId: interview.sessionId,
      sectionProgress: progress.sectionProgress,
      sectionSteps: progress.sectionSteps,
      visited: [...progress.visited.current],
    });
  }, [screen, interview.stepIndex, interview.answers, interview.sessionId, progress.sectionProgress, progress.sectionSteps]);

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
    : () => { analytics.trackSectionComplete(SCREENS.ICEBREAKER); navigateToSection(SCREENS.FOUNDATION); };

  return (
    <>
      <GrainOverlay />
      <div data-main-content tabIndex={-1} style={{
        minHeight: "100vh", background: T.color.bg,
        fontFamily: T.font.body, color: T.color.text,
        overflowX: "hidden", position: "relative", zIndex: 1,
        outline: "none",
      }}>
        {showProgress && (
          <JourneyProgress
            currentSection={screen}
            questionProgress={progressValue}
            onSectionClick={handleProgressClick}
            stepCount={(BASE_STEP_COUNTS[screen] || 0) + (screen === SCREENS.FOUNDATION && isQuickPath ? 2 : 0)}
            currentStep={progress.sectionSteps[screen] || 0}
            onStartOver={restart}
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
                  notice={interview.forkNotice}
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
                {interview.answers.setup !== "ready" && (
                  <p style={{
                    marginTop: 0, marginBottom: 20, fontSize: 14, color: T.color.textLight,
                    lineHeight: 1.6, textAlign: "center",
                  }}>
                    On Claude's free plan, you have a daily message limit. If you run out mid-session,
                    you can come back tomorrow and pick up where you left off.
                  </p>
                )}
                <PathCard
                  data={interview.pathCard}
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
                <ProjectCoachCard
                  answers={interview.answers}
                  pathCard={interview.pathCard}
                  ensureSessionId={interview.ensureSessionId}
                />
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
              onComplete={() => { analytics.trackSectionComplete(SCREENS.FOUNDATION); navigateToSection(SCREENS.POWERUP); }}
              onBack={() => setScreen(isQuickPath ? SCREENS.PATHCARD : SCREENS.ICEBREAKER)}
              onProgress={progress.progressUpdaters[SCREENS.FOUNDATION]}
              initialStep={progress.sectionSteps[SCREENS.FOUNDATION]}
              onStepChange={progress.stepUpdaters[SCREENS.FOUNDATION]}
              quickPath={isQuickPath}
              getSessionId={interview.ensureSessionId}
            />
          )}

          {screen === SCREENS.POWERUP && (
            <PowerUp
              answers={interview.answers}
              onComplete={() => { analytics.trackSectionComplete(SCREENS.POWERUP); navigateToSection(SCREENS.SHIP); }}
              onBack={() => setScreen(SCREENS.FOUNDATION)}
              onProgress={progress.progressUpdaters[SCREENS.POWERUP]}
              initialStep={progress.sectionSteps[SCREENS.POWERUP]}
              onStepChange={progress.stepUpdaters[SCREENS.POWERUP]}
              getSessionId={interview.ensureSessionId}
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
