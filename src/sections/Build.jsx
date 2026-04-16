import { useState, useCallback, useEffect, useRef, forwardRef } from "react";
import T from "../tokens.js";
import PageTransition from "../components/PageTransition.jsx";
import BackButton from "../components/BackButton.jsx";
import ContinueButton from "../components/ContinueButton.jsx";
import SectionCelebration from "../components/SectionCelebration.jsx";
import TextInput from "../components/TextInput.jsx";
import { track } from "../services/analytics.js";

/* ━━━ Stage 4: Build Your Prompt ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Five sub-steps (role → context → task → format → constraints)
   plus an assembly/edit step plus a celebration anchor.

   Does NOT use SectionShell. The prompt preview panel persists
   across all sub-step transitions; only the top "conversation"
   zone animates.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const STEP_KEYS = ["role", "context", "task", "format", "constraints"];
const STEP_LABELS = { role: "Role", context: "Context", task: "Task", format: "Format", constraints: "Constraints" };
const TOTAL_BUILD_STEPS = STEP_KEYS.length; // 5 input steps
const ASSEMBLY_STEP = TOTAL_BUILD_STEPS;    // index 5
const ANCHOR_STEP = TOTAL_BUILD_STEPS + 1;  // index 6

/* ── Prompt block transform ────────────────────────────────────── */
function transformInput(stepKey, raw) {
  const trimmed = (raw || "").trim();
  if (!trimmed) return "";
  if (stepKey === "role") {
    // Prepend "You are" if not already present
    const lower = trimmed.toLowerCase();
    if (lower.startsWith("you are") || lower.startsWith("you're")) return trimmed;
    // Capitalize and add period
    const sentence = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
    return `You are ${trimmed.endsWith(".") ? sentence : sentence + "."}`;
  }
  return trimmed;
}

function assemblePrompt(answers) {
  return STEP_KEYS
    .map((k) => transformInput(k, answers[k]))
    .filter(Boolean)
    .join("\n\n");
}

/* ── Feature tip mapping ───────────────────────────────────────── */
const FEATURE_TIPS = {
  model_selection: {
    step: "role",
    text: "For this kind of work, Sonnet is your best bet. It handles most tasks well. Switch to Opus if the reasoning feels shallow.",
  },
  research: {
    step: "context",
    text: "For this, you'll want to turn on Research in Claude so it can search for current information. Heads up: research takes 10-15 minutes.",
  },
  extended_thinking: {
    step: "task",
    text: "This is a task where extended thinking helps. Turn on the toggle and Claude will reason through it more carefully before answering.",
  },
  artifacts: {
    step: "format",
    text: "For this kind of output, Claude will create an artifact: a document panel on the right side of the screen that you can edit and download.",
  },
  projects: {
    step: "assembly",
    text: "Once this prompt works, save it in a Claude Project. That way Claude remembers it every time you come back.",
  },
  memory: {
    step: "assembly",
    text: "Over time, Claude can learn your preferences: your writing style, your formatting, how you like things done. That starts in your next conversation.",
  },
};

function getTipForStep(stepKey, features) {
  if (!features?.length) return null;
  for (const f of features) {
    const tip = FEATURE_TIPS[f];
    if (tip && tip.step === stepKey) return tip.text;
  }
  return null;
}

/* ━━━ Build component ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export default function Build({
  onComplete, onBack, onProgress, initialStep, onStepChange,
  selectedTemplate,
  buildAnswers, setBuildAnswers,
  assembledPrompt, setAssembledPrompt,
}) {
  const [stepIndex, setStepIndex] = useState(initialStep || 0);
  const [direction, setDirection] = useState(1);
  const previewRef = useRef(null);

  const promptSteps = selectedTemplate?.promptSteps || {};
  const features = selectedTemplate?.features || [];

  // Sync progress on mount if resuming
  useEffect(() => {
    if (initialStep) {
      onProgress?.(initialStep / (ANCHOR_STEP + 1));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-scroll preview when it grows
  useEffect(() => {
    if (previewRef.current) {
      previewRef.current.scrollTop = previewRef.current.scrollHeight;
    }
  }, [buildAnswers]);

  const goTo = useCallback((next, dir) => {
    setDirection(dir);
    setStepIndex(next);
    onProgress?.(next / (ANCHOR_STEP + 1));
    onStepChange?.(next);
  }, [onProgress, onStepChange]);

  const advance = useCallback(() => {
    if (stepIndex < TOTAL_BUILD_STEPS) {
      track("prompt_step_complete", { step: STEP_KEYS[stepIndex], step_index: stepIndex });
    }
    if (stepIndex === ASSEMBLY_STEP) {
      track("prompt_assembled", {});
    }
    const next = stepIndex + 1;
    if (next > ANCHOR_STEP) {
      onComplete?.();
      return;
    }
    goTo(next, 1);
  }, [stepIndex, goTo, onComplete]);

  const goBack = useCallback(() => {
    if (stepIndex <= 0) { onBack?.(); return; }
    goTo(stepIndex - 1, -1);
  }, [stepIndex, goTo, onBack]);

  const handleStepSubmit = useCallback((stepKey, value) => {
    setBuildAnswers((prev) => {
      const updated = { ...prev, [stepKey]: value };
      // If we're at the last build step, pre-assemble prompt for the edit step
      if (stepKey === STEP_KEYS[TOTAL_BUILD_STEPS - 1]) {
        setAssembledPrompt(assemblePrompt(updated));
      }
      return updated;
    });
    advance();
  }, [advance, setBuildAnswers, setAssembledPrompt]);

  // Completed blocks for the preview
  const completedBlocks = STEP_KEYS
    .slice(0, Math.min(stepIndex, TOTAL_BUILD_STEPS))
    .filter((k) => buildAnswers[k]);

  const isInputStep = stepIndex < TOTAL_BUILD_STEPS;
  const isAssembly = stepIndex === ASSEMBLY_STEP;
  const isAnchor = stepIndex === ANCHOR_STEP;
  const currentStepKey = isInputStep ? STEP_KEYS[stepIndex] : null;

  return (
    <div>
      {/* ── TOP ZONE: conversation ── */}
      <PageTransition transitionKey={stepIndex} type="page" direction={direction}>
        <div>
          <BackButton onClick={goBack} />

          {isInputStep && (
            <InputStep
              stepKey={currentStepKey}
              stepConfig={promptSteps[currentStepKey]}
              stepNumber={stepIndex + 1}
              total={TOTAL_BUILD_STEPS}
              savedValue={buildAnswers[currentStepKey]}
              onSubmit={(val) => handleStepSubmit(currentStepKey, val)}
              tip={getTipForStep(currentStepKey, features)}
            />
          )}

          {isAssembly && (
            <AssemblyStep
              assembledPrompt={assembledPrompt}
              setAssembledPrompt={setAssembledPrompt}
              onConfirm={advance}
              tips={features
                .map((f) => FEATURE_TIPS[f])
                .filter((t) => t?.step === "assembly")
                .map((t) => t.text)}
            />
          )}

          {isAnchor && (
            <AnchorStep onContinue={onComplete} />
          )}
        </div>
      </PageTransition>

      {/* ── BOTTOM ZONE: prompt preview (persists across steps) ── */}
      {!isAnchor && (
        <PromptPreview
          ref={previewRef}
          blocks={completedBlocks}
          buildAnswers={buildAnswers}
          isAssembly={isAssembly}
        />
      )}
    </div>
  );
}

/* ━━━ Input step ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function InputStep({ stepKey, stepConfig, stepNumber, total, savedValue, onSubmit, tip }) {
  const [localValue, setLocalValue] = useState(savedValue || "");
  const canSubmit = localValue.trim().length >= 5;

  // Re-sync if navigating back to a previously filled step
  useEffect(() => { setLocalValue(savedValue || ""); }, [savedValue]);

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit(localValue.trim());
  };

  const isLast = stepNumber === total;

  return (
    <div>
      <div style={{
        fontFamily: T.font.body, fontSize: 13, fontWeight: 500,
        letterSpacing: "0.08em", textTransform: "uppercase",
        color: T.color.copper, marginBottom: 10,
      }}>
        Step {stepNumber} of {total} · {STEP_LABELS[stepKey]}
      </div>
      <h2 style={{
        fontFamily: T.font.display, fontSize: "clamp(24px,5vw,30px)",
        fontWeight: 400, fontStyle: "italic", lineHeight: 1.3,
        margin: "0 0 8px 0", color: T.color.text,
      }}>
        {stepConfig?.question || `Describe the ${stepKey}.`}
      </h2>
      <TextInput
        value={localValue}
        onChange={setLocalValue}
        onSubmit={handleSubmit}
        placeholder={stepConfig?.placeholder || ""}
        multiline
      />

      {tip && <FeatureTip text={tip} />}

      <ContinueButton
        onClick={handleSubmit}
        label={isLast ? "Add to prompt" : "Next"}
        disabled={!canSubmit}
      />
    </div>
  );
}

/* ━━━ Feature tip callout ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function FeatureTip({ text }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{
      marginTop: 16, padding: "12px 14px",
      background: T.color.copperSoft,
      border: `1px solid ${T.color.copperGlow}`,
      borderRadius: 10,
      fontSize: 14, color: T.color.textMuted, lineHeight: 1.6,
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(6px)",
      transition: `all 0.4s ${T.ease.smooth}`,
    }}>
      <span style={{ fontWeight: 500, color: T.color.copper }}>Tip: </span>
      {text}
    </div>
  );
}

/* ━━━ Assembly / edit step ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function AssemblyStep({ assembledPrompt, setAssembledPrompt, onConfirm, tips }) {
  return (
    <div>
      <div style={{
        fontFamily: T.font.body, fontSize: 13, fontWeight: 500,
        letterSpacing: "0.08em", textTransform: "uppercase",
        color: T.color.copper, marginBottom: 10,
      }}>
        Your prompt
      </div>
      <h2 style={{
        fontFamily: T.font.display, fontSize: "clamp(24px,5vw,30px)",
        fontWeight: 400, fontStyle: "italic", lineHeight: 1.3,
        margin: "0 0 8px 0", color: T.color.text,
      }}>
        Here's your prompt.
      </h2>
      <p style={{
        fontSize: 15, color: T.color.textMuted, lineHeight: 1.65,
        margin: "0 0 12px 0",
      }}>
        Read it through. Does it sound like what you'd tell a sharp new
        hire on their first day? Edit anything you want.
      </p>

      <textarea
        value={assembledPrompt}
        onChange={(e) => setAssembledPrompt(e.target.value)}
        rows={12}
        style={{
          width: "100%", padding: "16px 18px",
          background: T.color.bgCard,
          border: `1.5px solid ${T.color.border}`,
          borderRadius: 12,
          fontFamily: "'Courier New', Courier, monospace",
          fontSize: 14, lineHeight: 1.7,
          color: T.color.text, outline: "none",
          resize: "vertical",
          boxSizing: "border-box",
          transition: `border-color 0.3s ${T.ease.smooth}`,
        }}
        onFocus={(e) => { e.target.style.borderColor = `var(--color-sage)`; }}
        onBlur={(e) => { e.target.style.borderColor = `var(--color-border)`; }}
      />

      {tips?.length > 0 && tips.map((text, i) => (
        <FeatureTip key={i} text={text} />
      ))}

      <ContinueButton onClick={onConfirm} label="My prompt is ready" />
    </div>
  );
}

/* ━━━ Prompt preview (bottom zone) ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const PromptPreview = forwardRef(function PromptPreview({ blocks, buildAnswers, isAssembly }, ref) {
  if (isAssembly) return null; // assembly step shows its own editable textarea

  return (
    <div
      ref={ref}
      style={{
        marginTop: 24,
        padding: "16px 18px",
        background: T.color.bgSubtle,
        border: `1px solid ${T.color.border}`,
        borderTop: `2px solid ${T.color.copper}`,
        borderRadius: "0 0 12px 12px",
        minHeight: 80,
        maxHeight: 260,
        overflowY: "auto",
      }}
    >
      {blocks.length === 0 ? (
        <div style={{
          fontSize: 13, color: T.color.textLight,
          fontStyle: "italic", padding: "8px 0",
        }}>
          Your prompt will appear here as you build it
        </div>
      ) : (
        blocks.map((key) => (
          <PromptBlock key={key} label={STEP_LABELS[key]} text={transformInput(key, buildAnswers[key])} />
        ))
      )}
    </div>
  );
});

function PromptBlock({ label, text }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{
      marginBottom: 12,
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(6px)",
      transition: `all 0.4s ${T.ease.smooth}`,
    }}>
      <div style={{
        fontSize: 11, fontWeight: 500,
        letterSpacing: "0.08em", textTransform: "uppercase",
        color: T.color.sage, marginBottom: 4,
      }}>
        {label}
      </div>
      <div style={{
        fontFamily: "'Courier New', Courier, monospace",
        fontSize: 13, lineHeight: 1.6, color: T.color.text,
        whiteSpace: "pre-wrap", wordBreak: "break-word",
      }}>
        {text}
      </div>
    </div>
  );
}

/* ━━━ Anchor / celebration ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function AnchorStep({ onContinue }) {
  return (
    <div style={{ padding: "32px 0", textAlign: "center" }}>
      <SectionCelebration heroShapeIndex={2} intensity={3} />
      <h2 style={{
        fontFamily: T.font.display, fontSize: "clamp(28px,6vw,38px)",
        fontWeight: 400, fontStyle: "italic", lineHeight: 1.3,
        margin: "0 0 12px 0", color: T.color.text,
      }}>
        You built a prompt.
      </h2>
      <p style={{
        fontSize: 16, color: T.color.textMuted, lineHeight: 1.65,
        margin: "0 auto 8px", maxWidth: 440,
      }}>
        That's a real tool you just made. Now let's put it to work.
      </p>
      <ContinueButton onClick={onContinue} label="Continue" />
    </div>
  );
}
