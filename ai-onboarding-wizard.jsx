import { useState, useEffect, useCallback, useRef, useMemo } from "react";

/* ━━━ Design Tokens ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const T = {
  color: {
    bg: "#F7F5F0",
    bgSubtle: "#EFECE5",
    bgCard: "#FFFFFF",
    text: "#2C2925",
    textMuted: "#6B665F",
    textLight: "#9E9890",
    sage: "#7A8B6A",
    sageSoft: "rgba(122,139,106,0.08)",
    sageBorder: "rgba(122,139,106,0.2)",
    copper: "#BF7B5E",
    copperHover: "#A8694F",
    copperSoft: "rgba(191,123,94,0.10)",
    copperGlow: "rgba(191,123,94,0.25)",
    border: "rgba(44,41,37,0.08)",
    borderHover: "rgba(44,41,37,0.14)",
    shadow: "rgba(44,41,37,0.05)",
    shadowMed: "rgba(44,41,37,0.08)",
    shadowDeep: "rgba(44,41,37,0.12)",
  },
  ease: {
    smooth: "cubic-bezier(0.22,1,0.36,1)",
    page: "cubic-bezier(0.4,0,0.2,1)",
    settle: "cubic-bezier(0.25,0.46,0.45,0.94)",
    spring: "cubic-bezier(0.34,1.4,0.64,1)",
  },
  font: {
    display: "'Instrument Serif',Georgia,serif",
    body: "'DM Sans',-apple-system,sans-serif",
  },
};

/* ━━━ Fonts ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const Fonts = () => (
  <>
    <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Instrument+Serif:ital@0;1&display=swap');
      *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
      html{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}
      body{overflow-x:hidden}

      @keyframes fallBounce {
        0% {
          transform: translate(calc(-50% - 50px), calc(-50% - 300px)) rotate(-40deg);
          opacity: 0;
        }
        8% { opacity: 1; }
        55% {
          transform: translate(-50%, -50%) rotate(6deg);
        }
        70% {
          transform: translate(-50%, calc(-50% - 14px)) rotate(-2deg);
        }
        100% {
          transform: translate(-50%, -50%) rotate(0deg);
          opacity: 1;
        }
      }

      @keyframes fallBounceRight {
        0% {
          transform: translate(calc(-50% + 45px), calc(-50% - 320px)) rotate(35deg);
          opacity: 0;
        }
        8% { opacity: 1; }
        55% {
          transform: translate(-50%, -50%) rotate(-5deg);
        }
        70% {
          transform: translate(-50%, calc(-50% - 12px)) rotate(2deg);
        }
        100% {
          transform: translate(-50%, -50%) rotate(0deg);
          opacity: 1;
        }
      }

      @keyframes fallBounceStraight {
        0% {
          transform: translate(calc(-50% + 12px), calc(-50% - 280px)) rotate(8deg);
          opacity: 0;
        }
        8% { opacity: 1; }
        55% {
          transform: translate(-50%, -50%) rotate(-2deg);
        }
        70% {
          transform: translate(-50%, calc(-50% - 10px)) rotate(1deg);
        }
        100% {
          transform: translate(-50%, -50%) rotate(0deg);
          opacity: 1;
        }
      }

      @keyframes softFadeUp {
        0% { opacity: 0; transform: translateY(12px); }
        100% { opacity: 1; transform: translateY(0); }
      }
    `}</style>
  </>
);

/* ━━━ Grain Overlay (persistent, rendered once) ━━━━━━━━━━━━━━━━━ */
const GrainOverlay = () => (
  <div
    style={{
      position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.045'/%3E%3C/svg%3E")`,
    }}
  />
);

/* ━━━ Platform detection ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const getModKey = () => {
  if (typeof navigator === "undefined") return "⌘";
  if (/Mac|iPhone|iPad/.test(navigator.userAgent ?? "")) return "⌘";
  return "Ctrl";
};
const isMobile = () =>
  typeof window !== "undefined" && window.innerWidth < 480;

/* ━━━ Responsive hook ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const useIsMobile = () => {
  const [mobile, setMobile] = useState(isMobile);
  useEffect(() => {
    const h = () => setMobile(isMobile());
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return mobile;
};

/* ━━━ Page Transition (direction-aware, race-safe) ━━━━━━━━━━━━━━ */
const PageTransition = ({ children, transitionKey, type = "page", direction = 1, onEntered }) => {
  const [displayChild, setDisplayChild] = useState(children);
  const [phase, setPhase] = useState("visible");
  const prevKey = useRef(transitionKey);
  const timers = useRef([]);
  const transitioning = useRef(false);
  const latestChildren = useRef(children);
  latestChildren.current = children;

  // Handle transition key changes only
  useEffect(() => {
    if (transitionKey !== prevKey.current) {
      timers.current.forEach(clearTimeout);
      timers.current = [];
      prevKey.current = transitionKey;
      transitioning.current = true;
      setPhase("exiting");

      const t1 = setTimeout(() => {
        setDisplayChild(latestChildren.current);
        setPhase("entering");
        const t2 = setTimeout(() => {
          setPhase("visible");
          transitioning.current = false;
          onEntered?.();
        }, 40);
        timers.current.push(t2);
      }, 280);
      timers.current.push(t1);
    }
  }, [transitionKey]);

  // Update children when NOT mid-transition
  useEffect(() => {
    if (!transitioning.current) {
      setDisplayChild(children);
    }
  }, [children]);

  // Cleanup on unmount only
  useEffect(() => {
    return () => timers.current.forEach(clearTimeout);
  }, []);

  const dir = direction;
  const styles = {
    page: {
      exiting:  { opacity: 0, transform: `translateX(${-50 * dir}px) scale(0.97)`, transition: `all 0.28s ${T.ease.page}` },
      entering: { opacity: 0, transform: `translateX(${50 * dir}px) scale(0.97)`, transition: "none" },
      visible:  { opacity: 1, transform: "translateX(0) scale(1)", transition: `all 0.45s ${T.ease.smooth}` },
    },
    morph: {
      exiting:  { opacity: 0, transform: "translateY(-24px) scaleY(0.95)", transition: `all 0.28s ${T.ease.page}` },
      entering: { opacity: 0, transform: "translateY(24px) scaleY(0.95)", transition: "none" },
      visible:  { opacity: 1, transform: "translateY(0) scaleY(1)", transition: `all 0.45s ${T.ease.smooth}` },
    },
    rise: {
      exiting:  { opacity: 0, transform: "scale(0.94)", transition: `all 0.28s ${T.ease.page}` },
      entering: { opacity: 0, transform: "translateY(36px) scale(0.96)", transition: "none" },
      visible:  { opacity: 1, transform: "translateY(0) scale(1)", transition: `all 0.55s ${T.ease.spring}` },
    },
    threshold: {
      exiting:  { opacity: 0, transform: "scale(1.06)", transition: `all 0.5s ${T.ease.page}`, filter: "blur(4px)" },
      entering: { opacity: 0, transform: "translateY(40px) scale(0.94)", transition: "none", filter: "blur(2px)" },
      visible:  { opacity: 1, transform: "translateY(0) scale(1)", transition: `all 0.6s ${T.ease.smooth}`, filter: "blur(0px)" },
    },
  };

  return <div style={styles[type]?.[phase] || styles.page[phase]}>{displayChild}</div>;
};

/* ━━━ Choice Button (stagger gated by parent signal) ━━━━━━━━━━━━ */
const ChoiceButton = ({ children, selected, onClick, delay = 0, ready = true }) => {
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!ready) { setVisible(false); return; }
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [ready, delay]);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "block", width: "100%", padding: "15px 20px", marginBottom: 10,
        background: selected ? T.color.sageSoft : hovered ? T.color.bgSubtle : T.color.bgCard,
        border: `1.5px solid ${selected ? T.color.sageBorder : hovered ? T.color.borderHover : T.color.border}`,
        borderRadius: 12, fontFamily: T.font.body, fontSize: 15,
        fontWeight: selected ? 500 : 400,
        color: selected ? T.color.sage : T.color.text,
        cursor: "pointer", textAlign: "left",
        transition: `all 0.3s ${T.ease.smooth}`,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateX(0) scale(1)" : "translateX(20px) scale(0.97)",
        boxShadow: selected ? `0 2px 12px ${T.color.shadow}` : hovered ? `0 1px 6px ${T.color.shadow}` : "none",
        lineHeight: 1.5,
      }}
    >
      {children}
    </button>
  );
};

/* ━━━ Text Input ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const TextInput = ({ value, onChange, onSubmit, placeholder, multiline }) => {
  const [focused, setFocused] = useState(false);
  const Tag = multiline ? "textarea" : "input";
  const mobile = useIsMobile();
  return (
    <div style={{ marginTop: 8 }}>
      <Tag
        value={value} onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey && !multiline) { e.preventDefault(); onSubmit?.(); }
          if (e.key === "Enter" && (e.metaKey || e.ctrlKey) && multiline) { e.preventDefault(); onSubmit?.(); }
        }}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        placeholder={placeholder} rows={multiline ? 4 : undefined}
        style={{
          width: "100%", padding: "14px 18px", background: T.color.bgCard,
          border: `1.5px solid ${focused ? T.color.sage : T.color.border}`,
          borderRadius: 12, fontFamily: T.font.body, fontSize: 15,
          color: T.color.text, outline: "none",
          transition: `border-color 0.3s ${T.ease.smooth}, box-shadow 0.3s ${T.ease.smooth}`,
          resize: multiline ? "vertical" : "none", lineHeight: 1.6,
          boxShadow: focused ? `0 0 0 3px ${T.color.sageSoft}` : "none",
          boxSizing: "border-box",
        }}
      />
      {multiline && !mobile && (
        <div style={{ marginTop: 6, fontSize: 12, color: T.color.textLight, textAlign: "right" }}>
          {getModKey()} + Enter to continue
        </div>
      )}
    </div>
  );
};

/* ━━━ Continue Button ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const ContinueButton = ({ onClick, label = "Continue", disabled }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <button onClick={onClick} disabled={disabled}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{
        display: "inline-flex", alignItems: "center", gap: 8,
        padding: "13px 28px", marginTop: 28,
        background: disabled ? T.color.bgSubtle : hovered ? T.color.copperHover : T.color.copper,
        color: disabled ? T.color.textLight : "#fff",
        border: "none", borderRadius: 10, fontFamily: T.font.body,
        fontSize: 15, fontWeight: 500, cursor: disabled ? "default" : "pointer",
        transition: `all 0.35s ${T.ease.smooth}`,
        transform: hovered && !disabled ? "translateY(-1px)" : "translateY(0)",
        boxShadow: hovered && !disabled ? `0 6px 20px ${T.color.copperGlow}` : "none",
        letterSpacing: "0.01em",
      }}>
      {label}
      <span style={{
        display: "inline-block", transition: `transform 0.3s ${T.ease.smooth}`,
        transform: hovered && !disabled ? "translateX(3px)" : "translateX(0)",
      }}>→</span>
    </button>
  );
};

/* ━━━ Back Button ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const BackButton = ({ onClick }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        padding: "6px 0", marginBottom: 20, background: "none", border: "none",
        fontFamily: T.font.body, fontSize: 13, color: T.color.textLight,
        cursor: "pointer", transition: `color 0.2s ${T.ease.smooth}`,
        ...(hovered && { color: T.color.textMuted }),
      }}>
      <span style={{
        display: "inline-block", transition: `transform 0.2s ${T.ease.smooth}`,
        transform: hovered ? "translateX(-2px)" : "translateX(0)",
      }}>←</span>
      Back
    </button>
  );
};

/* ━━━ Section Label ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const SectionLabel = ({ children }) => (
  <div style={{
    fontFamily: T.font.body, fontSize: 11, fontWeight: 500,
    letterSpacing: "0.1em", textTransform: "uppercase",
    color: T.color.sage, marginBottom: 16,
  }}>{children}</div>
);

/* ━━━ Journey Progress (responsive) ━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const journeySteps = [
  { key: "interview", label: "Interview" },
  { key: "icebreaker", label: "Ice Breaker" },
  { key: "foundation", label: "Foundation" },
  { key: "powerup", label: "Power Up" },
  { key: "ship", label: "Ship" },
];

const JourneyProgress = ({ currentSection, questionProgress }) => {
  const idx = journeySteps.findIndex((s) => s.key === currentSection);
  const mobile = useIsMobile();

  const renderShape = (i, size, active, past) => {
    const color = past ? T.color.sage : active ? T.color.copper : T.color.border;
    return (
      <div style={{
        transition: `all 0.5s ${T.ease.smooth}`,
        transform: active ? "scale(1.3)" : "scale(1)",
        lineHeight: 0,
      }}>
        <OrganicShape shapeIndex={sectionShapes[i]} size={size} color={color} />
      </div>
    );
  };

  if (mobile) {
    return (
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: `linear-gradient(to bottom, ${T.color.bg}ee, ${T.color.bg}00)`,
        padding: "14px 20px 20px", pointerEvents: "none",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {journeySteps.map((s, i) => (
              <div key={s.key}>{renderShape(i, i === idx ? 14 : 10, i === idx, i < idx)}</div>
            ))}
          </div>
          <span style={{
            fontFamily: T.font.body, fontSize: 11, fontWeight: 500,
            letterSpacing: "0.04em", color: T.color.copper,
          }}>
            {journeySteps[idx]?.label}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: `linear-gradient(to bottom, ${T.color.bg}ee, ${T.color.bg}00)`,
      padding: "16px 0 28px", pointerEvents: "none",
    }}>
      <div style={{
        maxWidth: 460, margin: "0 auto", padding: "0 20px",
        display: "flex", alignItems: "center",
      }}>
        {journeySteps.map((step, i) => {
          const active = i === idx, past = i < idx;
          return (
            <div key={step.key} style={{
              display: "flex", alignItems: "center",
              flex: i < journeySteps.length - 1 ? 1 : "none",
            }}>
              <div style={{ position: "relative" }}>
                {renderShape(i, active ? 14 : 10, active, past)}
                <div style={{
                  position: "absolute", top: "100%", left: "50%",
                  transform: "translateX(-50%)", marginTop: 8, whiteSpace: "nowrap",
                  fontFamily: T.font.body, fontSize: 10, fontWeight: active ? 500 : 400,
                  letterSpacing: "0.03em",
                  color: active ? T.color.copper : past ? T.color.sage : T.color.textLight,
                  opacity: active || past ? 1 : 0.45,
                  transition: `all 0.5s ${T.ease.smooth}`,
                }}>{step.label}</div>
              </div>
              {i < journeySteps.length - 1 && (
                <div style={{
                  flex: 1, height: 1.5, margin: "0 6px",
                  background: past ? T.color.sage : T.color.border,
                  borderRadius: 1, position: "relative", overflow: "hidden",
                }}>
                  {active && (
                    <div style={{
                      position: "absolute", left: 0, top: 0, bottom: 0,
                      width: `${questionProgress * 100}%`,
                      background: T.color.copper, borderRadius: 1,
                      transition: `width 0.6s ${T.ease.smooth}`,
                    }} />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ━━━ Interview Question (with gated stagger + contextual notice) ━ */
const InterviewQuestion = ({ question, subtext, type, options, value, onChange, onContinue, placeholder, staggerReady, notice }) => (
  <div>
    <h2 style={{
      fontFamily: T.font.display, fontSize: "clamp(24px,5vw,30px)",
      fontWeight: 400, lineHeight: 1.3, margin: "0 0 8px 0", color: T.color.text,
    }}>{question}</h2>
    {subtext && <p style={{ fontSize: 15, color: T.color.textMuted, margin: "0 0 28px 0", lineHeight: 1.65 }}>{subtext}</p>}
    {!subtext && <div style={{ height: 28 }} />}

    {type === "choice" && options.map((opt, i) => (
      <ChoiceButton key={opt.value} selected={value === opt.value}
        onClick={() => onChange(opt.value)} delay={i * 70} ready={staggerReady}>
        {opt.label}
      </ChoiceButton>
    ))}

    {/* Contextual notice — appears when a specific selection triggers it */}
    {notice && (
      <div style={{
        marginTop: 16, padding: "16px 20px",
        background: T.color.sageSoft,
        border: `1px solid ${T.color.sageBorder}`,
        borderRadius: 12,
        opacity: 1,
        animation: "fadeInNotice 0.4s ease",
      }}>
        <style>{`@keyframes fadeInNotice { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }`}</style>
        <div style={{ fontSize: 13, fontWeight: 500, color: T.color.sage, marginBottom: 4 }}>
          {notice.title}
        </div>
        <div style={{ fontSize: 13, color: T.color.textMuted, lineHeight: 1.6 }}>
          {notice.body}
        </div>
      </div>
    )}

    {type === "text" && <TextInput value={value || ""} onChange={onChange} onSubmit={onContinue} placeholder={placeholder} />}
    {type === "textarea" && <TextInput value={value || ""} onChange={onChange} onSubmit={onContinue} placeholder={placeholder} multiline />}
    <ContinueButton onClick={onContinue} disabled={!value || (typeof value === "string" && !value.trim())} />
  </div>
);

/* ━━━ Project Scoping Lookup Table ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const projectTemplates = {
  personal: [
    { keywords: ["cook", "food", "meal", "recipe", "dinner", "kitchen", "bak"],
      name: "A meal planner that thinks like you do",
      desc: "Generates weekly menus matched to your dietary preferences, what's in season, and how much time you actually have. Today we're getting it to produce one week of dinners you'd genuinely eat.",
      learns: "Prompting with constraints, structured output (formatted meal plans), iteration, and how to check that AI suggestions are actually practical." },
    { keywords: ["writ", "blog", "essay", "journal", "story", "content", "novel", "fiction"],
      name: "A writing partner that sharpens your drafts",
      desc: "A tool that helps you brainstorm, outline, and refine your writing. Not a replacement for your voice — a sounding board that pushes back. Today we'll get it drafting and revising one real piece.",
      learns: "Iterative prompting, system prompts for tone and voice, multi-step workflows (draft → critique → revise), and spotting when AI output drifts from your intent." },
    { keywords: ["fit", "workout", "gym", "exercise", "run", "train", "lift", "yoga"],
      name: "A workout builder matched to your goals",
      desc: "Creates training plans based on your equipment, schedule, and what you're working toward. Today we build one that generates a full week of sessions you'd actually do.",
      learns: "Providing personal context to AI, structured output (exercise tables), iterating on specificity, and verifying that fitness advice is sound." },
    { keywords: ["read", "book", "novel", "library"],
      name: "A reading list curator with taste",
      desc: "Recommends books based on what you've loved, explains why each pick fits, and organizes your to-read queue. Today we get it producing recommendations that genuinely surprise you.",
      learns: "Prompting with examples (teaching AI your taste), structured output, and evaluating recommendation quality." },
    { keywords: ["music", "guitar", "piano", "song", "band", "drum", "instrument", "practic"],
      name: "A practice companion that knows where you are",
      desc: "Generates exercises, suggests songs at your level, and helps you structure focused practice sessions. Today we build one session plan tailored to your instrument and goals.",
      learns: "Domain-specific prompting, structured output for practice plans, and how to iterate when AI gets musical details wrong." },
    { keywords: ["budget", "financ", "money", "saving", "invest", "spend", "expense"],
      name: "A budget tracker that surfaces what you'd miss",
      desc: "Categorizes your spending, spots patterns, and helps you build rules that stick. Today we get it analyzing a sample month and producing insights you'd act on.",
      learns: "Working with your data, structured output (tables and summaries), and the critical habit of verifying AI's math." },
    { keywords: ["game", "d&d", "dnd", "rpg", "dungeon", "campaign", "tabletop"],
      name: "An encounter generator for your campaign",
      desc: "Builds balanced combat encounters, NPCs with personality, and plot hooks matched to your party's level and story. Today we create one full encounter ready to run.",
      learns: "Creative prompting, system prompts for world-building context, structured output, and guiding AI toward specific creative constraints." },
    { keywords: ["travel", "trip", "vacation", "itinerary", "flight", "destination"],
      name: "A trip planner that goes beyond the obvious",
      desc: "Builds itineraries based on your interests, pace, and budget — not just top-10 tourist lists. Today we plan one real day in a place you want to go.",
      learns: "Providing rich context, structured output (itineraries), verifying AI's factual claims about real places, and iterating on specificity." },
    { keywords: ["photo", "camera", "edit", "lightroom", "image"],
      name: "A photo workflow assistant",
      desc: "Helps you organize, tag, and develop editing strategies for your photography. Today we build a tool that suggests edits for a specific style you're after.",
      learns: "Describing visual concepts to AI, iterative refinement, system prompts for creative direction, and knowing the limits of text-based AI with visual tasks." },
    { keywords: ["garden", "plant", "grow", "seed", "soil"],
      name: "A garden planner for your actual space",
      desc: "Plans what to plant, when, and where based on your climate, space, and what you want to grow. Today we get it producing a seasonal plan for your setup.",
      learns: "Location-specific prompting, structured output (planting calendars), verifying AI's horticultural claims, and iterating with real constraints." },
  ],
  work: [
    { keywords: ["email", "messag", "reply", "draft", "respond", "inbox", "slack"],
      name: "An email drafting assistant in your voice",
      desc: "Handles recurring message formats — status updates, follow-ups, responses — in a tone that sounds like you, not like a robot. Today we get it drafting three real messages you'd actually send.",
      learns: "System prompts for voice and tone, structured templates, iteration, and reviewing AI output before it represents you." },
    { keywords: ["report", "data", "spreadsheet", "excel", "csv", "analys", "number", "metric", "dashboard"],
      name: "A data summarizer for stakeholder updates",
      desc: "Pulls insights from your spreadsheets and formats them into clear narratives for the people who need them. Today we build one that turns raw data into a summary your team would value.",
      learns: "Working with uploaded data, structured output, prompting for specific analytical angles, and verifying AI's numerical claims." },
    { keywords: ["meeting", "note", "agenda", "minute", "standup", "sync", "action"],
      name: "A meeting prep and follow-up tool",
      desc: "Generates agendas from context, captures notes into structured formats, and tracks action items. Today we build the agenda + action-item workflow for one real meeting.",
      learns: "Multi-step workflows (prep → capture → follow-up), templates, system prompts for meeting context, and structured output." },
    { keywords: ["present", "slide", "deck", "powerpoint", "pitch"],
      name: "A presentation outline builder",
      desc: "Takes your rough ideas and structures them into clear, persuasive slide outlines with speaker notes. Today we outline one real presentation you need to give.",
      learns: "Prompting for structure, iterative refinement, system prompts for audience context, and knowing when AI's framing needs your judgment." },
    { keywords: ["code", "program", "develop", "bug", "script", "automat", "python", "javascript"],
      name: "A coding assistant for your workflow",
      desc: "Helps you write, debug, and automate scripts for tasks you do repeatedly. Today we build one automation that saves you real time this week.",
      learns: "Code-oriented prompting, review-before-run as a core habit, iterating on technical output, and understanding what AI-generated code is actually doing." },
    { keywords: ["write", "document", "policy", "procedure", "manual", "guide", "sop"],
      name: "A documentation assistant that cuts through the blank page",
      desc: "Drafts, structures, and refines internal documents from your rough notes and knowledge. Today we turn one real set of notes into a polished first draft.",
      learns: "Providing domain context, multi-step workflows (outline → draft → revise), system prompts for organizational voice, and verifying factual accuracy." },
    { keywords: ["custom", "client", "support", "ticket", "help", "service"],
      name: "A customer response helper",
      desc: "Drafts responses to common questions in your team's voice, with the right level of detail. Today we build templates for your three most frequent request types.",
      learns: "Template-based prompting, system prompts for brand voice, structured output, and the critical line between AI-drafted and human-reviewed." },
    { keywords: ["hire", "recruit", "resume", "interview", "job", "candidate"],
      name: "A hiring workflow assistant",
      desc: "Helps you write job descriptions, screen resumes for relevant experience, and generate structured interview questions. Today we build one job description and a matching interview guide.",
      learns: "Prompting with specific criteria, structured output, bias awareness in AI-assisted hiring, and the importance of human judgment in people decisions." },
  ],
  fallback: {
    personal: {
      name: "Your personal AI project",
      desc: "We'll build a custom tool around what you described — scoped to something you can finish today and keep using tomorrow.",
      learns: "Prompting with precision, running code, structured output, reviewing AI work, and the safety habits that tie it all together.",
    },
    work: {
      name: "Your AI-powered work assistant",
      desc: "We'll build a tool that handles part of the recurring task you described — scoped to a working first version you can use this week.",
      learns: "Prompting with precision, structured output, multi-step workflows, reviewing AI work, and data handling habits for the workplace.",
    },
  },
};

const matchProject = (input, type) => {
  const lower = (input || "").toLowerCase();
  const templates = projectTemplates[type] || [];
  for (const t of templates) {
    if (t.keywords.some((kw) => lower.includes(kw))) return t;
  }
  return projectTemplates.fallback[type] || projectTemplates.fallback.personal;
};

/* ━━━ Interview Flow (project-first, assessment woven in) ━━━━━━━ */
const getInterviewSteps = (answers) => {
  const steps = [];

  // ── Project conversation first ──
  steps.push({
    id: "fork",
    question: "What would you like to build?",
    subtext: "Work projects teach you things you'll use tomorrow. Personal projects light the spark faster. Both paths cover the same skills.",
    type: "choice",
    options: [
      { value: "work", label: "Something for work" },
      { value: "personal", label: "Something personal" },
    ],
  });

  if (answers.fork === "work") {
    steps.push({
      id: "project_idea",
      question: "What's something you do every week that feels repetitive?",
      subtext: "The best first AI project is a real task you already do. We'll build a tool that handles part of it.",
      type: "textarea", placeholder: "Every Monday I have to...",
    });
  } else if (answers.fork === "personal") {
    steps.push({
      id: "project_idea",
      question: "What's something you're into outside of work?",
      subtext: "A hobby, a side project, something you'd spend a Saturday afternoon on. We'll build around it.",
      type: "textarea", placeholder: "I'm really into...",
    });
  }

  // ── Assessment woven in after investment ──
  steps.push({
    id: "experience",
    question: "How would you describe your experience with AI tools?",
    subtext: "This shapes the pace. We'll meet you where you are.",
    type: "choice",
    options: [
      { value: "never", label: "Haven't really used one" },
      { value: "tried", label: "Tried it a couple of times" },
      { value: "occasional", label: "Use one occasionally" },
      { value: "regular", label: "Use one regularly" },
    ],
  });

  steps.push({
    id: "code_feeling",
    question: 'When you hear the word "code," what\'s your gut reaction?',
    subtext: "Be honest. There's a right answer and it's the true one.",
    type: "choice",
    options: [
      { value: "nervous", label: "Nervous — that's not my world" },
      { value: "curious", label: "Curious — I'd try with guidance" },
      { value: "indifferent", label: "Indifferent — just a tool" },
      { value: "comfortable", label: "Comfortable — I've written some" },
    ],
  });

  steps.push({
    id: "long_output",
    question: "Have you ever asked an AI to produce something longer than a paragraph?",
    subtext: "A document, a plan, a piece of code, anything substantial.",
    type: "choice",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
      { value: "unsure", label: "Not sure" },
    ],
  });

  // ── Adaptive follow-up ──
  const exp = answers.experience;
  if (exp === "never" || exp === "tried") {
    steps.push({
      id: "followup",
      question: "What made you curious enough to try this?",
      subtext: "Could be something you read, a problem you have, or plain curiosity.",
      type: "textarea", placeholder: "There's no wrong answer here...",
    });
  } else if (exp === "occasional") {
    steps.push({
      id: "followup",
      question: "What's the gap between what you know about AI and what you actually do with it?",
      subtext: "Most people in your position sense untapped potential. What does yours look like?",
      type: "textarea", placeholder: "The thing I keep meaning to try is...",
    });
  } else if (exp === "regular") {
    steps.push({
      id: "followup",
      question: "What's working for you with AI? What isn't?",
      subtext: "We'll build on the strengths and fill the gaps.",
      type: "textarea", placeholder: "Works well for... but I struggle with...",
    });
  }

  // ── Calibration ──
  steps.push({
    id: "time",
    question: "How much time do you have right now?",
    type: "choice",
    options: [
      { value: "30min", label: "About 30 minutes" },
      { value: "1hr", label: "About an hour" },
      { value: "norush", label: "No rush" },
    ],
  });

  steps.push({
    id: "setup",
    question: "Do you have Claude ready to go?",
    subtext: "You'll need it open in another tab for the building sections. Free accounts work fine.",
    type: "choice",
    options: [
      { value: "ready", label: "Yes, it's open" },
      { value: "have_account", label: "I have an account but need to open it" },
      { value: "need_account", label: "I need to set one up" },
    ],
  });

  return steps;
};

/* ━━━ Derive Path Card ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const derivePathCard = (answers) => {
  const levelMap = { never: "Newcomer", tried: "Newcomer", occasional: "Explorer", regular: "Practitioner" };
  const timeMap = { "30min": "~30 min", "1hr": "~1 hour", norush: "~75 min" };
  const setupMap = { ready: "Ready", have_account: "Open Claude →", need_account: "Sign up free →" };

  const type = answers.fork === "work" ? "work" : "personal";
  const matched = matchProject(answers.project_idea, type);

  const hasBuiltLong = answers.long_output === "yes";
  const learns = hasBuiltLong
    ? matched.learns.replace("Prompting with precision, running code for the first time, ", "Structured output, system prompts, multi-step workflows, ")
    : matched.learns;

  return {
    projectName: matched.name,
    projectDescription: matched.desc,
    level: levelMap[answers.experience] || "Explorer",
    time: timeMap[answers.time] || "~1 hour",
    setup: setupMap[answers.setup] || "Ready",
    learns,
  };
};

/* ━━━ Boarding Pass Path Card ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const PathCard = ({ data, onContinue }) => {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), 200); }, []);

  return (
    <div style={{
      background: T.color.bgCard, borderRadius: 20, overflow: "hidden",
      boxShadow: `0 8px 40px ${T.color.shadowDeep}, 0 1px 3px ${T.color.shadow}`,
      border: `1px solid ${T.color.border}`,
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0) scale(1)" : "translateY(24px) scale(0.97)",
      transition: `all 0.6s ${T.ease.smooth}`,
    }}>
      <div style={{ height: 4, background: `linear-gradient(90deg, ${T.color.copper}, ${T.color.sage})` }} />
      <div style={{ padding: "28px 28px 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: T.color.copper, fontFamily: T.font.body }}>
            Boarding Pass
          </div>
          <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: "0.06em", color: T.color.textLight, fontFamily: T.font.body, padding: "3px 10px", borderRadius: 20, background: T.color.bgSubtle }}>
            {data.level}
          </div>
        </div>
        <h2 style={{ fontFamily: T.font.display, fontSize: 24, fontWeight: 400, margin: 0, fontStyle: "italic", lineHeight: 1.3 }}>
          {data.projectName}
        </h2>
      </div>

      {/* Perforation */}
      <div style={{ position: "relative", height: 1, margin: "0 16px" }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, borderTop: `2px dashed ${T.color.border}` }} />
        <div style={{ position: "absolute", left: -25, top: -11, width: 22, height: 22, borderRadius: "50%", background: T.color.bg, boxShadow: `inset 2px 0 4px ${T.color.shadow}` }} />
        <div style={{ position: "absolute", right: -25, top: -11, width: 22, height: 22, borderRadius: "50%", background: T.color.bg, boxShadow: `inset -2px 0 4px ${T.color.shadow}` }} />
      </div>

      <div style={{ padding: "20px 28px 8px" }}>
        <p style={{ color: T.color.textMuted, fontSize: 14, lineHeight: 1.65, margin: "0 0 20px 0" }}>
          {data.projectDescription}
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 16 }}>
          {[{ label: "Duration", value: data.time }, { label: "Sections", value: "5" }, { label: "Setup", value: data.setup }].map((item) => (
            <div key={item.label} style={{ padding: "12px 0", borderTop: `1px solid ${T.color.border}` }}>
              <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: T.color.textLight, marginBottom: 4, fontFamily: T.font.body }}>{item.label}</div>
              <div style={{ fontSize: 15, fontWeight: 500, fontFamily: T.font.body }}>{item.value}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: T.color.bgSubtle, padding: "18px 28px 24px", borderTop: `1px solid ${T.color.border}` }}>
        <div style={{ fontSize: 12, fontWeight: 500, letterSpacing: "0.04em", color: T.color.textMuted, marginBottom: 4 }}>
          What you'll pick up along the way
        </div>
        <div style={{ fontSize: 13, color: T.color.textLight, lineHeight: 1.6 }}>{data.learns}</div>
        <ContinueButton onClick={onContinue} label="Start building" />
      </div>
    </div>
  );
};

/* ━━━ Setup Prompt ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const SetupPrompt = ({ status }) => {
  if (status === "ready") return null;
  return (
    <div style={{ background: T.color.copperSoft, border: `1px solid rgba(191,123,94,0.18)`, borderRadius: 14, padding: "18px 22px", marginBottom: 24 }}>
      <div style={{ fontSize: 14, fontWeight: 500, color: T.color.copper, marginBottom: 6 }}>
        {status === "need_account" ? "Quick setup needed" : "One more thing"}
      </div>
      <p style={{ fontSize: 14, color: T.color.textMuted, lineHeight: 1.6, margin: 0 }}>
        {status === "need_account"
          ? "Head to claude.ai and create a free account. Takes about 60 seconds. Come back when you're in."
          : "Open claude.ai in another tab so it's ready when we start building."}
      </p>
    </div>
  );
};

/* ━━━ Organic Shape System ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
// Hand-wobbled clip-paths give each shape a slightly imperfect, human feel.
// The progression: triangle(3) → square(4) → pentagon(5) → hexagon(6) → circle(∞)
const shapeClips = [
  // Triangle — slightly uneven, one side a little longer
  "polygon(50% 4%, 96% 88%, 6% 84%)",
  // Square — soft corners via rounded rect feel, one corner slightly off
  "polygon(8% 6%, 94% 8%, 92% 94%, 6% 92%)",
  // Pentagon — organic, not ruler-straight
  "polygon(50% 3%, 97% 38%, 80% 95%, 20% 95%, 3% 38%)",
  // Hexagon — slight wobble on each vertex
  "polygon(50% 2%, 95% 26%, 95% 74%, 50% 98%, 5% 74%, 5% 26%)",
  // Circle — approximated with many points but using border-radius instead
  null, // null signals "use border-radius: 50%"
];

// Organic border-radius values that feel hand-made
const shapeRadius = [
  "4px",      // triangle (clip-path handles shape)
  "5px",      // square (clip-path handles shape)
  "4px",      // pentagon
  "4px",      // hexagon
  "50%",      // circle
];

const sectionShapes = [0, 1, 2, 3, 4]; // indices into shapeClips

const OrganicShape = ({ shapeIndex, size = 10, color, style = {} }) => (
  <div style={{
    width: size, height: size, background: color,
    clipPath: shapeClips[shapeIndex] || "none",
    borderRadius: shapeClips[shapeIndex] ? shapeRadius[shapeIndex] : "50%",
    transition: `all 0.5s ${T.ease.smooth}`,
    ...style,
  }} />
);

/* ━━━ Welcome Screen ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const WelcomeScreen = ({ onBegin }) => (
  <div style={{
    minHeight: "100vh", background: T.color.bg, fontFamily: T.font.body,
    color: T.color.text, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden",
  }}>
    <div style={{ maxWidth: 560, margin: "0 auto", padding: "0 20px", textAlign: "center" }}>

      {/* Shapes fall into place above the headline */}
      <div style={{
        position: "relative", width: 160, height: 100,
        margin: "0 auto 40px",
      }}>
        <div style={{
          position: "absolute",
          left: "calc(50% - 40px)", top: "calc(50% - 4px)",
          opacity: 0,
          animation: "fallBounce 1.4s cubic-bezier(0.12, 0, 0.25, 1) 0.3s both",
        }}>
          <OrganicShape shapeIndex={0} size={46} color={T.color.copper} />
        </div>
        <div style={{
          position: "absolute",
          left: "calc(50% + 12px)", top: "calc(50% - 10px)",
          opacity: 0,
          animation: "fallBounceRight 1.4s cubic-bezier(0.12, 0, 0.25, 1) 0.9s both",
        }}>
          <OrganicShape shapeIndex={1} size={36} color={T.color.sage} />
        </div>
        <div style={{
          position: "absolute",
          left: "calc(50% - 8px)", top: "calc(50% + 22px)",
          opacity: 0,
          animation: "fallBounceStraight 1.4s cubic-bezier(0.12, 0, 0.25, 1) 1.5s both",
        }}>
          <OrganicShape shapeIndex={4} size={29} color={`${T.color.text}25`} />
        </div>
      </div>

      {/* Headline */}
      <h1 style={{
        fontFamily: T.font.display, fontSize: "clamp(38px,8vw,56px)",
        fontWeight: 400, lineHeight: 1.1, margin: "0 0 24px 0",
        fontStyle: "italic",
      }}>
        Build something<br /><span style={{ color: T.color.copper }}>real</span> with AI
      </h1>

      {/* Subtext */}
      <p style={{
        fontSize: 17, lineHeight: 1.7, color: T.color.textMuted, maxWidth: 420, margin: "0 auto 44px",
      }}>
        We'll figure out what you want to make, hand you the tools,
        teach you what to watch out for, and get out of the way.
        One finished project. No experience required.
      </p>

      {/* Button — visible immediately */}
      <ContinueButton onClick={onBegin} label="Let's go" />

      {/* Journey pills — fade in after shapes have landed */}
      <div style={{ marginTop: 56, display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 8 }}>
        {journeySteps.map((s, i) => (
          <span key={s.key} style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            fontSize: 12, fontWeight: 400, color: T.color.textLight,
            padding: "5px 12px", borderRadius: 20, border: `1px solid ${T.color.border}`,
            opacity: 0,
            animation: `softFadeUp 0.5s ${T.ease.smooth} ${2.6 + i * 0.08}s both`,
          }}>
            <OrganicShape shapeIndex={sectionShapes[i]} size={10} color={T.color.textLight} />
            {s.label}
          </span>
        ))}
      </div>
    </div>
  </div>
);

/* ━━━ Threshold Interstitial (self-contained, auto-advances) ━━━━ */
const ThresholdInterstitial = ({ onComplete }) => {
  const [phase, setPhase] = useState(0); // 0=entering, 1=visible, 2=exiting

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 50);
    const t2 = setTimeout(() => setPhase(2), 1800);
    const t3 = setTimeout(() => onComplete(), 2400);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete]);

  return (
    <>
      <Fonts />
      <GrainOverlay />
      <div style={{
        minHeight: "100vh", background: T.color.bg, position: "relative",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: T.font.body,
      }}>
        <div style={{
          textAlign: "center", padding: "0 20px",
          opacity: phase === 1 ? 1 : 0,
          transform: phase === 0
            ? "translateY(24px) scale(0.96)"
            : phase === 2
            ? "translateY(-16px) scale(1.02)"
            : "translateY(0) scale(1)",
          filter: phase === 1 ? "blur(0px)" : "blur(3px)",
          transition: phase === 2
            ? `all 0.5s ${T.ease.page}`
            : `all 0.6s ${T.ease.smooth}`,
        }}>
          <div style={{
            fontFamily: T.font.display, fontSize: 28, fontStyle: "italic",
            color: T.color.text, marginBottom: 8,
          }}>
            Let's find your project.
          </div>
          <div style={{ fontSize: 15, color: T.color.textMuted }}>
            A few questions, then we build.
          </div>
        </div>
      </div>
    </>
  );
};

/* ━━━ Main App ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export default function App() {
  const [screen, setScreen] = useState("welcome"); // welcome | transition | interview | pathcard
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [currentValue, setCurrentValue] = useState(null);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = back
  const [staggerReady, setStaggerReady] = useState(true);
  const [showFirstLabel, setShowFirstLabel] = useState(true);

  const stepsKey = `${answers.fork}|${answers.experience}`;
  const steps = useMemo(
    () => getInterviewSteps(answers),
    [stepsKey]
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

  // ── Welcome ──
  if (screen === "welcome") {
    return (
      <>
        <Fonts />
        <GrainOverlay />
        <WelcomeScreen onBegin={() => setScreen("transition")} />
      </>
    );
  }

  // ── Threshold transition (welcome → interview) ──
  if (screen === "transition") {
    return <ThresholdInterstitial onComplete={() => setScreen("interview")} />;
  }

  // ── Interview + Path Card ──
  return (
    <>
      <Fonts />
      <GrainOverlay />
      <div style={{
        minHeight: "100vh", background: T.color.bg,
        fontFamily: T.font.body, color: T.color.text,
        overflowX: "hidden", position: "relative", zIndex: 1,
      }}>
        {screen === "interview" && (
          <JourneyProgress currentSection="interview" questionProgress={stepIndex / totalSteps} />
        )}

        <div style={{
          maxWidth: 600, margin: "0 auto", padding: "0 20px",
          paddingTop: screen === "interview" ? 72 : 48, paddingBottom: 80,
        }}>
          {screen === "interview" && currentStep && (
            <PageTransition transitionKey={stepIndex} type="page"
              direction={direction} onEntered={handleTransitionEntered}>
              <div>
                {/* Back button (all questions after the first) */}
                {stepIndex > 0 && <BackButton onClick={navigateBack} />}

                {/* Section label only on first question */}
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
                <PathCard data={derivePathCard(answers)} onContinue={() => {}} />
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
        </div>
      </div>
    </>
  );
}
