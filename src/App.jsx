import { useState, useEffect, useCallback, useRef } from "react";
import T from "./tokens.js";
import GrainOverlay from "./components/GrainOverlay.jsx";
import BackButton from "./components/BackButton.jsx";
import JourneyProgress from "./components/JourneyProgress.jsx";
import Orientation from "./sections/Orientation.jsx";
import Cockpit from "./sections/Cockpit.jsx";
import Interview from "./sections/Interview.jsx";
import Build from "./sections/Build.jsx";
import Launch from "./sections/Launch.jsx";
import KeepGoing from "./sections/KeepGoing.jsx";
import WelcomeBack from "./sections/WelcomeBack.jsx";
import ThresholdInterstitial from "./sections/ThresholdInterstitial.jsx";
import { SCREENS, STAGES } from "./screens.js";

import useInterview from "./hooks/useInterview.js";
import useProgress from "./hooks/useProgress.js";
import { useSavedState, saveState, clearSavedState } from "./hooks/usePersistence.js";
import { track } from "./services/analytics.js";

/* ━━━ Config ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Stage transitions (Orientation has no intro screen of its own;
   every subsequent stage gets a ThresholdInterstitial on first
   entry, skipped on re-entry via `visited`).
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const SECTION_TRANSITIONS = {
  [SCREENS.COCKPIT]:    { headline: "The cockpit.",         subtext: "A quick tour of what Claude can do." },
  [SCREENS.INTERVIEW]:  { headline: "What's eating your time?", subtext: "One problem. We'll work from there." },
  [SCREENS.BUILD]:      { headline: "Let's build the prompt.",  subtext: "Five pieces. One prompt at the end." },
  [SCREENS.LAUNCH]:     { headline: "Time to launch.",      subtext: "Copy, paste, use." },
  [SCREENS.KEEP_GOING]: { headline: "One more thing.",      subtext: "What else Claude can do for you." },
};

const STAGES_WITH_PROGRESS = [
  SCREENS.COCKPIT, SCREENS.INTERVIEW, SCREENS.BUILD, SCREENS.LAUNCH, SCREENS.KEEP_GOING,
];

// Step counts per stage (must match the stub step sequences in each section file).
const BASE_STEP_COUNTS = {
  [SCREENS.COCKPIT]:    7,  // 6 feature cards + anchor
  [SCREENS.INTERVIEW]:  2,
  [SCREENS.BUILD]:      6,  // Role, Context, Task, Format, Constraints, Review
  [SCREENS.LAUNCH]:     2,
  [SCREENS.KEEP_GOING]: 2,
};

const SECTION_TITLES = {
  [SCREENS.ORIENTATION]: "Claude Launcher",
  [SCREENS.COCKPIT]:     "Cockpit — Launcher",
  [SCREENS.INTERVIEW]:   "Interview — Launcher",
  [SCREENS.BUILD]:       "Build — Launcher",
  [SCREENS.LAUNCH]:      "Launch — Launcher",
  [SCREENS.KEEP_GOING]:  "Keep Going — Launcher",
};

/* ━━━ Main App ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export default function App() {
  const savedRef = useSavedState();
  const saved = savedRef.current;
  const hasSaved = !!saved && saved.screen !== SCREENS.ORIENTATION;

  const [showResumeScreen, setShowResumeScreen] = useState(hasSaved);
  const [screen, setScreen] = useState(() => saved?.screen || SCREENS.ORIENTATION);

  const interview = useInterview(saved);
  const progress = useProgress(saved, setScreen);

  // One-time session_start event on mount.
  useEffect(() => {
    track("session_start", {
      referrer: document.referrer || null,
      viewport_width: window.innerWidth,
      is_mobile: window.innerWidth < 480,
      is_returning_user: hasSaved,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Scroll to top, update title, manage focus, and track screen_view on every change.
  const prevScreenRef = useRef(null);
  useEffect(() => {
    window.scrollTo(0, 0);
    const baseScreen = screen.replace(/-transition$/, "");
    document.title = SECTION_TITLES[baseScreen] || "Launcher";
    const main = document.querySelector("[data-main-content]");
    if (main) main.focus({ preventScroll: true });

    track("screen_view", { screen, previous_screen: prevScreenRef.current });
    prevScreenRef.current = screen;
  }, [screen]);

  // Persist state on meaningful changes
  useEffect(() => {
    if (screen === SCREENS.ORIENTATION) return;
    saveState({
      screen,
      answers: interview.answers,
      sessionId: interview.sessionId,
      sectionProgress: progress.sectionProgress,
      sectionSteps: progress.sectionSteps,
      visited: [...progress.visited.current],
    });
  }, [screen, interview.answers, interview.sessionId, progress.sectionProgress, progress.sectionSteps]);

  // Restart: clear everything
  const restart = useCallback(() => {
    clearSavedState();
    setScreen(SCREENS.ORIENTATION);
    setShowResumeScreen(false);
    interview.resetInterview();
    progress.resetProgress();
  }, [interview, progress]);

  // Clickable progress bar: jump to a completed or current stage
  const handleProgressClick = useCallback((stageKey) => {
    const order = STAGES_WITH_PROGRESS;
    const currentIdx = order.indexOf(screen);
    const targetIdx = order.indexOf(stageKey);
    if (targetIdx <= currentIdx && targetIdx >= 0) {
      setScreen(stageKey);
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

  // Determine if current screen is a stage transition
  const transitionMatch = screen.match(/^(.+)-transition$/);
  const transitionStage = transitionMatch?.[1];
  const transitionConfig = transitionStage && SECTION_TRANSITIONS[transitionStage];

  // ── Welcome Back (returning user) ──
  if (showResumeScreen) {
    return (
      <>
        <GrainOverlay />
        <WelcomeBack
          savedScreen={saved?.screen}
          projectIdea={saved?.answers?.problem}
          onResume={() => setShowResumeScreen(false)}
          onStartOver={restart}
        />
      </>
    );
  }

  // ── Stage 1: Orientation ──
  if (screen === SCREENS.ORIENTATION) {
    return (
      <>
        <GrainOverlay />
        <Orientation onBegin={() => progress.goToSection(SCREENS.COCKPIT)} />
      </>
    );
  }

  // ── Stage transitions ──
  if (transitionConfig) {
    return (
      <>
        <GrainOverlay />
        <ThresholdInterstitial
          headline={transitionConfig.headline}
          subtext={transitionConfig.subtext}
          onComplete={() => {
            progress.markVisited(transitionStage);
            setScreen(transitionStage);
          }}
        />
      </>
    );
  }

  // ── Active stages ──
  const showProgress = STAGES_WITH_PROGRESS.includes(screen);
  const progressValue = progress.sectionProgress[screen] || 0;

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
            stepCount={BASE_STEP_COUNTS[screen] || 0}
            currentStep={progress.sectionSteps[screen] || 0}
            onStartOver={restart}
          />
        )}

        <div style={{
          maxWidth: 640, margin: "0 auto", padding: "0 24px",
          paddingTop: showProgress ? 88 : 48, paddingBottom: 80,
        }}>
          {screen === SCREENS.COCKPIT && (
            <Cockpit
              onComplete={() => progress.goToSection(SCREENS.INTERVIEW)}
              onBack={() => setScreen(SCREENS.ORIENTATION)}
              onProgress={progress.progressUpdaters[SCREENS.COCKPIT]}
              initialStep={progress.sectionSteps[SCREENS.COCKPIT]}
              onStepChange={progress.stepUpdaters[SCREENS.COCKPIT]}
            />
          )}

          {screen === SCREENS.INTERVIEW && (
            <Interview
              onComplete={() => progress.goToSection(SCREENS.BUILD)}
              onBack={() => setScreen(SCREENS.COCKPIT)}
              onProgress={progress.progressUpdaters[SCREENS.INTERVIEW]}
              initialStep={progress.sectionSteps[SCREENS.INTERVIEW]}
              onStepChange={progress.stepUpdaters[SCREENS.INTERVIEW]}
              ensureSessionId={interview.ensureSessionId}
            />
          )}

          {screen === SCREENS.BUILD && (
            <Build
              onComplete={() => progress.goToSection(SCREENS.LAUNCH)}
              onBack={() => setScreen(SCREENS.INTERVIEW)}
              onProgress={progress.progressUpdaters[SCREENS.BUILD]}
              initialStep={progress.sectionSteps[SCREENS.BUILD]}
              onStepChange={progress.stepUpdaters[SCREENS.BUILD]}
            />
          )}

          {screen === SCREENS.LAUNCH && (
            <Launch
              onComplete={() => progress.goToSection(SCREENS.KEEP_GOING)}
              onBack={() => setScreen(SCREENS.BUILD)}
              onProgress={progress.progressUpdaters[SCREENS.LAUNCH]}
              initialStep={progress.sectionSteps[SCREENS.LAUNCH]}
              onStepChange={progress.stepUpdaters[SCREENS.LAUNCH]}
            />
          )}

          {screen === SCREENS.KEEP_GOING && (
            <KeepGoing
              onComplete={() => { /* end of flow */ }}
              onBack={() => setScreen(SCREENS.LAUNCH)}
              onProgress={progress.progressUpdaters[SCREENS.KEEP_GOING]}
              initialStep={progress.sectionSteps[SCREENS.KEEP_GOING]}
              onStepChange={progress.stepUpdaters[SCREENS.KEEP_GOING]}
              onStartOver={restart}
            />
          )}
        </div>
      </div>
    </>
  );
}
