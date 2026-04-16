import { useState, useEffect } from "react";
import T from "../tokens.js";
import SectionShell from "../components/SectionShell.jsx";
import ContinueButton from "../components/ContinueButton.jsx";
import SectionCelebration from "../components/SectionCelebration.jsx";
import TextInput from "../components/TextInput.jsx";
import { getTemplatesByBucket } from "../data/templates.js";
import { track } from "../services/analytics.js";

/* ━━━ Keyword fallback matching ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Scans user input for bucket-associated keywords. Highest hit
   count wins. Tie or no matches defaults to "production".
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const BUCKET_KEYWORDS = {
  information: ["read", "review", "summarize", "analyze", "data", "report", "feedback", "research", "survey", "findings", "document", "understand", "numbers", "trends", "patterns"],
  production: ["write", "draft", "email", "create", "build", "present", "slides", "deck", "template", "process", "sop", "format", "send", "publish", "prepare"],
  thinking: ["meeting", "strategy", "decide", "plan", "think", "brainstorm", "evaluate", "compare", "options", "approach"],
};

export function matchBucket(input) {
  const lower = (input || "").toLowerCase();
  const scores = {};
  for (const [bucket, keywords] of Object.entries(BUCKET_KEYWORDS)) {
    scores[bucket] = keywords.filter((kw) => lower.includes(kw)).length;
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

/* ━━━ Stage 3: Interview ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   "What's Eating Your Time?" One open text field, keyword-matched
   bucket + templates, optional scoping question, celebration.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export default function Interview({
  onComplete, onBack, onProgress, initialStep, onStepChange,
  // interview state from useInterview (passed through App)
  problem, setProblem,
  bucket, setBucket,
  selectedTemplate, setSelectedTemplate,
  scopeAnswer, setScopeAnswer,
}) {
  const steps = buildSteps(selectedTemplate);

  return (
    <SectionShell
      sectionKey="interview"
      steps={steps}
      onBack={onBack}
      onProgress={onProgress}
      initialStep={initialStep}
      onStepChange={onStepChange}
      renderStep={({ step, stepIndex, advance, BackButton }) => {
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
                const matched = matchBucket(text);
                setBucket(matched);
                track("bucket_match", { bucket: matched, input_length: text.length });
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

/* ━━━ Step 3: Matching results ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function MatchingStep({ BackButton, bucket, selectedTemplate, setSelectedTemplate, onConfirm }) {
  const templates = getTemplatesByBucket(bucket || "production");
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), 80); return () => clearTimeout(t); }, []);

  return (
    <div>
      {BackButton}
      <h2 style={{
        fontFamily: T.font.display, fontSize: "clamp(24px,5vw,30px)",
        fontWeight: 400, fontStyle: "italic", lineHeight: 1.3,
        margin: "0 0 10px 0", color: T.color.text,
      }}>
        Here are a few directions.
      </h2>
      <p style={{
        fontSize: 15, color: T.color.textMuted, lineHeight: 1.65,
        margin: "0 0 20px 0",
      }}>
        Based on what you described, here are a few directions for your
        first build:
      </p>

      <div style={{
        display: "flex", flexDirection: "column", gap: 10,
        opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(10px)",
        transition: `all 0.5s ${T.ease.smooth}`,
      }}>
        {templates.map((t) => (
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
      <p style={{
        fontSize: 16, color: T.color.textMuted, lineHeight: 1.7,
        margin: "0 0 4px 0",
      }}>
        {template?.scopingQuestion}
      </p>
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
      <SectionCelebration heroShapeIndex={1} intensity={1} />
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
