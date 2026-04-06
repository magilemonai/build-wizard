import { useState, useEffect } from "react";
import T from "../tokens.js";
import OrganicShape, { sectionShapes } from "../components/OrganicShape.jsx";
import { journeySteps } from "../components/JourneyProgress.jsx";

/* ━━━ Welcome Back Screen ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Shown when a returning user has saved progress. Shows where
   they left off and gives them the choice to resume or start fresh.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export default function WelcomeBack({ savedScreen, projectIdea, onResume, onStartOver }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), 50); return () => clearTimeout(t); }, []);

  // Find the section index the user was on
  const sectionIdx = journeySteps.findIndex((s) => s.key === savedScreen);
  const sectionLabel = sectionIdx >= 0 ? journeySteps[sectionIdx].label : "your session";
  const shapeIdx = sectionIdx >= 0 ? sectionShapes[sectionIdx] : 4;

  return (
    <div style={{
      minHeight: "100vh", background: T.color.bg, position: "relative",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: T.font.body,
    }}>
      <div style={{
        textAlign: "center", padding: "0 24px", maxWidth: 480,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: `all 0.6s ${T.ease.smooth}`,
      }}>
        {/* Section shape as hero */}
        <div style={{ marginBottom: 20 }}>
          <OrganicShape shapeIndex={shapeIdx} size={48} color={T.color.copper} />
        </div>

        <h1 style={{
          fontFamily: T.font.display, fontSize: "clamp(28px,6vw,38px)",
          fontWeight: 400, fontStyle: "italic", lineHeight: 1.2,
          color: T.color.text, margin: "0 0 12px 0",
        }}>
          Welcome back.
        </h1>

        <p style={{
          fontSize: 16, color: T.color.textMuted, lineHeight: 1.65,
          margin: "0 0 8px 0",
        }}>
          You were in <strong style={{ color: T.color.text }}>{sectionLabel}</strong>
          {projectIdea && (
            <>, working on <strong style={{ color: T.color.text }}>{projectIdea}</strong></>
          )}.
        </p>

        {/* Progress visualization */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          gap: 8, margin: "24px 0 32px",
        }}>
          {journeySteps.map((step, i) => {
            const past = i < sectionIdx;
            const active = i === sectionIdx;
            return (
              <div key={step.key} style={{
                display: "flex", alignItems: "center", gap: 8,
              }}>
                <div style={{
                  opacity: past || active ? 1 : 0.3,
                  transform: active ? "scale(1.4)" : "scale(1)",
                  transition: `all 0.4s ${T.ease.smooth}`,
                  lineHeight: 0,
                }}>
                  <OrganicShape
                    shapeIndex={sectionShapes[i]}
                    size={active ? 16 : 10}
                    color={past ? T.color.sage : active ? T.color.copper : T.color.border}
                  />
                </div>
                {i < journeySteps.length - 1 && (
                  <div style={{
                    width: 20, height: 1.5,
                    background: past ? T.color.sage : T.color.border,
                    borderRadius: 1,
                  }} />
                )}
              </div>
            );
          })}
        </div>

        <button
          onClick={onResume}
          style={{
            padding: "14px 36px",
            background: T.color.copper,
            color: "#fff",
            border: "none", borderRadius: 10,
            fontFamily: T.font.body, fontSize: 16, fontWeight: 500,
            cursor: "pointer",
            marginBottom: 16,
            display: "block", width: "100%", maxWidth: 280, margin: "0 auto 16px",
          }}
        >
          Pick up where I left off
        </button>

        <button
          onClick={() => {
            if (window.confirm("This will clear all your progress. Start fresh?")) {
              onStartOver();
            }
          }}
          style={{
            background: "none", border: "none", cursor: "pointer",
            color: T.color.textLight, fontFamily: T.font.body, fontSize: 14,
            textDecoration: "underline", textUnderlineOffset: 3,
          }}
        >
          Start fresh instead
        </button>
      </div>
    </div>
  );
}
