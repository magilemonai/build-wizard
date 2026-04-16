import { useState, useEffect } from "react";
import T from "../tokens.js";
import SectionShell from "../components/SectionShell.jsx";
import ContinueButton from "../components/ContinueButton.jsx";
import SectionCelebration from "../components/SectionCelebration.jsx";
import TextInput from "../components/TextInput.jsx";
import { getTemplatesByBucket, getTemplateById } from "../data/templates.js";
import { track } from "../services/analytics.js";
import { fetchInterviewMatch } from "../services/interviewCoach.js";
import { SparklySquare } from "../components/SparklyShape.jsx";

/* ━━━ Keyword fallback matching ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Used when the AI coach is unavailable. Scans user input for
   bucket-associated keywords. Highest weighted score wins. Tie or
   no matches defaults to "production".

   Some thinking keywords carry a 3x weight: people often describe
   brainstorming problems with strong signal words ("ideas",
   "brainstorm", "stuck") that deserve to outvote one-off words
   elsewhere.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const BUCKET_KEYWORDS = {
  information: [
    "read", "review", "summarize", "analyze", "data", "report",
    "feedback", "research", "survey", "findings", "document",
    "understand", "numbers", "trends", "patterns",
  ],
  production: [
    "write", "draft", "email", "create", "build", "present", "slides",
    "deck", "template", "process", "sop", "format", "send", "publish",
    "prepare",
  ],
  thinking: [
    "meeting", "strategy", "decide", "plan", "think", "brainstorm",
    "evaluate", "compare", "options", "approach",
    // Additions: common "help me think this through" signals
    "ideas", "idea", "concept", "figure", "struggling", "trouble",
    "challenge", "challenging", "creative", "innovate", "solve",
    "solution", "problem", "stuck", "perspective", "angles",
    "feedback", "advise", "advice", "direction", "unclear", "unsure",
    "weigh", "tradeoff", "tradeoffs", "pros", "cons", "explore",
    "rethink", "reimagine", "workshop",
  ],
};

// High-signal thinking words score 3 points instead of 1.
const HIGH_WEIGHT_THINKING = new Set([
  "ideas", "idea", "brainstorm", "think", "strategy", "decide",
  "figure", "stuck", "perspective", "weigh",
]);

function scoreBucket(lower, bucket, keywords) {
  let score = 0;
  for (const kw of keywords) {
    if (!lower.includes(kw)) continue;
    const weight = (bucket === "thinking" && HIGH_WEIGHT_THINKING.has(kw)) ? 3 : 1;
    score += weight;
  }
  return score;
}

export function matchBucket(input) {
  const lower = (input || "").toLowerCase();
  const scores = {};
  for (const [bucket, keywords] of Object.entries(BUCKET_KEYWORDS)) {
    scores[bucket] = scoreBucket(lower, bucket, keywords);
  }
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  if (sorted[0][1] === 0) return "production"; // no matches
  if (sorted.length > 1 && sorted[0][1] === sorted[1][1]) return "production"; // tie
  return sorted[0][0];
}

/* ━━━ Step builder ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function buildSteps(selectedTemplate) {
  const steps = [
    { type: "intro" },
    { type: "text_input" },
    { type: "matching" },
  ];
  if (selectedTemplate?.scopingQuestion) {
    steps.push({ type: "scoping" });
  }
  steps.push({ type: "anchor" });
  return steps;
}

/* ━━━ Stage 3: Interview ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export default function Interview({
  onComplete, onBack, onProgress, initialStep, onStepChange,
  // interview state
  problem, setProblem,
  bucket, setBucket,
  selectedTemplate, setSelectedTemplate,
  scopeAnswer, setScopeAnswer,
  coachResponse, setCoachResponse,
  isCoachLoading, setIsCoachLoading,
  coachError, setCoachError,
  ensureSessionId,
}) {
  const steps = buildSteps(selectedTemplate);

  /** Kick off the coach call, then fall back to keyword matching on
   *  any failure. Always resolves; never throws. */
  const runMatch = async (text) => {
    setIsCoachLoading(true);
    setCoachError(false);
    setCoachResponse(null);

    const sid = ensureSessionId();
    const result = await fetchInterviewMatch(text, sid);

    if (result.ok) {
      const { bucket: coachBucket, templateIds, message, scopeWarning } = result.data;
      setBucket(coachBucket);
      setCoachResponse({
        bucket: coachBucket,
        templateIds,
        message,
        scopeWarning,
      });
      setIsCoachLoading(false);
      track("bucket_match", {
        method: "coach",
        bucket: coachBucket,
        template_count: templateIds.length,
        had_scope_warning: !!scopeWarning,
      });
      if (scopeWarning) {
        track("coach_scope_warning", { bucket: coachBucket });
      }
      return;
    }

    // Fallback: keyword matching
    const kwBucket = matchBucket(text);
    setBucket(kwBucket);
    setCoachResponse(null);
    setCoachError(true);
    setIsCoachLoading(false);
    const fallbackTemplates = getTemplatesByBucket(kwBucket);
    track("bucket_match", {
      method: "fallback",
      bucket: kwBucket,
      template_count: fallbackTemplates.length,
      had_scope_warning: false,
    });
  };

  return (
    <SectionShell
      sectionKey="interview"
      steps={steps}
      onBack={onBack}
      onProgress={onProgress}
      initialStep={initialStep}
      onStepChange={onStepChange}
      renderStep={({ step, advance, BackButton }) => {
        if (step.type === "intro") {
          return <IntroStep BackButton={BackButton} onNext={advance} />;
        }
        if (step.type === "text_input") {
          return (
            <TextInputStep
              BackButton={BackButton}
              problem={problem}
              setProblem={setProblem}
              onSubmit={(text) => {
                // Reset any previously selected template on resubmit
                setSelectedTemplate(null);
                // Fire and forget; the matching step will consume state.
                runMatch(text);
                advance();
              }}
            />
          );
        }
        if (step.type === "matching") {
          return (
            <MatchingStep
              BackButton={BackButton}
              bucket={bucket}
              coachResponse={coachResponse}
              isCoachLoading={isCoachLoading}
              selectedTemplate={selectedTemplate}
              setSelectedTemplate={setSelectedTemplate}
              onConfirm={advance}
            />
          );
        }
        if (step.type === "scoping") {
          return (
            <ScopingStep
              BackButton={BackButton}
              template={selectedTemplate}
              scopeAnswer={scopeAnswer}
              setScopeAnswer={setScopeAnswer}
              onSubmit={advance}
            />
          );
        }
        if (step.type === "anchor") {
          return <AnchorStep BackButton={BackButton} onContinue={onComplete} templateName={selectedTemplate?.name} />;
        }
        return null;
      }}
    />
  );
}

/* ━━━ Step 1: Intro ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function IntroStep({ BackButton, onNext }) {
  return (
    <div>
      {BackButton}
      <div style={{
        fontFamily: T.font.body, fontSize: 13, fontWeight: 500,
        letterSpacing: "0.08em", textTransform: "uppercase",
        color: T.color.copper, marginBottom: 10,
      }}>
        The interview
      </div>
      <h2 style={{
        fontFamily: T.font.display, fontSize: "clamp(26px,5vw,34px)",
        fontWeight: 400, fontStyle: "italic", lineHeight: 1.3,
        margin: "0 0 12px 0", color: T.color.text,
      }}>
        One problem. One prompt.
      </h2>
      <p style={{
        fontSize: 16, color: T.color.textMuted, lineHeight: 1.7,
        margin: "0 0 8px 0",
      }}>
        Tell us about something at work that takes too long, happens too
        often, or could just be better. We'll match you with a prompt
        template and help you customize it.
      </p>
      <ContinueButton onClick={onNext} label="Let's go" />
    </div>
  );
}

/* ━━━ Step 2: Text input ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function TextInputStep({ BackButton, problem, setProblem, onSubmit }) {
  const [localValue, setLocalValue] = useState(problem || "");
  const canSubmit = localValue.trim().length >= 20;

  const handleSubmit = () => {
    if (!canSubmit) return;
    const trimmed = localValue.trim();
    setProblem(trimmed);
    onSubmit(trimmed);
  };

  return (
    <div>
      {BackButton}
      <h2 style={{
        fontFamily: T.font.display, fontSize: "clamp(26px,5vw,34px)",
        fontWeight: 400, fontStyle: "italic", lineHeight: 1.3,
        margin: "0 0 10px 0", color: T.color.text,
      }}>
        What takes up too much of your time at work?
      </h2>
      <p style={{
        fontSize: 15, color: T.color.textMuted, lineHeight: 1.65,
        margin: "0 0 4px 0",
      }}>
        Tell us about a task that's repetitive, tedious, or just harder
        than it should be. More context is better, but you don't have to
        write paragraphs.
      </p>
      <TextInput
        value={localValue}
        onChange={setLocalValue}
        onSubmit={handleSubmit}
        placeholder="e.g., I spend an hour every Friday writing the same status report from my notes, and it's never as clear as I want it to be"
        multiline
      />
      <ContinueButton
        onClick={handleSubmit}
        label="Find my match"
        disabled={!canSubmit}
      />
    </div>
  );
}

/* ━━━ Step 3: Matching results ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Renders the coach message + coach-picked templates when available.
   Falls back to the full bucket + generic framing when the coach is
   unavailable. Shows a loading state while the coach call is in
   flight.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function MatchingStep({ BackButton, bucket, coachResponse, isCoachLoading, selectedTemplate, setSelectedTemplate, onConfirm }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), 80); return () => clearTimeout(t); }, []);

  // Loading state
  if (isCoachLoading) {
    return (
      <div>
        {BackButton}
        <h2 style={{
          fontFamily: T.font.display, fontSize: "clamp(24px,5vw,30px)",
          fontWeight: 400, fontStyle: "italic", lineHeight: 1.3,
          margin: "0 0 10px 0", color: T.color.text,
        }}>
          Finding your match…
        </h2>
        <div
          aria-live="polite"
          style={{
            marginTop: 20,
            padding: "16px 20px",
            background: T.color.bgSubtle,
            border: `1px solid ${T.color.border}`,
            borderRadius: 14,
            display: "flex", alignItems: "center", gap: 12,
            animation: `sagePulse 1.8s ease-in-out infinite`,
          }}
        >
          <div style={{
            width: 8, height: 8, borderRadius: "50%",
            background: T.color.sage,
          }} />
          <div style={{
            fontSize: 14, color: T.color.textLight, fontFamily: T.font.body,
            letterSpacing: "0.02em",
          }}>
            Your coach is reading what you wrote…
          </div>
        </div>
      </div>
    );
  }

  // Resolved. Pick templates to show: coach-provided when available,
  // otherwise the full bucket via keyword fallback.
  const displayTemplates = coachResponse?.templateIds
    ? coachResponse.templateIds.map(getTemplateById).filter(Boolean)
    : getTemplatesByBucket(bucket || "production");

  const headline = coachResponse ? "Here are a few directions." : "Here are a few directions.";
  const lead = coachResponse
    ? coachResponse.message
    : "Based on what you described, here are a few directions for your first build:";

  return (
    <div>
      {BackButton}
      <h2 style={{
        fontFamily: T.font.display, fontSize: "clamp(24px,5vw,30px)",
        fontWeight: 400, fontStyle: "italic", lineHeight: 1.3,
        margin: "0 0 10px 0", color: T.color.text,
      }}>
        {headline}
      </h2>
      {coachResponse ? (
        <div style={{
          display: "flex", alignItems: "flex-start", gap: 12,
          padding: "12px 14px", marginBottom: 16,
          background: T.color.bgSubtle,
          border: `1px solid ${T.color.border}`,
          borderLeft: `3px solid ${T.color.sage}`,
          borderRadius: 10,
        }}>
          <div style={{ paddingTop: 2 }}>
            <SparklySquare size={22} container={26} spinDuration={14} />
          </div>
          <p style={{
            margin: 0, fontSize: 15, color: T.color.text,
            lineHeight: 1.65, fontFamily: T.font.body,
          }}>
            {lead}
          </p>
        </div>
      ) : (
        <p style={{
          fontSize: 15, color: T.color.textMuted, lineHeight: 1.7,
          margin: "0 0 16px 0",
        }}>
          {lead}
        </p>
      )}

      {coachResponse?.scopeWarning && (
        <ScopeWarning text={coachResponse.scopeWarning} />
      )}

      <div style={{
        display: "flex", flexDirection: "column", gap: 10,
        opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(10px)",
        transition: `all 0.5s ${T.ease.smooth}`,
      }}>
        {displayTemplates.map((t) => (
          <TemplateCard
            key={t.id}
            template={t}
            selected={selectedTemplate?.id === t.id}
            onSelect={() => setSelectedTemplate(t)}
          />
        ))}
      </div>

      <ContinueButton
        onClick={onConfirm}
        label="Let's go with this"
        disabled={!selectedTemplate}
      />
    </div>
  );
}

/* ━━━ Scope warning (softer, advisory) ━━━━━━━━━━━━━━━━━━━━━━━━━ */
function ScopeWarning({ text }) {
  return (
    <div style={{
      marginBottom: 18,
      padding: "12px 14px",
      background: T.color.bgSubtle,
      border: `1px solid ${T.color.border}`,
      borderLeft: `3px solid ${T.color.copper}`,
      borderRadius: 10,
      fontSize: 14, color: T.color.textMuted, lineHeight: 1.6,
      fontStyle: "italic",
    }}>
      <span style={{
        fontStyle: "normal", fontWeight: 500, color: T.color.copper,
        marginRight: 6,
      }}>
        A suggestion:
      </span>
      {text}
    </div>
  );
}

/* ━━━ Template selection card ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function TemplateCard({ template, selected, onSelect }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onSelect}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "block", width: "100%", textAlign: "left",
        padding: "14px 16px",
        background: selected ? T.color.copperSoft : hovered ? T.color.bgCard : T.color.bgSubtle,
        border: `1.5px solid ${selected ? T.color.copper : hovered ? T.color.borderHover : T.color.border}`,
        borderRadius: 12,
        cursor: "pointer",
        transition: `all 0.25s ${T.ease.smooth}`,
        fontFamily: T.font.body,
      }}
    >
      <div style={{
        fontSize: 16, fontWeight: 500,
        color: selected ? T.color.copper : T.color.text,
        marginBottom: 4,
      }}>
        {template.name}
      </div>
      <div style={{
        fontSize: 14, color: T.color.textMuted, lineHeight: 1.5,
      }}>
        {template.oneLiner}
      </div>
    </button>
  );
}

/* ━━━ Step 4: Scoping (conditional) ━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function ScopingStep({ BackButton, template, scopeAnswer, setScopeAnswer, onSubmit }) {
  const [localValue, setLocalValue] = useState(scopeAnswer || "");
  const canSubmit = localValue.trim().length >= 5;

  const handleSubmit = () => {
    if (!canSubmit) return;
    setScopeAnswer(localValue.trim());
    onSubmit();
  };

  return (
    <div>
      {BackButton}
      <h2 style={{
        fontFamily: T.font.display, fontSize: "clamp(24px,5vw,30px)",
        fontWeight: 400, fontStyle: "italic", lineHeight: 1.3,
        margin: "0 0 10px 0", color: T.color.text,
      }}>
        One more detail.
      </h2>
      <div style={{
        display: "flex", alignItems: "flex-start", gap: 12,
        padding: "12px 14px", marginBottom: 8,
        background: T.color.bgSubtle,
        border: `1px solid ${T.color.border}`,
        borderLeft: `3px solid ${T.color.sage}`,
        borderRadius: 10,
      }}>
        <div style={{ paddingTop: 2 }}>
          <SparklySquare size={22} container={26} spinDuration={14} />
        </div>
        <p style={{
          margin: 0, fontSize: 15, color: T.color.text,
          lineHeight: 1.65, fontFamily: T.font.body,
        }}>
          {template?.scopingQuestion}
        </p>
      </div>
      <TextInput
        value={localValue}
        onChange={setLocalValue}
        onSubmit={handleSubmit}
        placeholder="Your answer..."
        multiline
      />
      <ContinueButton
        onClick={handleSubmit}
        label="Let's build"
        disabled={!canSubmit}
      />
    </div>
  );
}

/* ━━━ Step 5: Anchor / celebration ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function AnchorStep({ BackButton, onContinue, templateName }) {
  return (
    <div style={{ padding: "32px 0", textAlign: "center" }}>
      {BackButton}
      <SectionCelebration heroShapeIndex={1} variant="small_medium" />
      <h2 style={{
        fontFamily: T.font.display, fontSize: "clamp(24px,5vw,30px)",
        fontWeight: 400, fontStyle: "italic", lineHeight: 1.3,
        margin: "0 0 12px 0", color: T.color.text,
      }}>
        You've picked your template.
      </h2>
      {templateName && (
        <p style={{
          fontSize: 15, color: T.color.textMuted, lineHeight: 1.65,
          margin: "0 auto 8px", maxWidth: 420,
        }}>
          {templateName}. Now let's build the prompt.
        </p>
      )}
      <ContinueButton onClick={onContinue} label="Continue" />
    </div>
  );
}
