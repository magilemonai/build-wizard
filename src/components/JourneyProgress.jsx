import T from "../tokens.js";
import { useIsMobile } from "../hooks.js";
import OrganicShape, { sectionShapes } from "./OrganicShape.jsx";

/* ━━━ Journey Progress (responsive) ━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export const journeySteps = [
  { key: "interview", label: "Interview" },
  { key: "icebreaker", label: "Ice Breaker" },
  { key: "foundation", label: "Foundation" },
  { key: "powerup", label: "Power Up" },
  { key: "ship", label: "Ship" },
];

export default function JourneyProgress({ currentSection, questionProgress }) {
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
        background: `linear-gradient(to bottom, ${T.color.bg} 60%, ${T.color.bg}00 100%)`,
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
      background: `linear-gradient(to bottom, ${T.color.bg} 70%, ${T.color.bg}00 100%)`,
      padding: "14px 0 40px", pointerEvents: "none",
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
}
